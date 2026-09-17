import { useEffect, useState } from "react";
import { helpHttp } from "../helpers/helpHttp";
import { helpHost } from "../helpers/helpHost";
import Loader from "../components/Loader";
import ErrorFetch from "../components/ErrorFetch";
import UpButton from "../components/UpButon";

function Products() {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [products, setProducts] = useState([]);
  const [actual, setActual] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  
  const [totalProducts, setTotalProducts] = useState("");

  const api = helpHttp();
  const host = helpHost().getIp();

  // Solicita los registros al servidor
  function getProducts(actual) {
    if (actual > totalPages) return;

    let url = `http://${host}:8080/products?page=${actual}`;
    setIsLoading(true)
    api
      .get2(url)
      .then((res) => {
        products.length > 0
          ? setProducts([...products, ...res.content])
          : setProducts(res.content);

        setTotalProducts(res.totalElements);
        setTotalPages(res.totalPages - 1);
        setIsLoading(false);
        setActual(res.number);
      })
      .catch((err) => {
        setIsLoading(false);
        setIsError(true);
        console.log("error " + err);
      });
  }

  useEffect(() => {
    getProducts(actual);
  }, [actual]);

  function loadScrollInfinite() {
    if (actual > totalPages) return;
    setActual(actual + 1);
  }

  // Logica de comportamiento del scroll
  function handleScroll() {
    const { scrollTop, clientHeight, scrollHeight } =
      document.querySelector(".content-container");
    if (scrollTop + clientHeight >= scrollHeight - 2) {
      loadScrollInfinite();
    }
  }

  // Creamos un listener para el scroll del componente content-container, donde se renderizan los elementos
  useEffect(() => {
    // window.addEventListener('touchmove', handleScroll);
    const $contentContainer = document.querySelector(".content-container");
    $contentContainer.addEventListener("scroll", handleScroll);
    return () => {
      // Remover el listener al desmontar el componente
      // window.removeEventListener('touchmove', handleScroll);
      $contentContainer.removeEventListener("scroll", handleScroll);
    };
  });

  return (
    <>
      <section className="main-container">
        <div className="main-container-title">{totalProducts} Productos</div>
        <div className="content-container">
          <div className="titles-container grid-first-small">
            <h2>Id</h2>
            <h2>Descripcion</h2>
          </div>
          {/* <div className="scroll-display" style={{position:"fixed",top:"0",left:"0",backgroundColor:"green",}}>
            <h3>{myScrollTop}</h3>
            <h3>{myClientHeight}</h3>
            <h3>{scrollHeight}</h3>
          </div> */}
          <div className="elements-container">
            {products &&
              products.map((el) => {
                return (
                  <div className="data-element grid-first-small" key={el.id}>
                    <h3>{el.id}</h3>
                    <h3>{el.description}</h3>
                  </div>
                );
              })}
            {isLoading && <Loader />}
            {isError && <ErrorFetch />}
          </div>
        </div>
        <UpButton />
      </section>
    </>
  );
}

export default Products;
