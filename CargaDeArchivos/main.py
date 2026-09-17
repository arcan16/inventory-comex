from tkinter import *
from tkinter import filedialog
from tkinter import messagebox
from PIL import Image, ImageTk
import os
from modules.converter import Converter

class Cargador():
    def __init__(self) -> None:
        self.root=Interfaz()
        self.root.GUI()
        self.root.setup()

class Interfaz():
    def __init__(self) -> None:
        self.root=Tk()
        self.root.bind('<Escape>', lambda e: self.close_window(e))
        self.photo=None

# Cierra la ventana
    def close_window(self, e):
        self.root.destroy()
    

    def select_file(self):
        self.my_file = filedialog.askopenfilename()
        if self.my_file:
            print("Archivo seleccionado: ", self.my_file)
            self.file_name = os.path.basename(self.my_file)
            self.archive_label.config(text=self.file_name)
            self.btn_start.config(state="normal")

    # Configura los elementos graficos de la aplicacion
    def GUI(self):
        self.root.config(bg="white")
        self.root.title("Cargador de inventario")

        main_frame = Frame(self.root, width=400, height=300, bg="white")
        main_frame.pack(expand=True)

        image = Image.open("images/comex.jpg")

        resized = image.resize((200,100))

        self.photo = ImageTk.PhotoImage(resized)

        label = Label(main_frame, image=self.photo)
        label.grid(row=1, column=2)

        btn_select_file = Button(main_frame, text="Seleccionar archivo", command = lambda: self.select_file())
        btn_select_file.grid(row=2, column=1, columnspan=2)
        
        self.archive_label = Label(main_frame, text="Ningun archivo seleccionado", pady=10, padx=10, bg="white")
        self.archive_label.grid(row=3, column=2, pady=40)
        
        self.btn_start = Button(main_frame, text="Procesar inventario", command=lambda: self.convert_file())
        self.btn_start.config(state="disabled")
        self.btn_start.grid(row=4,column=1, columnspan=2)

        self.center_window(400,300)
    
    def convert_file(self):
        my_converter = Converter(self.my_file)
        res = messagebox.askquestion("Load","Deseas cargar mas datos?")
        if(res!="yes"):
            self.root.destroy()
           
        
    
    # Centra la ventana en la pantalla
    def center_window(self, width, height):
        x=self.root.winfo_screenwidth()
        y=self.root.winfo_screenheight()
        coordenadax=int((x/2)-(width/2))
        coordenaday=int((y/2)-(height/2))

        self.root.geometry("{}x{}+{}+{}".format(width, height, coordenadax, coordenaday))

    # Ejecuta el loop principal
    def setup(self):
        self.root.mainloop()

# Ejecuta el cargador
if __name__ == "__main__":
    app = Cargador()