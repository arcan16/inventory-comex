import { useContext } from "react";
import { helpHost } from "../helpers/helpHost";
import { helpHttp } from "../helpers/helpHttp";
import ReportContext from "../context/ReportContext";
import { useNavigate } from "react-router-dom";

function FinishCount({inventory}) {

    const {report, handleReport} = useContext(ReportContext);
    const navigator = useNavigate();


    function handleFinishCount(){
        const api = helpHttp();
        const host = helpHost().getIp();
        // alert("click" + inventory)
        let url = `http://${host}:8080/productCounts/summary/${inventory}`;
        console.log(url)
        api.get2(url).then(res=>{
            handleReport(res);
            console.log(res);
            navigator("/summaryCount")
        }).catch(err=>console.log("Error " + err))
    
      }
    return ( 
        <>
            <button className="finish-btn pdf-btn" onClick={handleFinishCount}>Resumen</button>
        </>
     );
}

export default FinishCount;