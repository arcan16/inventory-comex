package com.inventories.infr.services;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Puerto a Java de la limpieza que antes hacia a mano
 * CargaDeArchivos/modules/converter.py sobre el reporte de existencias que
 * entrega el proveedor. El archivo trae 4 filas de encabezado/metadatos
 * antes del encabezado real (fila 5), varias columnas vacias intercaladas,
 * una columna "NO SHOW" que no se usa, y 2 filas de pie de reporte al final.
 */
@Component
public class InventoryCsvParser {

    private static final String HEADER_PRODUCT = "PRODUCTO";
    private static final String HEADER_UNIT = "UNIDAD";
    private static final String HEADER_STOCK = "EXISTENCIA";
    private static final String HEADER_DESCRIPTION = "DESCRIPCION DEL PRODUCTO";
    private static final String HEADER_NO_SHOW = "NO SHOW";

    // Indice (0-based) de la fila que trae el encabezado real dentro del archivo (fila 5 del csv).
    private static final int HEADER_ROW_INDEX = 4;
    // A partir de que fila (0-based) comienzan los datos (fila 6 del csv).
    private static final int DATA_START_INDEX = 5;
    // Cuantas columnas quedan tras eliminar "NO SHOW" antes de filtrar las que no tienen nombre.
    private static final int MAX_COLUMNS_AFTER_DROP = 6;
    // Filas de pie de reporte al final del archivo que deben descartarse.
    private static final int TRAILING_ROWS_TO_DISCARD = 2;

    public record ProductRow(String productId, String description, float stock) {
    }

    public record ParsedInventoryFile(String presentation, List<ProductRow> rows) {
    }

    public ParsedInventoryFile parse(MultipartFile file) throws IOException {
        List<CSVRecord> allLines;
        try (InputStreamReader reader = new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8);
             CSVParser parser = CSVFormat.DEFAULT.builder().setIgnoreEmptyLines(true).build().parse(reader)) {
            allLines = parser.getRecords();
        }

        if (allLines.size() <= DATA_START_INDEX) {
            throw new IllegalArgumentException("El archivo no tiene el formato esperado del reporte de existencias");
        }

        Map<String, Integer> columnIndexByName = resolveColumns(allLines.get(HEADER_ROW_INDEX));

        List<CSVRecord> dataRows = allLines.subList(DATA_START_INDEX, allLines.size());
        if (dataRows.size() <= TRAILING_ROWS_TO_DISCARD) {
            throw new IllegalArgumentException("El archivo no contiene productos para cargar");
        }
        dataRows = dataRows.subList(0, dataRows.size() - TRAILING_ROWS_TO_DISCARD);

        int productIdx = columnIndexByName.get(HEADER_PRODUCT);
        int unitIdx = columnIndexByName.get(HEADER_UNIT);
        int stockIdx = columnIndexByName.get(HEADER_STOCK);
        int descriptionIdx = columnIndexByName.get(HEADER_DESCRIPTION);

        List<ProductRow> rows = new ArrayList<>();
        for (CSVRecord record : dataRows) {
            String productId = record.get(productIdx).trim();
            if (productId.isEmpty()) {
                throw new IllegalArgumentException("La fila " + record.getRecordNumber() + " del archivo no tiene un id de producto valido");
            }

            String stockRaw = record.get(stockIdx).trim();
            float stock;
            try {
                stock = Float.parseFloat(stockRaw);
            } catch (NumberFormatException e) {
                throw new IllegalArgumentException("La fila " + record.getRecordNumber() + " tiene un valor de existencia invalido: '" + stockRaw + "'");
            }

            String description = record.get(descriptionIdx).trim();
            rows.add(new ProductRow(productId, description, stock));
        }

        String presentation = dataRows.get(0).get(unitIdx).trim();
        return new ParsedInventoryFile(presentation, rows);
    }

    /**
     * Replica: eliminar la columna "NO SHOW", quedarse con las primeras 6 columnas
     * restantes, y descartar de esas 6 las que no tengan nombre en el encabezado.
     */
    private Map<String, Integer> resolveColumns(CSVRecord headerRow) {
        int noShowIndex = -1;
        for (int i = 0; i < headerRow.size(); i++) {
            if (HEADER_NO_SHOW.equals(headerRow.get(i).trim())) {
                noShowIndex = i;
                break;
            }
        }

        List<Integer> remainingIndices = new ArrayList<>();
        for (int i = 0; i < headerRow.size(); i++) {
            if (i != noShowIndex) {
                remainingIndices.add(i);
            }
        }

        List<Integer> firstColumns = remainingIndices.subList(0, Math.min(MAX_COLUMNS_AFTER_DROP, remainingIndices.size()));

        Map<String, Integer> columnIndexByName = new LinkedHashMap<>();
        for (int index : firstColumns) {
            String name = headerRow.get(index).trim();
            if (!name.isEmpty()) {
                columnIndexByName.put(name, index);
            }
        }

        for (String required : List.of(HEADER_PRODUCT, HEADER_UNIT, HEADER_STOCK, HEADER_DESCRIPTION)) {
            if (!columnIndexByName.containsKey(required)) {
                throw new IllegalArgumentException("El archivo no contiene la columna esperada '" + required + "'");
            }
        }

        return columnIndexByName;
    }
}
