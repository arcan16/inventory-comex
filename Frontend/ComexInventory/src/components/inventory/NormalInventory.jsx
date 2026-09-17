import { useParams } from "react-router-dom";
import { parseaFecha } from "../../helpers/helpDateFormat";
import { useEffect, useReducer, useRef, useState } from "react";
import { helpHttp } from "../../helpers/helpHttp";
import { helpHost } from "../../helpers/helpHost";
import Loader from "../../components/Loader";
import ErrorFetch from "../../components/ErrorFetch";

import del from "../../assets/icons/delete.png";
import FinishCount from "../../components/FinishCount";

function NormalInventory() {
  const { inventory } = useParams();
  const inventoryObj = JSON.parse(inventory);

  // initiall elements
  const $inputId = useRef(null);
  const $stockInput = useRef(null);
  const $descriptionContainer = useRef(null);
  const $descriptionInput = useRef(null);
  const $quantityInput = useRef(null);
  const $differenceInput = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [typeSelected, setTypeSelected] = useState("number"); // controla el tipo de codigo del producto numerico - texto
  const [productDetails, setProductDetails] = useState(""); // Controla el contenido del h3.details con la descripcion del producto
  const [inputCodeSearch, setInputCodeSearch] = useState(""); // Controla el estado del producto que se esta buscando actualmente

  const [products, setProducts] = useState([]); // Lista con todos los productos registrados
  const [stock, setStock] = useState([]); // Lista con las existencias del inventario en curso
  const [productsCount, setProductsCount] = useState([]); // Lista con los productos contados registrados hasta el momento

  const [differenceState, setDifferenceState] = useState(0);

  const api = helpHttp();
  const host = helpHost().getIp();

  // Logica de la peticion de informaicon al servidor
  async function getCompleteInventoryData() {
    let url = `http://${host}:8080/inventories/normal/${inventoryObj.id}`;
    api
      .get2(url)
      .then((res) => {
        setProducts(res.products);
        setProductsCount(res.productsCount.reverse());
        setStock(res.stock);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        setIsError(true);
        console.log("error " + err);
      });
  }

  // Solicita todos los productos para despues validar que el codigo ingresado al conteo sea valido
  // Esto para evitar consultar a la base de datos cada que se quiera agregar un codigo nuevo
  useEffect(() => {
    getCompleteInventoryData();
  }, []);

  function handleChangeTypeCode(e) {
    setInputCodeSearch("");
    if (e.target.value == "Numero") {
      setTypeSelected("number");
    } else {
      setTypeSelected("text");
    }
    resetForm();
    $inputId.current.focus();
  }

  // Logica para la actualizacion del estado del inputSearch
  function handleInputCodeSearch(e) {
    setInputCodeSearch(e.target.value);
    if ($inputId.current.value == "") {
      resetForm();
    }
  }

  function resetForm(){
    setProductDetails("");
    setInputCodeSearch("");
    $stockInput.current.value = "";
    $descriptionContainer.current.classList.contains("hidden")?null:$descriptionContainer.current.classList.add("hidden");
    $descriptionInput.current.value = "";
    $quantityInput.current.value = "";
    $differenceInput.current.value=""
    $inputId.current.focus();
    setDifferenceState(0);
  }

  function getDiference(){
    console.log("Buscando codigo")
    let counts = productsCount.filter(el=>el.idProduct.id==$inputId.current.value);
    let total=0;
    if(counts.length==1){
      total = counts[0].quantity
      $differenceInput.current.value=parseFloat(total)-parseFloat($stockInput.current.value);
      setDifferenceState($differenceInput.current.value);
    }else if(counts.length>1){
      total = counts.reduce((suma, el)=> {
        return suma.quantity?suma.quantity + parseFloat(el.quantity):suma + parseFloat(el.quantity)
      });
      console.log(total)
      $differenceInput.current.value=parseFloat(total)-parseFloat($stockInput.current.value);
      setDifferenceState($differenceInput.current.value);
    }else{
      $differenceInput.current.value="0";
      setDifferenceState(0);
    }
  }

  // Logica para la busqueda del producto basada en el valor del input
  function handleSearchInputCode() {
    if ($inputId.current.value == "") return $inputId.current.focus();

    let product = stock.find((el) => el.idProduct == $inputId.current.value);
    if(product==undefined)product=products.find(el=>el.id==$inputId.current.value);

    if (product != undefined) {
      product.stock?$stockInput.current.value = product.stock:$stockInput.current.value = "0";
      setProductDetails(product.description);
      $descriptionContainer.current.classList.add("hidden");
      $descriptionInput.current.value = "";
      $quantityInput.current.value = "";
      getDiference();
    } else if ($inputId.current.value != "") {
      $stockInput.current.value = "";
      setProductDetails("El codigo no se encuentra registrado");
      $descriptionContainer.current.classList.remove("hidden");
      $descriptionInput.current.focus();
      $differenceInput.current.value=0;
      $stockInput.current.value=0;
    }
  }

  // Logica para el registro de productos al conteo fisico
  function handleSubmit(e) {
    e.preventDefault();
    if (productDetails != "") {
      if (!$descriptionContainer.current.classList.contains("hidden")) {
        if ($descriptionInput.current.value == "") {
          alert("La descripcion no puede estar vacia");
          $descriptionInput.current.focus();
          return;
        }
        if ($quantityInput.current.value == "" ||
          parseFloat($quantityInput.current.value) <= 0
        ) {
          alert("La cantidad no puede estar vacia ni ser igual o menor a 0");
          $quantityInput.current.focus();
          return;
        }
        createElement();
      } else {
        if ($quantityInput.current.value == "" ||
          parseFloat($quantityInput.current.value) <= 0
        ) {
          alert("La cantidad no puede estar vacia ni ser igual o menor a 0");
          $quantityInput.current.focus();
          return;
        }
        console.log($quantityInput.current.value)
        addElement();
      }
    }
    resetForm();
  }

  function addElement(){
    // alert("Agregando conteo a la lista");
    let url = `http://${host}:8080/productCounts`;
      let options = {
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          idInventory: inventoryObj.id,
          idProduct: $inputId.current.value,
          quantity: $quantityInput.current.value,
        },
      };

      api
        .post2(url, options)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log("Error " + err);
        });
  }

  function createElement(){
    // alert("Creando registro con datos nuevos");
    console.log(products)
    console.log(productsCount)
    console.log(stock)
    let url = `http://${host}:8080/productCounts/createProductAddCount`;
      let options = {
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          idInventory: inventoryObj.id,
          idProduct: $inputId.current.value,
          description: $descriptionInput.current.value,
          quantity: $quantityInput.current.value,
        },
      };

      api
        .post2(url, options)
        .then((res) => {
          console.log(res);
          setProducts([res.newProduct,...products]);
          setProductsCount([res.countCreated, ...productsCount]);
        })
        .catch((err) => {
          console.log("Error " + err);
        });
  }

  function updateDifference(e){
    if($quantityInput.current.value!=""){
      $differenceInput.current.value = parseFloat($quantityInput.current.value) + parseFloat(differenceState)
    }else{
      getDiference();
    }
  }

   // Logica de eliminacion del producto de la lista inventoryCount
   function handleClickDelete(product) {
    let url = `http://${host}:8080/productCounts/${product.id}`;
    // console.log(product)
    api
      .del2(url)
      .then(() => {
        let newData = productsCount.filter((el) => el.id != product.id);
        setProductsCount(newData);
      })
      .catch((err) => {
        console.log("Error: " + err);
      });
  }

  return (
    <>
      <section className="main-container">
        <div className="main-container-title">
          Stock Fisico: {inventoryObj.presentation}
          <br />
          Fecha: {parseaFecha(inventoryObj.date)}
        </div>
        <form className="add-count-form form-normal" onSubmit={handleSubmit}>
          <div className="id-type-container">
            <input
              type="button"
              value="Numero"
              className={`btn-type-code ${
                typeSelected == "number" && "btn-selected"
              }`}
              onClick={handleChangeTypeCode}
            />
            <input
              type="button"
              value="Texto"
              className={`btn-type-code ${
                typeSelected == "text" && "btn-selected"
              }`}
              onClick={handleChangeTypeCode}
            />
          </div>
          <label htmlFor="idProduct">Stock</label>
          <input
            type={typeSelected == "number" ? "number" : "text"}
            className="data-input"
            id="idProduct"
            name="idProduct"
            placeholder="Codigo del producto"
            autoFocus
            ref={$inputId}
            value={inputCodeSearch}
            onChange={handleInputCodeSearch}
            onBlur={handleSearchInputCode}
          />
          <input
            type="number"
            className="data-input"
            style={{ textAlign: "center" }}
            name="stock"
            id="stock"
            ref={$stockInput}
            placeholder="Stock"
            disabled
            readOnly
          />

          <h3 className="details no-margin">{productDetails}</h3>

          <div
            className="description-container hidden"
            ref={$descriptionContainer}
          >
            <label htmlFor="description">Descripcion</label>
            <input
              id="description"
              type="text"
              name="description"
              className="data-input"
              ref={$descriptionInput}
            />
          </div>

          <label htmlFor="quantity">Cantidad:</label>
          <label htmlFor="difference">Diferencia</label>
          <input
            type="number"
            className="data-input"
            placeholder="Cantidad"
            name="quantity"
            id="quantity"
            onChange={updateDifference}
            ref={$quantityInput}
          />
          <input
            type="number"
            className="data-input"
            placeholder="Diferencia"
            disabled
            id="difference"
            name="difference"
            ref={$differenceInput}
            readOnly
          />

          <div className="btn-submit-container">
            <input
              type="submit"
              id="btn-submit"
              className="btn-submit btn btn-green"
              value="Agregar"
            />
            <input
              type="button"
              className="btn-submit btn btn-red"
              value="Cancelar"
              onClick={resetForm}
            />
          </div>
        </form>
        {/* <form className="add-count-form form" onSubmit={handleSubmit}>
          <div className="radio-type-container">
            <input
              type="button"
              value="Numero"
              id="type-number"
              className="btn-type-code btn-selected"
              onClick={handleTypeCodeSelect}
            />
            <input
              type="button"
              value="Texto"
              id="type-text"
              className="btn-type-code"
              onClick={handleTypeCodeSelect}
            />
          </div>
          <input
            type="number"
            placeholder="Id del producto"
            id="id-product"
            name="id-product"
            className="data-input"
            value={inputText["id-product"] || ""}
            onChange={handleInputChange}
            onBlur={handleIdValidation}
            autoFocus
          />

          <label htmlFor="quantity" id="label-quantity">
            {isValidProduct ? "Cantidad" : "Descripcion"}
          </label>
          <input
            type={isValidProduct ? "number" : "text"}
            id="quantity"
            name="quantity"
            className="data-input"
            value={inputText["quantity"] || ""}
            onChange={handleInputChange}
          />

          <label htmlFor="difference">Stock: </label>
          <input type="number" className="data-input" disabled readOnly />


          <h3 className="details" style={{ margin: "0" }}></h3>
          <div className="btn-submit-container">
            <input
              type="submit"
              id="btn-submit"
              className="btn-submit btn btn-green"
              value={isValidProduct ? "Agregar" : "Crear"}
            />
            <input
              type="button"
              className="btn-submit btn btn-red"
              value="Cancelar"
              onClick={handleBtnClick}
            />
          </div>
        </form> */}
        <div className="content-container">
          <div className="titles-container">
            <h2>Id</h2>
            <h2>Cantidad</h2>
            <h2>Action</h2>
          </div>

          <div className="elements-container">
            {productsCount &&
              productsCount.map((el) => {
                return (
                  <div
                    className="data-element grid-three-columns"
                    key={el.id}
                    style={{ backgroundColor: "white", color: "black" }}
                  >
                    <h3>{el.idProduct.id}</h3>
                    <h3>{el.quantity}</h3>
                    <img
                      src={del}
                      alt=""
                      className="icon-small icon-form"
                      onClick={() => handleClickDelete(el)}
                    />
                  </div>
                );
              })}
            {productsCount.length > 0 && (
              <FinishCount inventory={inventoryObj.id} />
            )}
            {isLoading && <Loader />}
            {isError && <ErrorFetch />}
            <div>
              <h3></h3>
              <h3></h3>
              <h3></h3>
            </div>
            <br />
          </div>
        </div>
      </section>
    </>
  );
}

export default NormalInventory;
