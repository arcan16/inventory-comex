USE comex_inventory;
SELECT * FROM product_counts;
SELECT * FROM stock;
SELECT * FROM inventories;

/* consulta inicial  */
SELECT s.id_product, s.stock, sum(pc.quantity), (sum(pc.quantity) - s.stock ) as dif FROM product_counts pc 
INNER JOIN stock s on pc.id_product = s.id_product
group by s.id_product, s.stock;

/* Consulta funcional */
select s.id, s.id_inventory, p.description ,s.id_product, s.stock, 
coalesce(sum(pc.quantity),0) as sum, (coalesce(sum(pc.quantity),0)-s.stock) as difference
from stock s
left join product_counts pc on pc.id_product = s.id_product
inner join products p on p.id = s.id_product
group by s.id, s.id_inventory, s.id_product, s.stock
having s.id_inventory = 1
order by s.id;
/* Consulta funcional */

/* Consulta de los reportes que pueden ser consultados */
/* NOTA. distinct no funciona en consultas jpql de spring boot con java */
select distinct(pc.id_inventory) as inventory, i.inventory_date, i.presentation from product_counts pc inner join inventories i on pc.id_inventory=i.id;

select pc.id_inventory as inventory, i.inventory_date, i.presentation 
from product_counts pc 
inner join inventories i on pc.id_inventory=i.id
group by pc.id_inventory, i.inventory_date, i.presentation;



