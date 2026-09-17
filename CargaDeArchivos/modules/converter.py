import pandas as pd
import os
from .db_connect import DbConnect

class Converter():

    def __init__(self,file):
        self.extension_required=".csv"
        self.file_validation(file)
        print(self.file)

    def file_validation(self,file):
        _, file_extension = os.path.splitext(file)
        if(self.extension_required==file_extension):
            self.file=file
            self.convert_file()

    def convert_file(self):
        # Leemos el arachivo
        dataset= pd.read_csv(self.file,sep=',')

        #Buscamos el nuevo encabezado
        nuevo_encabezado=dataset.iloc[3]

        #Asignamos el nuevo encabezado a las columnas
        dataset.columns=nuevo_encabezado

        #Eliminamos filas innecesarias
        dataset=dataset.iloc[4:]
        dataset=dataset.drop('NO SHOW', axis=1)
        dataset=dataset.iloc[:,:6]

        #Buscamos las columnas con valores no nulos
        columnas=dataset.columns[dataset.columns.notnull()]

        #Actualizamos el DataFrame solo con las columnas que contengan informacion valida
        dataset=dataset[columnas]

        #Eliminamos las ultimas filas (ya que no contienen información valida)
        dataset=dataset.iloc[:-2]
        #Observamos que el tratamiento haya funcionado
        print(dataset.info())
        #Exportamos el archivo con un nuevo nombre
        # dataset.to_csv('galones_tratado2.csv', sep=',',index=False)

        # Crearemos la lista de elementos que vamos a almacenar
        lista = []

        for index, row in dataset.iterrows():
            row_tuple = tuple(row)
            lista.append(row_tuple)

        # Obtenemos la presentacion
        presentation = dataset['UNIDAD'].drop_duplicates().tolist()
        print(presentation[0])


        # Conexion a la base de datos
        connection = DbConnect()
        connection.connect()
        connection.load_data(lista, presentation[0])
        connection.close()
