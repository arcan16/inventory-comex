import { NavLink, useNavigate } from "react-router-dom";
import "../Styles/NavBar.css";

import iconapp from "../assets/icons/01box.png";
import home from "../assets/icons/home.png";
import checklist from "../assets/icons/checklist.png";
import documents from "../assets/icons/documents.png";
import products from "../assets/icons/products.png";
import stock from "../assets/icons/stock.png";
import exit from "../assets/icons/exit.png";
import Cookies from "js-cookie";

function NavBar() {
  const navigate = useNavigate();

    function goDestiny(destiny){
      navigate(destiny)
    }

    function closeMenu(e){
      const $chkBtn = document.querySelector(".off-canvas-btn");
      if($chkBtn.checked){
        $chkBtn.checked=false
      }
    }

    function logOut(e){
      closeMenu(e);
      e.preventDefault();
      let answer = confirm("Cerrar Sesion?");
      if(answer){
        alert("Cerrando sesion")
        Cookies.remove("Credentials")
        location.href="/login"
      }
    }

  return (
    <>
    <div className="nav-title-container" onClick={()=>goDestiny("")} >
      <img src={iconapp} alt="" className="icon" />
      <h2 className="nav-title">Stock e Inventarios</h2>
    </div>
    
      <div className="nav-conatiner">
        <input type="checkbox" className="off-canvas-btn" />
        <label className="off-canvas-burger"></label>
        <div className="back-blur"></div>
        <nav className="off-canvas-menu">
          <div className="off-canvas-menu-container">
            <div className="off-canvas-menu-header">
              <div className="header-title-container">
                <img src={iconapp} alt="" className="icon" />
                <h2>Stock e Inventarios</h2>
              </div>
              <h3 className="bg-darker second">Comex Anahuac</h3>
            </div>
            <NavLink to='' className="link" onClick={closeMenu}>
              <img src={home} alt="" className="icon-small"/>
              <h2>Home</h2>
            </NavLink>
            <NavLink to="/inventory" className="link" onClick={closeMenu}>
              <img src={checklist} alt="" className="icon-small"/>
              <h2>Inventarios</h2>
            </NavLink>
            <NavLink to="/reports" className="link" onClick={closeMenu}>
              <img src={documents} alt="" className="icon-small" />
              <h2>Reportes</h2>
            </NavLink>
            <NavLink to="/products" className="link" onClick={closeMenu}>
              <img src={products} alt="" className="icon-small"/>
              <h2>Productos</h2>
            </NavLink>
            <NavLink to="/stock" className="link" onClick={closeMenu}>
              <img src={stock} alt="" className="icon-small"/>
              <h2>Stock</h2>
            </NavLink>
            <NavLink className="link" onClick={logOut}>
              <img src={exit} alt="" className="icon-small"/>
              <h2>Salir</h2>
            </NavLink>
          </div>
        </nav>
      </div>
    </>
  );
}

export default NavBar;
