package com.inventories.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;

@Entity(name = "InventoriesEntity")
@Table(name = "inventories")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class InventoriesEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Date inventoryDate = new Date(System.currentTimeMillis());
    private String presentation;
}
