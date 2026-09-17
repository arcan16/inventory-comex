import { useParams } from "react-router-dom";
import { parseaFecha } from "../../helpers/helpDateFormat";
import { useEffect, useState } from "react";
import { helpHttp } from "../../helpers/helpHttp";
import { helpHost } from "../../helpers/helpHost";
import Loader from "../../components/Loader";
import ErrorFetch from "../../components/ErrorFetch";

import del from "../../assets/icons/delete.png";
import FinishCount from "../../components/FinishCount";

function GuidedInventory() {
  const { inventory } = useParams();
  const inventoryObj = JSON.parse(inventory);

  const [inventoryList, setInventoryList] = useState([]);
  const [prevElement, setPrevElement] = useState({});
  const [actualElement, setActualElement] = useState("");
  const [nextElement, setNextElement] = useState(null);
  const [productCounts, setProductCounts] = useState([]);
  const [productCountsInitial, setproductCountsInitial] = useState([]);

  const [prevIndex, setPrevIndex] = useState(null);
  const [indexActual, setIndexActual] = useState(0);
  const [nextIndex, setnextIndex] = useState(1)

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const api = helpHttp();
  const host = helpHost().getIp();

  // Obtiene el stock del inventario atual
  function getStockInventory() {
    let url = `http://${host}:8080/stock/${inventoryObj.id}`;
    api
      .get2(url)
      .then((res) => {
        console.log(res);
        setInventoryList(res);
        setActualElement({
          id: res[0].id,
          idProduct: res[0].idProduct,
          description: res[0].description,
        });
        setNextElement(res[1]);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        setIsError(true);
        console.log("error " + err);
      });
  }

  // Obtiene la lista de conteos realizados en el inventario actual
  function getProductCounts() {
    let url = `http://${host}:8080/productCounts/${inventoryObj.id}`;
    api
      .get2(url)
      .then((res) => {
        setProductCounts(res);
        setproductCountsInitial(res);
        // console.log(res);
      })
      .catch((err) => {
        console.log("Error " + err);
      });
  }

  // Solicita todos los productos para despues validar que el codigo ingresado al conteo sea valido
  // Esto para evitar consultar a la base de datos cada que se quiera agregar un codigo nuevo
  useEffect(() => {
    getStockInventory();
    getProductCounts();
  }, []);

  // Actualiza las variables para mostrar el siguiente elemento
  function handleNextElement(e) {
    e.preventDefault();
    if (indexActual >= inventoryList.length-1) {
      return alert("No hay mas elementos en la lista");
    }

    setPrevElement(actualElement);
    setActualElement({
      id: nextElement.id,
      idProduct: nextElement.idProduct,
      description: nextElement.description,
    });
    setPrevIndex(indexActual);
    setNextElement(inventoryList[nextIndex+1]);
    setnextIndex(nextIndex+1);
    setIndexActual(indexActual+1);

    saveNewProductcount();
  }

  // Coloca el cursor en el input "quantity"
  function focusQuantityInput() {
    const $inputQuantity = document.getElementById("quantity");
    $inputQuantity.value = "";
    $inputQuantity.focus();
  }

  // Actualiza las variables para mostrar el elemento anterior
  function handlePrevElement(e) {
    e.preventDefault();

    if(prevIndex==null || prevIndex<0){
      return alert("No hay mas elementos en la lista");
    }

    setPrevElement(inventoryList[prevIndex-1])
    setNextElement(actualElement)
    setActualElement(prevElement)

    setnextIndex(nextIndex-1)
    setIndexActual(indexActual-1)
    setPrevIndex(prevIndex-1)

    saveNewProductcount();
  }

  // Filtra la lista productCounts para mostrar unicamente los que coincidan con el id actual
  useEffect(() => {
    // alert("Cambiando")

    filterData();
  }, [actualElement.idProduct]);


  // Guarda un nuevo registro cuando se encuentre un valor dentro del input quantity
  function saveNewProductcount() {
    const $inputQuantity = document.getElementById("quantity");
    if ($inputQuantity.value != "") {
      alert("Agregando conteo");

      let url = `http://${host}:8080/productCounts`;
      let options = {
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          idInventory: inventoryObj.id,
          idProduct: actualElement.idProduct,
          quantity: $inputQuantity.value,
        },
      };

      api
        .post2(url, options)
        .then((res) => {
          // console.log(res);
          setProductCounts([res,...productCounts])
          setproductCountsInitial([res,...productCountsInitial])
          filterData();
        })
        .catch((err) => {
          console.log("Error " + err);
        });
    }
    focusQuantityInput();
  }

  // Filtra los elementos del estado prductcountsInitial con el valor del id del input id 
  // para renderizarlos en pantalla
  function filterData(){
    let regExp = new RegExp(actualElement.idProduct, "i");

    setProductCounts(
      productCountsInitial.filter((el) => regExp.test(el.idProduct))
    );
  }

  return (
    <>
      <section className="main-container">
        <div className="main-container-title">
          {inventoryList.length} Elementos - Stock Fisico:{" "}
          {inventoryObj.presentation}
          <br />
          Fecha: {parseaFecha(inventoryObj.date)}
        </div>
        <div className="next-prev-element">
          <h4>{prevElement && prevElement.idProduct}</h4>
          <h4>{prevElement && prevElement.description}</h4>
        </div>
        <form className="add-count-form form">
          <label htmlFor="id">Id</label>
          <input
            type="text"
            id="id"
            name="id"
            className="data-input"
            value={actualElement && actualElement.idProduct}
            disabled
            
          />
          <label htmlFor="description">Descripcion</label>
          <input
            type="text"
            id="description"
            name="description"
            className="data-input"
            value={actualElement && actualElement.description}
            disabled
            
          />

          <label htmlFor="quantity" id="label-quantity">
            Cantidad
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            className="data-input"
            autoFocus
          />
          <h3 className="details" style={{ margin: "0" }}></h3>
          <div className="btn-submit-container">
            <input
              type="button"
              className="btn-submit btn btn-blue"
              value="Anterior"
              onClick={handlePrevElement}
            />
            <input
              type="submit"
              className="btn-submit btn btn-green"
              value="Siguiente"
              onClick={handleNextElement}
            />
          </div>
        </form>
        <div className="next-prev-element">
          <h4>{nextElement && nextElement.idProduct}</h4>
          <h4>{nextElement && nextElement.description}</h4>
        </div>
        <div className="content-container">
          <div className="titles-container">
            <h2>Id</h2>
            <h2>Cantidad</h2>
            <h2>Action</h2>
          </div>

          <div className="elements-container">
            {productCounts &&
              productCounts.map((el) => {
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
                      //   onClick={() => handleClickDelete(el)}
                    />
                  </div>
                );
              })}
            {productCounts.length > 0 && (
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

export default GuidedInventory;
