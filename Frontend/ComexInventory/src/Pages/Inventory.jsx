import { useEffect, useState } from "react";
import { helpHost } from "../helpers/helpHost";
import { helpHttp } from "../helpers/helpHttp";
import Loader from "../components/Loader";
import ErrorFetch from "../components/ErrorFetch";
import { parseaFecha } from "../helpers/helpDateFormat";
import { useNavigate } from "react-router-dom";

import dotsvert from "../assets/icons/dotsvert.png"

function Inventory() {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [inventories, setInventories] = useState([]);
  const [selectedDots, setSelectedDots] = useState(null);

  const api = helpHttp();
  const host = helpHost().getIp();

  async function getInventories() {
    let url = `http://${host}:8080/inventories`;
    api
      .get2(url)
      .then((res) => {
        setInventories(res.content);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        setIsError(true);
        console.log("error " + err);
      });
  }

  useEffect(() => {
    getInventories();
  }, []);

  
  const myNavigator = useNavigate();

  function handleInventorySelect(el){
    myNavigator(`/inventory/${encodeURIComponent(JSON.stringify(el))}`)
  }

  function handleInventoryGuidedSelect(e,el){
    e.stopPropagation()
    myNavigator(`/inventoryGuided/${encodeURIComponent(JSON.stringify(el))}`)
  }

  function handleClickDots(e,id){
    e.stopPropagation();
    // alert("El id seleccionado es "+id)
    if(id==selectedDots)return setSelectedDots(null)
    setSelectedDots(id)
  }

  function handleDelete(e, el){
    e.preventDefault();
    e.stopPropagation();
    let confirm = window.confirm("Estas seguro de eleminar este inventario?")
    if(confirm){
      let url = `http://${host}:8080/inventories/${el.id}`;
      // let url = `http://${host}:8080/inventories/8`;

      api.del2(url).then(res=>{
        // console.log(res)
        getInventories();
      }).catch(err=>{
        console.log("Error: "+ err)
      }); 

    }
    setSelectedDots(null);
  }

  function handleBack(e){
    e.preventDefault();
    e.stopPropagation();
    setSelectedDots(null);
  }
  
  return (
    <>
      <section className="main-container">
        <div className="main-container-title">Inventarios</div>
        <div className="content-container">
          <div className="titles-container">
            <h2>Presentacion</h2>
            <h2>Fecha</h2>
          </div>
          <div className="elements-container">
            {inventories && inventories.map((el)=>{
                return (
                <div className="data-element" key={el.id} onClick={()=> handleInventorySelect(el)}>
                    <h3>{el.presentation}</h3>
                    <h3 className="element">
                      <p style={{display:"inline-block"}}>{parseaFecha(el.date)}</p>
                      <img src={dotsvert} alt="" className="icon-small dots" id="lateral-dots" onClick={(e)=>handleClickDots(e,el.id)}/>
                      <div className={`dots-options ${selectedDots==el.id?"":"dot-opt-hidden"}`} onClick={(e)=>handleInventoryGuidedSelect(e,el)}>
                        <h3>Inventario Guiado</h3>
                        <h3 className="delete-btn" onClick={(e)=>handleDelete(e, el)}>Eliminar</h3>
                      </div>
                        <div className={`dots-back ${selectedDots==el.id?"":"dot-opt-hidden"}`} onClick={handleBack}></div>
                    </h3>
                </div>
                )
            }
            )}
            <div className="data-element">
              <h3></h3>
              <h3></h3>
              <h3></h3>
            </div>
            {isLoading && <Loader />}
            {isError && <ErrorFetch />}
          </div>
        </div>
      </section>
    </>
  );
}

export default Inventory;
