import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import "./App.css";
import React from "react";
import {
  getAddressData,
  getTransactionData,
  getBlockDataByHash,
  getBlockDataByBlockHeight,
} from "./utils/api_interaction";
import { SearchType } from "./utils/validateSearchQuery";
import Searchbar from "./components/Searchbar";
import Navbar from "./components/Navbar";
import TransactionPage from "./pages/Transaction";
import Home from "./pages/Home";
import BlockInfoPage from "./pages/BlockInfo";
import WalletAddressPage from "./pages/WalletAddress";

function App() {
  return (
    <Router>
      <Navbar />
      <Layout />
    </Router>
  );
}

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);

  const handleSearch = async (_query: string, _type: SearchType) => {
    setLoading(true);
    setResult(null);

    let data = null;

    try {
      switch (_type) {
        case "address":
          data = await getAddressData(_query);
          if (data) {
            setResult(data);
            navigate(`/address/${_query}`);
          }
          break;

        case "64hash":
          data = await getTransactionData(_query);
          if (data) {
            setResult(data);
            navigate(`/tx/${_query}`);
          } else {
            data = await getBlockDataByHash(_query);
            if (data) {
              setResult(data);
              navigate(`/block/${_query}`);
            }
          }
          break;

        case "blockHeight":
          data = await getBlockDataByBlockHeight(_query);
          if (data) {
            setResult(data);
            navigate(`/block/${_query}`);
          }
          break;

        default:
          alert("Ungültige Eingabe!");
          break;
      }

      if (!data) {
        alert("Keine Daten gefunden.");
      }
    } catch (error) {
      console.error("API-Fehler:", error);
      alert("Fehler beim Abrufen der Daten.");
    }

    setLoading(false);
  };

  return (
    <div>
      <Searchbar onSearch={handleSearch} />
      {loading && <p style={{ textAlign: "center" }}>Lade Daten...</p>}
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/tx/:hash" element={<TransactionPage result={result} />} />
        <Route
          path="/address/:wallet"
          element={<WalletAddressPage result={result} />}
        />
        <Route
          path="/block/:block"
          element={<BlockInfoPage result={result} />}
        />
      </Routes>
    </div>
  );
}

export default App;
