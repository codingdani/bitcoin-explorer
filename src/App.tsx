import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
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

function App() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSearch = async (query: string, type: SearchType) => {
    setLoading(true);
    setResult(null);

    let data = null;

    try {
      switch (type) {
        case "address":
          data = await getAddressData(query);
          break;
        case "transaction or blockHash":
          data = await getTransactionData(query);
          if (!data) {
            data = await getBlockDataByHash(query);
          }
          break;
        case "blockHeight":
          data = await getBlockDataByBlockHeight(query);
          break;
        default:
          alert("Ungültige Eingabe!");
          return;
      }
    } catch (error) {
      console.error("API-Fehler:", error);
      alert("Fehler beim Abrufen der Daten.");
    }
  };

  return (
    <div>
      <h1 style={{ textAlign: "center", padding: "20px" }}>Bitcoin Explorer</h1>
      <Searchbar onSearch={handleSearch} />
      {loading && <p style={{ textAlign: "center" }}>Lade Daten...</p>}
      {result && (
        <pre style={{ textAlign: "center" }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default App;
