import { useContext, useEffect, useState } from "react";
import { helpHost } from "../helpers/helpHost";
import { helpHttp } from "../helpers/helpHttp";
import { parseaFecha } from "../helpers/helpDateFormat";
import { useNavigate } from "react-router-dom";
import ReportContext from "../context/ReportContext";
import Loader from "../components/Loader";
import ErrorFetch from "../components/ErrorFetch";

function Reports() {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const api = helpHttp();
  const host = helpHost().getIp();
  let url = `http://${host}:8080/productCounts/allReports`;

  function getReports() {
    api
      .get2(url)
      .then((res) => {
        console.log(res);
        setIsLoading(false);
        setReports(res);
      })
      .catch((err) => {
        setIsLoading(false);
        setIsError(true);
        console.log("error " + err);
      });
  }

  useEffect(() => {
    getReports();
  }, []);

  const { handleReport } = useContext(ReportContext);
  const navigator = useNavigate();

  function handleSummaryCount(id) {
    const api = helpHttp();
    const host = helpHost().getIp();
    let url = `http://${host}:8080/productCounts/summary/${id}`;
    api
      .get2(url)
      .then((res) => {
        handleReport(res);

        navigator("/summaryCount");
      })
      .catch((err) => {
        console.log("Error " + err);
      });
  }

  return (
    <>
      <section className="main-container">
        <div className="main-container-title">Reportes</div>
        <div className="content-container">
          <div className="titles-container grid-two-columns">
            <h2>Fecha</h2>
            <h2>Presentacion</h2>
          </div>
          <div className="elements-container">
            {reports &&
              reports.map((el) => {
                return (
                  <div
                    className="data-element"
                    key={el.idInventory}
                    onClick={() => handleSummaryCount(el.idInventory)}
                  >
                    <h3>{parseaFecha(el.inventoryDate)}</h3>
                    <h3>{el.presentation}</h3>
                  </div>
                );
              })}
            {isLoading && <Loader />}
            {isError && <ErrorFetch />}
          </div>
        </div>
      </section>
    </>
  );
}

export default Reports;
