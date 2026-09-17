package com.inventories.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.inventories.dto.productsCount.*;
import com.inventories.infr.services.PdfCreator;
import com.inventories.models.InventoriesEntity;
import com.inventories.models.ProductCountsEntity;
import com.inventories.models.ProductsEntity;
import com.inventories.models.StockEntity;
import com.inventories.repositories.InventoriesRepository;
import com.inventories.repositories.ProductCountsRepository;
import com.inventories.repositories.ProductsRepository;
import com.inventories.repositories.StockRepository;
import com.itextpdf.text.DocumentException;
import jakarta.servlet.ServletContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.support.ServletContextResource;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/productCounts")
public class ProductCountsController {


    @Autowired
    private ResourceLoader resourceLoader;

    @Autowired
    private ProductCountsRepository productCountsRepository;

    @Autowired
    private InventoriesRepository inventoriesRepository;

    @Autowired
    private ProductsRepository productsRepository;

    @Autowired
    private StockRepository stockRepository;

    @Autowired
    private PdfCreator pdfCreator;


    /**
     * Crea un nuevo registro con los datos del producto encontrado en el conteo fisico del inventario
     * @param newProductCountDTO DTO utilizado para recibir la informacion y crear un objeto que pueda ser manipulado
     * @return Informacion con registro creado
     */
    @PostMapping
    public ResponseEntity<?> addPhysicalProduct(@RequestBody @Valid NewProductCountDTO newProductCountDTO){
        System.out.println(newProductCountDTO);

        ProductCountsEntity productCounts= new ProductCountsEntity();
        Optional<InventoriesEntity> inventories = inventoriesRepository.findById(newProductCountDTO.idInventory());
        if(inventories.isEmpty())
            return ResponseEntity.badRequest().body("{\"err\": \"El id del Inventario no existe\"}");

        ProductsEntity products = productsRepository.findByStringId(newProductCountDTO.idProduct());
        if(products==null)
            return ResponseEntity.badRequest().body("{\"err\": \"El id del Producto no existe\"}");

        productCounts.setIdInventory(inventories.get());
        productCounts.setIdProduct(products);
        productCounts.setQuantity(newProductCountDTO.quantity());
        productCountsRepository.save(productCounts);
        return ResponseEntity.ok(new ProductCountsCreatedDTO(productCounts));
    }


    @PostMapping("/createProductAddCount")
    @Transactional
    public ResponseEntity<?> createProductAddCount(@RequestBody @Valid CreateProductCountDTO createProductCountDTO){
        Optional<InventoriesEntity> inventories = inventoriesRepository.findById(createProductCountDTO.idInventory());
        if(inventories.isEmpty()){
            return ResponseEntity.badRequest().body("{\"err\":\"El id del inventario no existe, favor de verificarlo\"}");
        }
        System.out.println("Primer validacion");

        ProductsEntity productsEntity = productsRepository.findByStringId(createProductCountDTO.idProduct());
        if(productsEntity!=null){
            return ResponseEntity.badRequest().body("{\"err\":\"El id del producto ya existe, no es posible duplicarlo\"}");
        }

        System.out.println("Segunda  validacion");

        System.out.println("Data recibida "+createProductCountDTO);

        ProductsEntity newProduct = new ProductsEntity(createProductCountDTO.idProduct(), createProductCountDTO.description());
        productsRepository.save(newProduct);

        System.out.println("producto creado" + newProduct);

        ProductCountsEntity productCounts= new ProductCountsEntity();
        productCounts.setIdInventory(inventories.get());
        productCounts.setIdProduct(newProduct);
        productCounts.setQuantity(createProductCountDTO.quantity());
        productCountsRepository.save(productCounts);

        System.out.println("Conteo creado" + productCounts);


        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode jsonResponse = objectMapper.createObjectNode();

        ObjectNode productCreated = objectMapper.valueToTree(newProduct);
        jsonResponse.set("newProduct",productCreated);

        ObjectNode productCountCreated = objectMapper.valueToTree(productCounts);
        jsonResponse.set("countCreated", productCountCreated);

        return ResponseEntity.ok().body(jsonResponse);
    }

