import pandas as pd
from db_connect import DbConnect
dataset = pd.read_csv("D:\Documentos\Proyectos\Control De Inventarios Comex\CargaDeArchivos\modules\data.csv",sep=',')
# print(dataset.shape[0])
# print(dataset.head(10))
# print(dataset.columns)

lista = []

for index, row in dataset.iterrows():
    row_tuple = tuple(row)
    lista.append(row_tuple)
    # row_dict = row.to_dict()
    # row_serie = pd.Series(row)
    # print(row_dict)
    # print(row_serie)
    # print(row_tuple)
# print(lista)

presentation = dataset['UNIDAD'].drop_duplicates().tolist()
print(presentation[0])


# Conexion a la base de datos
connection = DbConnect()
connection.connect()
connection.load_data(lista, presentation[0])
connection.close()

