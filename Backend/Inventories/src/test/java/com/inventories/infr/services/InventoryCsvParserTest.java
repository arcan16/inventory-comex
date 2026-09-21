package com.inventories.infr.services;

import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

/**
 * Valida el parser contra un reporte real de existencias del proveedor
 * (formato con filas/columnas basura), tal como lo procesaba antes
 * CargaDeArchivos/modules/converter.py.
 */
class InventoryCsvParserTest {

    private final InventoryCsvParser parser = new InventoryCsvParser();

    @Test
    void parsesRealSupplierReport() throws IOException {
        MockMultipartFile file = loadSample("csv/GALONES.csv");

        InventoryCsvParser.ParsedInventoryFile result = parser.parse(file);

        assertEquals("4 LTS", result.presentation());
        assertEquals(333, result.rows().size());

        InventoryCsvParser.ProductRow first = result.rows().get(0);
        assertEquals("10292", first.productId());
        assertEquals("THINNER E", first.description());
        assertEquals(1.200f, first.stock());

        InventoryCsvParser.ProductRow last = result.rows().get(result.rows().size() - 1);
        assertEquals("HP-10-YEL", last.productId());
        assertEquals("YELLOW TINT", last.description());
        assertEquals(1.000f, last.stock());
    }

    @Test
    void rejectsFileWithoutExpectedShape() {
        MockMultipartFile file = new MockMultipartFile("file", "bad.csv", "text/csv",
                "a,b,c\n1,2,3\n".getBytes());

        assertThrows(IllegalArgumentException.class, () -> parser.parse(file));
    }

    private MockMultipartFile loadSample(String classpathLocation) throws IOException {
        try (InputStream inputStream = getClass().getClassLoader().getResourceAsStream(classpathLocation)) {
            if (inputStream == null) {
                throw new IllegalStateException("No se encontro el archivo de prueba " + classpathLocation);
            }
            return new MockMultipartFile("file", "GALONES.csv", "text/csv", inputStream.readAllBytes());
        }
    }
}
