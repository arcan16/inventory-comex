import { useEffect } from "react";
import upButton from "../assets/icons/scrollUp.png";
function UpButton() {
  function setScrollVisibility() {
    const $boton = document.querySelector(".up-button");
    const {scrollTop} = document.querySelector(".content-container");
    
    // const { scrollTop } = document.documentElement;
    if (scrollTop > 100) {
      $boton.style.opacity = "1";
      $boton.style.visibility = "visible";
    } else {
      $boton.style.opacity = "0";
      $boton.style.visibility = "hidden";
    }
  }

  // Crea un listener para el scroll
  useEffect(() => {
    const $contentContainer = document.querySelector(".content-container");
    $contentContainer.addEventListener("scroll", setScrollVisibility);

    return () => {
      $contentContainer.removeEventListener("scroll", setScrollVisibility);
    };
  }, []);


  // Regresa la pantalla a la parte superior
  function goTopScroll(){
        // document.documentElement.scrollTop = 0;
        document.querySelector(".content-container").scrollTop = 0;
  }

  return (
    <div className="up-button">
      <img src={upButton} alt="" className="up-image" onClick={goTopScroll}/>
    </div>
  );
}

export default UpButton;

// function UpButton2() {

//   document.addEventListener("scroll", (e) => {
//     if (document.documentElement.scrollTop > 300) {
//       $boton.style.opacity = "1";
//       $boton.style.visibility = "visible";
//     } else {
//       $boton.style.opacity = "0";
//       $boton.style.visibility = "hidden";
//     }
//   });
//   $boton.addEventListener("click", (e) => {
//     document.documentElement.scrollTop = 0;
//   });
//   return (
//     <>

//     </>
//   );
// }
