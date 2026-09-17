import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./Pages/Home";
import Inventory from "./Pages/Inventory";
import Reports from "./Pages/Reports";
import Products from "./Pages/Products";
import Stock from "./Pages/Stock";
import Cookies from "js-cookie";
import { ReportProvider } from "./context/ReportContext";
import SummaryCount from "./Pages/SummaryCount";
import TypeStock from "./components/stock/TypeStock";
import SummaryStock from "./components/stock/SummaryStock";
import GuidedInventory from "./components/inventory/GuidedInventory";
import NormalInventory from "./components/inventory/NormalInventory";
import Login from "./Pages/Login";
import { useEffect, useState } from "react";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if(!Cookies.get("Credentials")){
        setIsAuthenticated(false);
    }else{
      setIsAuthenticated(true);
    }
  }, [])
  
  return (
    <>
      <ReportProvider>
        <BrowserRouter>
          {!isAuthenticated ? (
            <Login />
          ) : (
            <>
              <NavBar/>
              <Routes>
                <Route path="" element={<Home />} />
                <Route path="/inventory" element={<Inventory />} />
                {/* <Route path='/inventory/:inventory' element={<ProductCounts/>}/> */}
                <Route
                  path="/inventory/:inventory"
                  element={<NormalInventory />}
                />
                <Route path="/login" element={<Login />} />
                <Route
                  path="/inventoryGuided/:inventory"
                  element={<GuidedInventory />}
                />
                <Route path="/summaryCount" element={<SummaryCount />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/products" element={<Products />} />
                <Route path="/stock" element={<Stock />} />
                <Route path="/summaryStock/:type" element={<SummaryStock />} />
                <Route path="/typeStock/:type" element={<TypeStock />} />
              </Routes>
            </>
          )}
        </BrowserRouter>
      </ReportProvider>
    </>
  );
}

export default App;
