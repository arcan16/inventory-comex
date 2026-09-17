import { useNavigate } from "react-router-dom";
import cubeta from "../assets/icons/cubeta.png";
import galon from "../assets/icons/galon.png";
import liter from "../assets/icons/liter.png";
import piece from "../assets/icons/piezas.png";
function Stock() {
  const navigate = useNavigate();
  function destiny(filter){
    navigate(`/typeStock/${filter}`)
  }

  return (
    <>
      <section className="main-container principal">
        <div className="main-container-title">Stock</div>
        <div className="content-container">
          <div className="cards-container">
          <div className="card-big" onClick={()=>destiny("19 LTS")}>
            <img src={cubeta} alt="" className="icon-small"/>
            <h2>Cubetas</h2>
          </div>
          <div className="card-big"  onClick={()=>destiny("4 LTS")} >
            <img src={galon} alt="" className="icon-small"/>
            <h2>Galones</h2>
          </div>
          <div className="card-big" onClick={()=>destiny("1 LT")} >
            <img src={liter} alt="" className="icon-small"/>
            <h2>Litros</h2>
          </div>
          <div className="card-big" onClick={()=>destiny("PIEZA")}>
            <img src={piece} alt="" className="icon-small"/>
            <h2>Piezas</h2>
          </div>
        </div>
        </div>
      </section>
    </>
  );
}

export default Stock;
