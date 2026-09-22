package com.inventories.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.inventories.dto.inventories.InventoriesDTO;
import com.inventories.dto.products.ProductsDTO;
import com.inventories.dto.productsCount.ProductCountsEntryDTO;
import com.inventories.dto.stock.StockListDTO;
import com.inventories.infr.services.InventoryService;
import com.inventories.models.InventoriesEntity;
import com.inventories.models.ProductCountsEntity;
import com.inventories.repositories.InventoriesRepository;
import com.inventories.repositories.ProductCountsRepository;
import com.inventories.repositories.ProductsRepository;
import com.inventories.repositories.StockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/inventories")
public class InventoriesController {

    @Autowired
    private InventoriesRepository inventoriesRepository;

    @Autowired
    private ProductCountsRepository productCountsRepository;

    @Autowired
    private ProductsRepository productsRepository;

    @Autowired
    private StockRepository stockRepository;

    @Autowired
    private InventoryService inventoryService;

    @GetMapping
    public ResponseEntity<?> getAllInventories(@PageableDefault(size = 10)Pageable pageable){
        List<InventoriesEntity> inventories = inventoriesRepository.findAll();
        return ResponseEntity.ok(inventoriesRepository.findAll(pageable).map(InventoriesDTO::new));
    }

    /**
     * Crea una lista con todos los elementos que incluyan el tipo de dato recibido
     * @param type String con el valor de la presentacion que sera buscada
     * @return Lista de datos
     */
    @GetMapping("/allByType/{type}")
    public ResponseEntity<?> getAllInventoriesByType(@PathVariable String type){
        List<InventoriesDTO> inventoriesList = inventoryService.getByType(type);
        if(inventoriesList.isEmpty())
            return ResponseEntity.notFound().build();
        return ResponseEntity.ok().body(inventoriesList);
    }

    @GetMapping("/normal/{idInventory}")
    public ResponseEntity<?> getNormalInventory(@PathVariable Long idInventory){
        List<ProductCountsEntity> productCountsList = productCountsRepository.getInventoryCounts(idInventory);
        List<ProductCountsEntryDTO> productCounts = productCountsList.stream().map(ProductCountsEntryDTO::new).toList();
        List<ProductsDTO> products = productsRepository.findAll().stream().map(ProductsDTO::new).toList();
        List<StockListDTO> stockList = stockRepository.getByIdInventory(idInventory);

        ObjectMapper objectMapper =new ObjectMapper();
        ObjectNode jsonResponse = objectMapper.createObjectNode();

        ArrayNode productsNode = objectMapper.valueToTree(products);
        jsonResponse.set("products", productsNode);

        ArrayNode productCountsNode = objectMapper.valueToTree(productCounts);
        jsonResponse.set("productsCount", productCountsNode);

        ArrayNode stockNode = objectMapper.valueToTree(stockList);
        jsonResponse.set("stock", stockNode);

        return ResponseEntity.ok().body(jsonResponse);
    }


    /**
     * Elimina el inventario indicado a traves del parametro recibido en la url
     * @param idInventory Parametro recibido en la url de la peticion
     * @return Regresa un mensaje de confirmacion
     */
    @DeleteMapping("/{idInventory}")
    public ResponseEntity<?> deleteInventory(@PathVariable Long idInventory){
        Optional<InventoriesEntity> inventories = inventoriesRepository.findById(idInventory);
        if(inventories.isEmpty())
            return ResponseEntity.badRequest().body("{\"err\": \" El id no existe \"}");
        inventoriesRepository.deleteById(idInventory);
        return ResponseEntity.ok().body("{\" message \": \" Inventario eliminado con exito \"}");

    }
}
