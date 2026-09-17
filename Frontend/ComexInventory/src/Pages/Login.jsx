import { useRef } from "react";
import "../Styles/Login.css";
import logo from "../assets/icons/01box.png";
import { helpHost } from "../helpers/helpHost";
import { helpHttp } from "../helpers/helpHttp";
import Cookies from "js-cookie";

export default function Login() {
  const host = helpHost().getIp();
  const api = helpHttp();
  const $username = useRef(null);
  const $password = useRef(null);
  
  function handleSubmit(e){
    e.preventDefault();
    
    let url = `http://${host}:8080/login`;
    let options ={
      headers: {
        "Content-Type": "application/json",
      },
      body:{
        usuario: $username.current.value,
        password: $password.current.value
      }
    };

    api.post2(url,options).then(res=>{
      Cookies.set("Credentials",res.Authentication);
      location.href="/"
    }).catch(err=>{
      alert("Error en la autenticacion, verificar los campos");
      $username.current.select()
    })

  }
  return (
    <>
      <div className="box-login">
        <form onSubmit={handleSubmit} className="login-form">
          <h1 className="header-login">Inventarios y stock</h1>
          <img src={logo} alt="Logo del negocio" className="logo-negocio"></img>
          <h2 className="titulo-login">Iniciar Sesion</h2>
          <p>Continuar al Control de Inventaio</p>
          <input
            type="text"
            name="username"
            id="username"
            placeholder="Usuario"
            className="credentials"
            ref={$username}
            autoFocus
            required
          />
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Contraseña"
            className="credentials"
            ref={$password}
            required
          />
          <input
            type="submit"
            value="Iniciar Sesión"
            className="btn-login"
          />
        </form>
        
      </div>
      {/* {modal ? (
        <Modal closeModal={closeModal} isOpen={isOpen}>
          <Recover closeModal={closeModal}/>
        </Modal>
      ) : null} */}
    </>
  );
}
