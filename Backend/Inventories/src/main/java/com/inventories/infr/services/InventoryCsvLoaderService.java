package com.inventories.infr.services;

import com.inventories.dto.inventories.InventoryUploadResultDTO;
import com.inventories.models.InventoriesEntity;
import com.inventories.models.ProductsEntity;
import com.inventories.models.StockEntity;
import com.inventories.models.UserEntity;
import com.inventories.repositories.InventoriesRepository;
import com.inventories.repositories.ProductsRepository;
import com.inventories.repositories.StockRepository;
import com.inventories.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.Date;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Puerto a Java de CargaDeArchivos/modules/db_connect.py: crea el inventario,
 * da de alta los productos nuevos (ignorando los que ya existen) y registra el
 * stock leido del archivo. Usa los repositorios JPA del proyecto, que ya
 * obtienen la conexion a la base de datos desde las variables de entorno
 * declaradas en application.properties (no credenciales hardcodeadas).
 */
@Service
public class InventoryCsvLoaderService {

    @Autowired
    private InventoryCsvParser inventoryCsvParser;

    @Autowired
    private InventoriesRepository inventoriesRepository;

    @Autowired
    private ProductsRepository productsRepository;

    @Autowired
    private StockRepository stockRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public InventoryUploadResultDTO loadInventory(MultipartFile file) throws IOException {
        InventoryCsvParser.ParsedInventoryFile parsed = inventoryCsvParser.parse(file);

        UserEntity actingUser = resolveActingUser();

        InventoriesEntity inventory = new InventoriesEntity();
        inventory.setInventoryDate(new Date(System.currentTimeMillis()));
        inventory.setPresentation(parsed.presentation());
        inventory.setCreatedBy(actingUser);
        inventory.setCreatedBySnapshot(actingUser != null ? actingUser.getUsuario() : null);
        inventoriesRepository.save(inventory);

        Set<String> incomingProductIds = new HashSet<>();
        Map<String, String> descriptionByProductId = new HashMap<>();
        for (InventoryCsvParser.ProductRow row : parsed.rows()) {
            incomingProductIds.add(row.productId());
            descriptionByProductId.putIfAbsent(row.productId(), row.description());
        }

        Set<String> existingProductIds = new HashSet<>();
        for (ProductsEntity existing : productsRepository.findAllById(incomingProductIds)) {
            existingProductIds.add(existing.getId());
        }

        List<ProductsEntity> newProducts = new ArrayList<>();
        for (String productId : incomingProductIds) {
            if (!existingProductIds.contains(productId)) {
                newProducts.add(new ProductsEntity(productId, descriptionByProductId.get(productId)));
            }
        }
        if (!newProducts.isEmpty()) {
            productsRepository.saveAll(newProducts);
        }

        Map<String, ProductsEntity> productById = new HashMap<>();
        for (ProductsEntity product : productsRepository.findAllById(incomingProductIds)) {
            productById.put(product.getId(), product);
        }

        List<StockEntity> stockRows = new ArrayList<>();
        for (InventoryCsvParser.ProductRow row : parsed.rows()) {
            StockEntity stock = new StockEntity();
            stock.setIdProduct(productById.get(row.productId()));
            stock.setStock(row.stock());
            stock.setIdInventory(inventory);
            stockRows.add(stock);
        }
        stockRepository.saveAll(stockRows);

        return new InventoryUploadResultDTO(inventory.getId(), inventory.getPresentation(),
                parsed.rows().size(), newProducts.size(), stockRows.size());
    }

    private UserEntity resolveActingUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            return null;
        }
        return userRepository.findByUsuario(authentication.getName()).orElse(null);
    }
}
