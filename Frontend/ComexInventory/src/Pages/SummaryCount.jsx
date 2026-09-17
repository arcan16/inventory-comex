import { useContext, useEffect, useState } from "react";
import ReportContext from "../context/ReportContext";
import { useNavigate } from "react-router-dom";
import PdfSummary from "../components/PdfSummary";

function SummaryCount() {
  const { report } = useContext(ReportContext);
  const [inventoryCount, setInventoryCount] = useState([]);
  const navigator = useNavigate();

  useEffect(() => {
    if (report.length == 0) navigator(`/inventory`);
    setInventoryCount(report);
  }, []);

  function handleReturn(){
    navigator(-1);
  }
  return (
    <>
      <section className="main-container">
        <div className="main-container-title" onClick={handleReturn}>Resumen</div>
        <div className="content-container grid-four-columns">
          <div className="titles-container grid-four-columns">
            <h2>Id</h2>
            <h2>Stock</h2>
            <h2>Conteo</h2>
            <h2>Diferencia</h2>
          </div>

          <div className="elements-container">
            {inventoryCount &&
              inventoryCount.map((el) => {
                return (
                  <div
                    className="data-element grid-four-columns"
                    key={el.id}
                    style={{ backgroundColor: "white", color: "black" }}
                  >
                    <h3>{el.idProduct}</h3>
                    <h3>{el.stock}</h3>
                    <h3>{el.sum}</h3>
                    <h3>{el.difference}</h3>
                  </div>
                );
              })}
            <PdfSummary />
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

export default SummaryCount;
