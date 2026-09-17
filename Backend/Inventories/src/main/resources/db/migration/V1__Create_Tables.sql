 CREATE TABLE inventories (
  id bigint NOT NULL AUTO_INCREMENT,
  inventory_date date NOT NULL,
  presentation varchar(10) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE products (
  description varchar(50) NOT NULL,
  id varchar(10) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE stock (
  id bigint NOT NULL AUTO_INCREMENT,
  id_product varchar(10) DEFAULT NULL,
  stock decimal(6,3) NOT NULL,
  id_inventory bigint NOT NULL,
  PRIMARY KEY (id),
  KEY fk_id_product (id_product),
  KEY fk_id_inventory (id_inventory),
  CONSTRAINT fk_id_inventory FOREIGN KEY (id_inventory) REFERENCES inventories (id) ON DELETE CASCADE,
  CONSTRAINT fk_id_product FOREIGN KEY (id_product) REFERENCES products (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE product_counts (
  id bigint NOT NULL AUTO_INCREMENT,
  id_inventory bigint NOT NULL,
  id_product varchar(10) NOT NULL,
  quantity decimal(6,3) NOT NULL,
  PRIMARY KEY (id),
  KEY fk_id_inventory_pc (id_inventory),
  KEY fk_id_product_pc (id_product),
  CONSTRAINT fk_id_inventory_pc FOREIGN KEY (id_inventory) REFERENCES inventories (id) ON DELETE CASCADE,
  CONSTRAINT fk_id_product_pc FOREIGN KEY (id_product) REFERENCES products (id)
) ENGINE=InnoDB;