import { useParams } from "react-router-dom";
import { parseaFecha } from "../helpers/helpDateFormat";
import { useEffect, useState } from "react";
import { helpHttp } from "../helpers/helpHttp";
import { helpHost } from "../helpers/helpHost";
import Loader from "../components/Loader";
import ErrorFetch from "../components/ErrorFetch";

import del from "../assets/icons/delete.png";
import FinishCount from "../components/FinishCount";

function ProductCounts() {
  const { inventory } = useParams();
  const inventoryObj = JSON.parse(inventory);
  const [inputText, setInputText] = useState({});

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [products, setProducts] = useState([]);

  const [isValidProduct, setIsValidProduct] = useState(true);

  const [inventoryCount, setInventoryCount] = useState([]);

  const api = helpHttp();
  const host = helpHost().getIp();
  let url = `http://${host}:8080/productCounts/${inventoryObj.id}`;

  // Logica de la peticion de informaicon al servidor
  async function getProducts() {
    let url = `http://${host}:8080/products/all`;
    api
      .get2(url)
      .then((res) => {
        setProducts(res);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        setIsError(true);
        console.log("error " + err);
      });
  }

  function getCountInventory() {
    // console.log(url);
    api
      .get2(url)
      .then((res) => {
        console.log(res);
        setInventoryCount(res.reverse());
      })
      .catch((err) => {
        console.log("Error " + err);
      });
  }

  // Solicita todos los productos para despues validar que el codigo ingresado al conteo sea valido
  // Esto para evitar consultar a la base de datos cada que se quiera agregar un codigo nuevo
  useEffect(() => {
    getProducts();
    getCountInventory();
  }, []);

  // Actualiza el estado que controla el valor de los inputs
  function handleInputChange(e) {
    setInputText({ ...inputText, [e.target.name]: e.target.value });
  }

  // Busca el codigo ingresado y valida que sea el correcto
  function handleIdValidation() {
    const $inputId = document.getElementById("id-product");
    const $details = document.querySelector(".details");

    if ($inputId.value == "") return $inputId.focus();

    let data = products.find(
      (product) => product.id == inputText["id-product"]
    );
    if (data != undefined) {
      $details.textContent = data.description;
      setIsValidProduct(true);
    } else {
      setIsValidProduct(false);
      $details.textContent = "El codigo no existe, deseas crearlo?";
      setInputText({ ...inputText, quantity: "" });
      return document.getElementById("quantity").focus();
    }
  }

  // Logica de los botones Agregar Crear Cancelar
  function handleBtnClick(e) {
    const $inputId = document.getElementById("id-product");
    const $details = document.querySelector(".details");
    if (e.target.value == "Cancelar") {
      $inputId.value = "";
      $details.textContent = "";
      document.querySelector(".btn-submit").value = "Agregar";
      setInputText({ ["id-product"]: "", quantity: "" });
      setIsValidProduct(true);
      $inputId.focus();
    }
  }

  // Logica para el cambio de tipo de codigo o id que sera ingresado
  function handleTypeCodeSelect(e) {
    const $btnNumber = document.getElementById("type-number");
    const $btnText = document.getElementById("type-text");
    const $inputId = document.getElementById("id-product");
    setInputText({ ["id-product"]: "", quantity: "" });
    document.querySelector(".details").textContent = "";
    setIsValidProduct(true);

    if (e.target.value == "Numero") {
      $btnNumber.classList.add("btn-selected");
      $btnText.classList.remove("btn-selected");
      $inputId.type = "number";
      document.querySelector(".btn-submit").value = "Agregar";
    } else {
      $btnNumber.classList.remove("btn-selected");
      $btnText.classList.add("btn-selected");
      $inputId.type = "text";
    }
    $inputId.focus();
  }

  // Logica del envio de informcion al servidor
  function handleSubmit(e) {
    e.preventDefault();
    const $btnSubtmit = document.getElementById("btn-submit");
    handleIdValidation();

    const $inputId = document.getElementById("id-product");
    const $inputQuantity = document.getElementById("quantity");

    if (document.getElementById("quantity").value == "") return;

    if ($btnSubtmit.value == "Agregar") {
      // alert("Vamos a agregar un elemento");

      let url = `http://${host}:8080/productCounts`;
      let options = {
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          idInventory: inventoryObj.id,
          idProduct: $inputId.value,
          quantity: $inputQuantity.value,
        },
      };
      // console.log(products);

      api
        .post2(url, options)
        .then((res) => {
          console.log(res);
          setInventoryCount([res, ...inventoryCount]);
        })
        .catch((err) => {
          console.log("Error " + err);
        });

      console.log(options);
      resetInputs();
    } else {
      alert("Vamos a crear un nuevo producto");
      document.querySelector(".details").textContent = "";
      setIsValidProduct(true);
    }
    console.log($btnSubtmit.value);
  }

  // Reinicia los inputs a su estado inicial (vacio)
  function resetInputs() {
    setInputText({ ["id-product"]: "", quantity: "" });
    document.getElementById("id-product").focus();
    document.querySelector(".details").textContent = "";
  }

  // Logica de eliminacion del producto de la lista inventoryCount
  function handleClickDelete(product) {
    let url = `http://${host}:8080/productCounts/${product.id}`;

    api
      .del2(url)
      .then((res) => {
        // Eliminacion del registro de la lista renderizada
        console.log(res);
        let newData = inventoryCount.filter((el) => el.id != product.id);
        setInventoryCount(newData);
        console.log(newData);
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
        <form className="add-count-form form" onSubmit={handleSubmit}>
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
        </form>
        <div className="content-container">
          <div className="titles-container">
            <h2>Id</h2>
            <h2>Cantidad</h2>
            <h2>Action</h2>
          </div>

          <div className="elements-container">
            {inventoryCount &&
              inventoryCount.map((el) => {
                return (
                  <div
                    className="data-element grid-three-columns"
                    key={el.id}
                    style={{ backgroundColor: "white", color: "black" }}
                  >
                    <h3>{el.idProduct}</h3>
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
            {inventoryCount.length > 0 && (
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

export default ProductCounts;
