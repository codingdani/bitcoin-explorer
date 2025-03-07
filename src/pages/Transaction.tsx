import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { getTransactionData } from "../utils/api_interaction";

interface TransactionData {
  hash: string;
  block_height: number;
  total: number;
  fees: number;
  size: number;
  vsize: number;
  inputs: { addresses: string[] }[];
  outputs: { addresses: string[] }[];
}

export default function TransactionPage({
  result,
}: {
  result: TransactionData | null;
}) {
  const { hash } = useParams();
  const [transactionData, setTransactionData] =
    useState<TransactionData | null>(result);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!transactionData) {
      const fetchTransactionData = async () => {
        try {
          const data = await getTransactionData(hash!);
          if (data) setTransactionData(data);
          else throw new Error("Keine Transaktionsdaten gefunden.");
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };
      fetchTransactionData();
    }
  }, [hash, transactionData]);

  return (
    <div className="transaction-container">
      {loading && <p>⏳ Lade Transaktionsdaten...</p>}
      {transactionData && (
        <>
          <h1 className="transaction-title">Transaktion</h1>
          <div className="transaction-info">
            <p>
              <strong>TX Hash:</strong> {transactionData.hash}
            </p>
            <p>
              <strong>Bestätigt in Block:</strong>{" "}
              {transactionData.block_height}
            </p>
            <p>
              <strong>Betrag:</strong>{" "}
              {(transactionData.total / 100000000).toFixed(8)} BTC
            </p>
            <p>
              <strong>Gebühren:</strong>{" "}
              {(transactionData.fees / 100000000).toFixed(8)} BTC
            </p>
            <p>
              <strong>Größe:</strong> {transactionData.size} Bytes
            </p>
            <p>
              <strong>Virtuelle Größe:</strong> {transactionData.vsize} vBytes
            </p>
          </div>
          {transactionData ? (
            <>
              <h2 className="transaction-subtitle">Sender</h2>
              <ul className="transaction-list">
                {transactionData.inputs.map((input, index) => (
                  <li key={index}>{input.addresses?.[0] || "Unbekannt"}</li>
                ))}
              </ul>

              <h2 className="transaction-subtitle">Empfänger</h2>
              <ul className="transaction-list">
                {transactionData.outputs.map((output, index) => (
                  <li key={index}>{output.addresses?.[0] || "Unbekannt"}</li>
                ))}
              </ul>
            </>
          ) : null}
        </>
      )}
    </div>
  );
}
