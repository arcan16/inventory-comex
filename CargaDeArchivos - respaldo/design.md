# Control de inventarios Data Base

## Tables

### Inventories
- id bigint not null auto_increment primary key
- inventory_date date default now
- presentation varchar(10) not null

### Products
- id bigint not null auto_increment primary key
- description varchar(50) not null unique

### Stock
- id_inventory bigint not null auto_increment
- id_product int not null
- stock decimal(6,3) not null

### Product_count
- id bigint not null auto_increment
- id_inventory bigint not null
- id_product varchar(10) not null
- quantity decimal(6,3) not null