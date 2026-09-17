import { useContext, useState } from "react";
import { helpHost } from "../helpers/helpHost";
import { helpHttp } from "../helpers/helpHttp";
import ReportContext from "../context/ReportContext";
// import { useNavigate } from "react-router-dom";

function PdfSummary() {
  const { report, handleReport } = useContext(ReportContext);
  const [filename, setFilename] = useState("");
  // const navigator = useNavigate();

  function getSummaryReport() {
    const host = helpHost().getIp();

    // fetch(`http://${host}:8080/productCounts/report/${report[0].idInventory}`)
    //   .then((response) => {
    //     const filename = response.headers.get("filename");
    //     setFilename(filename);
    //     return response.blob();
    //   })
    //   .then((blob) => {
    //     const url = window.URL.createObjectURL(blob);
    //     const a = document.createElement("a");
    //     a.href = url;
    //     a.download = filename;
    //     a.target='_blank';
    //     a.click();
    //   });
    fetch(`http://${host}:8080/productCounts/report/${report[0].idInventory}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/pdf',
      },
      responseType: 'arraybuffer',
    })
     .then(response => {
        if (response.ok) {
          return response.arrayBuffer();
        } else {
          throw new Error('Error en la solicitud HTTP');
        }
      })
     .then(arrayBuffer => {
        const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
      })
     .catch(error => {
        console.error(error);
      });
  }
  return (
    <>
      <button className="finish-btn pdf-btn" onClick={getSummaryReport}>
        PDF
      </button>
    </>
  );
}

export default PdfSummary;
