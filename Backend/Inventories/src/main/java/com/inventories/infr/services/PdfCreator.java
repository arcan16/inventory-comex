package com.inventories.infr.services;

import com.inventories.dto.productsCount.CountsdifferenceDTO;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import jakarta.servlet.ServletContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;


@Service
public class PdfCreator {
    Document document;
    FileOutputStream fileOutputStream;

    Font fontTitle = FontFactory.getFont(FontFactory.TIMES, 16);
    Font fontParagraph = FontFactory.getFont(FontFactory.HELVETICA, 12);

    public void createPdf(Long idInventory) throws DocumentException, IOException {
        document = new Document(PageSize.A4, 35, 30, 50, 50);
        String pdfPath = ("src/main/resources/files/");
        Path path = Paths.get("src/main/resources/files/");
        Files.createDirectories(path.getParent());
        fileOutputStream = new FileOutputStream(pdfPath + "summary_"+idInventory+".pdf" );

        PdfWriter.getInstance(document, fileOutputStream);
    }

    public void openPdf(){
        document.open();

    }

    public void addTitle(String title) throws DocumentException {
        PdfPTable table = new PdfPTable(1);
        PdfPCell cell = new PdfPCell(new Phrase(title, fontTitle));
        cell.setColspan(5);
        cell.setBorderColor(BaseColor.WHITE);
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        table.addCell(cell);
        document.add(table);
    }

    public void addParagraph(String myText) throws DocumentException {
        Paragraph paragraph = new Paragraph();
        paragraph.add(new Phrase(myText, fontParagraph));
        document.add(paragraph);
    }

    public void addLineBreaks() throws DocumentException {
        Paragraph lineBreaks = new Paragraph();
        lineBreaks.add(new Phrase(Chunk.NEWLINE));
        lineBreaks.add(new Phrase(Chunk.NEWLINE));
        document.add(lineBreaks);
    }

    public void addCountTable(List<CountsdifferenceDTO> report) throws DocumentException {
        PdfPTable table = new PdfPTable(5);
        float[] columnWidths = {1f, 3f, 1f, 1f, 1f}; // Ancho relativo de cada columna
        table.setWidths(columnWidths);
        table.addCell("Id");
        table.addCell("Descripcion");
        table.addCell("Stock");
        table.addCell("Fisico");
        table.addCell("Diferencia");
//        document.add(table);

        for(CountsdifferenceDTO counts : report){
           if(counts.difference()==null || counts.difference()!=0){
               table.addCell(String.valueOf(counts.idProduct()));
               table.addCell(String.valueOf(counts.description()));
               table.addCell(String.valueOf(counts.stock()));
               table.addCell(String.valueOf(counts.sum()));
               table.addCell(String.valueOf(counts.difference()));
           }
        }

        document.add(table);
        closeDocument();
    }
    public void closeDocument(){
        try {
            if (document != null) {
                document.close();
            }
            if (fileOutputStream != null) {
                fileOutputStream.close();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
