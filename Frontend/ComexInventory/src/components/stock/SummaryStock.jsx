import { useContext, useEffect, useState } from "react";
import ReportContext from "../../context/ReportContext";
import { useNavigate, useParams } from "react-router-dom";

function SummaryStock() {
  const { type } = useParams();
  const { report } = useContext(ReportContext);
  const [inventoryCount, setInventoryCount] = useState([]);
  const navigator = useNavigate();

  useEffect(() => {
    if (report.length == 0) navigator(`/inventory`);
    setInventoryCount(report);
  }, []);


  function handleFilterData(e){
    const $inputData = document.querySelector(".input-filter");

    if($inputData.value=="") return setInventoryCount(report);
    
    let regExp =new RegExp($inputData.value, 'i');
    setInventoryCount(inventoryCount.filter(el=>{
      if(regExp.test(el.description)){
        return el;
      }
    }))
    
  }

  return (
    <>
      <section className="main-container">
        <div className="main-container-title">
          <div>
            <h3 style={{margin:"0"}} onClick={() => navigator(-1)}>{type} Resumen</h3>
            <input type="text" className="input-filter" onChange={handleFilterData} autoFocus placeholder="Filtro de contenido"/>
          </div>
        </div>
        <div className="content-container grid-four-columns">
          <div className="titles-container">
            <h2>Id</h2>
            <h2>Description</h2>
            <h2>Stock</h2>
          </div>

          <div className="elements-container ">
            {inventoryCount &&
              inventoryCount.map((el) => {
                return (
                  <div
                    className="data-element grid-three-columns"
                    key={el.id}
                    style={{ backgroundColor: "white", color: "black" }}
                  >
                    <h3>{el.idProduct}</h3>
                    <h3>{el.description}</h3>
                    <h3>{el.stock}</h3>
                  </div>
                );
              })}
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

export default SummaryStock;
