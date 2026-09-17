import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { helpHttp } from "../../helpers/helpHttp";
import { helpHost } from "../../helpers/helpHost";
import PdfSummary from "../PdfSummary";
import { parseaFecha } from "../../helpers/helpDateFormat";
import dots from "../../assets/icons/dots.png";
import ReportContext from "../../context/ReportContext";

function TypeStock() {
  const { type } = useParams();
  const navigate = useNavigate();
  const [inventories, setInventories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const api = helpHttp();
  const host = helpHost().getIp();

  function getInventoryType() {
    let url = `http://${host}:8080/inventories/allByType/${type}`;
    api
      .get2(url)
      .then((res) => {
        setInventories(res);
        setIsLoading(false);
        console.log(res);
      })
      .catch((err) => {
        setIsLoading(false);
        setIsError(true);
        console.log("error " + err);
      });
  }

  useEffect(() => {
    getInventoryType();
  }, []);

  const navigator = useNavigate();

  const { handleReport } = useContext(ReportContext);

  function summaryCount(inventory) {
    const api = helpHttp();
    const host = helpHost().getIp();
    // alert("click" + inventory)
    let url = `http://${host}:8080/stock/${inventory}`;
    api
      .get2(url)
      .then((res) => {
        handleReport(res);
        console.log(res);
        navigator(`/summaryStock/${type}`);
      })
      .catch((err) => console.log("Error " + err));
  }

  return (
    <>
      {/* <h1 >Type Stock</h1> */}
      <section className="main-container">
        <div className="main-container-title" onClick={() => navigate(-1)}>
          Stock {type}
        </div>
        <div className="content-container">
          <div className="titles-container grid-three-columns">
            <h2>Id</h2>
            <h2>Stock</h2>
            <h2>Conteo</h2>
          </div>

          <div className="elements-container">
            {inventories &&
              inventories.map((el) => {
                return (
                  <div
                    className="data-element grid-three-columns"
                    key={el.id}
                    style={{ backgroundColor: "white", color: "black" }}
                    onClick={()=>summaryCount(el.id)}
                  >
                    <h3>{el.id}</h3>
                    <h3>{parseaFecha(el.inventoryDate)}</h3>
                    <h3>{el.presentation}</h3>
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

export default TypeStock;
