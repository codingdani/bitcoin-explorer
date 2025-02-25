import { useState } from "react";
import { SearchType, validateSearchQuery } from "../utils/validateSearchQuery";
import React from "react";

interface SearchbarProps {
  onSearch: (_query: string, type: SearchType) => void;
}

export default function Searchbar({ onSearch }: SearchbarProps) {
  const [query, setQuery] = useState<string>("");

  const handleSearch = () => {
    const searchType = validateSearchQuery(query);

    if (searchType === "invalid") {
      alert(
        "Ungültige Eingabe; Bitte gib eine gültige Bitcoin-Adresse, eine Tx-ID, ein BlockHash oder eine Blocknummer ein."
      );
      return;
    }

    onSearch(query, searchType);
  };
  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <input
        type="text"
        placeholder="Bitcoin Adresse, TxID oder Blocknummer eingeben..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          padding: "10px",
          fontSize: "16px",
          width: "300px",
          border: "1px solid #ccc",
          borderRadius: "5px",
        }}
      />
      <button
        onClick={handleSearch}
        style={{
          marginLeft: "10px",
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#ff9900",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Suchen
      </button>
    </div>
  );
}
