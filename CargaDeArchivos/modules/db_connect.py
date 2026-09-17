import mysql.connector

class DbConnect():
    def __init__(self) -> None:
        self.host = "localhost"
        self.user = "root"
        self.password = "Lenoleoncito"
        self.database = "comex_inventory"

    def connect(self):
        self.connection = mysql.connector.connect(
            host=self.host,
            user=self.user,
            password=self.password,
            database=self.database
        )
        if(self.connection.is_connected()):
            print("Exito")
        else:
            print("Fracaso")
    
    def close(self):
        self.connection.close()

    def load_data(self, data, presentation):
        if(self.connection.is_connected()):

            # Create cursor
            cursor = self.connection.cursor()

            # Create query to inventories
            query = f"INSERT INTO inventories (inventory_date, presentation) values(NOW(),'{presentation}')"

            # Execute query
            cursor.execute(query)
            
            # Commit query
            self.connection.commit()

            id_inventory = cursor.lastrowid

            # Create Query for table products and commit
            query = "insert ignore into products (id, description) values(%s, %s)"

            list_products = []

            for product in data:
                list_products.append((product[0],product[3]))

            print(list_products)

            cursor.executemany(query, list_products)
            
            self.connection.commit()


            # Create Query for table stock and commit
            query = "insert ignore into stock (id_product, stock, id_inventory) values(%s, %s, %s)"

            list_stock = []

            for product in data:
                list_stock.append((product[0],product[2], id_inventory))

            print(list_stock)

            cursor.executemany(query, list_stock)
            
            self.connection.commit()

            
            cursor.close()