    /**
     * Obtiene la lista del conteo registrado con el id del inventario recibido a traves de la url
     * @param idInventory id numerico recibido a traves de la url
     * @return Lista de elementos encontrados
     */
    @GetMapping("/{idInventory}")
    public ResponseEntity<?> getInventoryCount(@PathVariable @NotNull Long idInventory){
        List<ProductCountsEntity> productCountsList = productCountsRepository.getInventoryCounts(idInventory);
        return ResponseEntity.ok(productCountsList.stream().map(ListProductCountsDTO::new));
    }

    /**
     * Crea un resumen del conteo registrado, en el que se indica el total de cada producto, el stock que deberia
     * existir y la diferencia
     * @param idInventory Identificador del inventario al que se le realizara el resumen
     * @return Regresa un
     */
    @GetMapping("/summary/{idInventory}")
    public ResponseEntity<?> getFinishReport(@PathVariable @NotNull Long idInventory)  {

        List<StockEntity> stock = stockRepository.findByIdInventory(idInventory);
        List<ProductCountsEntity> productCounts = productCountsRepository.getInventoryCounts(idInventory);

        if(stock.isEmpty() || productCounts.isEmpty())
            return ResponseEntity.badRequest().body("{\"err\":\" El id no existe\"}");

        List<CountsdifferenceDTO> summary = productCountsRepository.getCountDifference(idInventory);

        return ResponseEntity.ok().body(summary);
    }

    /**
     * Genera un reporte en formato pdf con los resultados del conteo fisico del inventario
     * @param idInventory
     * @return
     * @throws DocumentException
     * @throws IOException
     */
    @GetMapping("/report/{idInventory}")
    public ResponseEntity<?> getAllFiles(@PathVariable Long idInventory) throws DocumentException, IOException {

        List<StockEntity> stock = stockRepository.findByIdInventory(idInventory);
        List<ProductCountsEntity> productCounts = productCountsRepository.getInventoryCounts(idInventory);

        if(stock.isEmpty() || productCounts.isEmpty())
            return ResponseEntity.badRequest().body("{\"err\":\" El id no existe\"}");


        List<CountsdifferenceDTO> report = productCountsRepository.getCountDifference(idInventory);


        pdfCreator.createPdf(idInventory);
        pdfCreator.openPdf();
        pdfCreator.addTitle("Reporte de Inventario Comex Anahuac");
        pdfCreator.addLineBreaks();
        pdfCreator.addParagraph("Resumen del conteo del inventario fisico");
        pdfCreator.addLineBreaks();
        pdfCreator.addCountTable(report);
        pdfCreator.closeDocument();
        System.out.println("Reporte creado");


        Resource resource = resourceLoader.getResource("classpath:/files/summary_"+ idInventory+".pdf");
        if (resource.exists() && resource.isReadable()) {
            HttpHeaders headers = new HttpHeaders();
            headers.add("filename","summary_"+ idInventory+".pdf");
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", "summary_"+ idInventory+".pdf");
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(resource);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/allReports")
    public ResponseEntity<?> getAllReports(){
        List<ReportsDTO> reportsDTOList = productCountsRepository.getReports();
        return ResponseEntity.ok(reportsDTOList);
    }


    /**
     * Elimina un registro del conteo fisico
     * @param idProductCount Id del registro que sera eliminado
     * @return Mensaje de confirmacion en caso de exito
     */
    @DeleteMapping("/{idProductCount}")
    public ResponseEntity<?> deleteInventoryCount(@PathVariable Long idProductCount){
        Optional<ProductCountsEntity> productCounts = productCountsRepository.findById(idProductCount);
        if(productCounts.isEmpty())
            return ResponseEntity.badRequest().body("{\"err\":\" El id no existe \"}");
        productCountsRepository.deleteById(idProductCount);

        return ResponseEntity.ok().body("{\"status\":\"Eliminado correctamente\"}");
    }

}
