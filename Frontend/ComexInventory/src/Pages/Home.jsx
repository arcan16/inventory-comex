import checklist from "../assets/icons/checklist.png";
import documents from "../assets/icons/documents.png";
import products from "../assets/icons/products.png";
import stock from "../assets/icons/stock.png";
import { useNavigate } from "react-router-dom";
function Home() {
    const navigate = useNavigate();

    function goDestiny(destiny){
         navigate(destiny)
    }
    
  return (
    <>
      <section className="main-container principal">
        <div className="main-container-title">Home</div>
        <div className="cards-container">
          <div className="card-big" onClick={()=>goDestiny("/inventory")}>
            <img src={checklist} alt="" className="icon-small" />
            <h2>Inventarios</h2>
          </div>
          <div className="card-big" onClick={()=>goDestiny("/reports")}>
            <img src={documents} alt="" className="icon-small" />
            <h2>Reportes</h2>
          </div>
          <div className="card-big" onClick={()=>goDestiny("/products")}>
            <img src={products} alt="" className="icon-small" />
            <h2>Productos</h2>
          </div>
          <div className="card-big" onClick={()=>goDestiny("/stock")}>
            <img src={stock} alt="" className="icon-small" />
            <h2>Stock</h2>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
