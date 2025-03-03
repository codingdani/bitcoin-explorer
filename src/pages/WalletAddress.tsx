import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAddressData } from "../utils/api_interaction";
import "../styles/wallet.css";

interface WalletData {
  address: string;
  final_balance: number;
  n_tx: number;
  total_received: number;
  total_sent: number;
}

export default function WalletAddressPage({ result }: { result: WalletData }) {
  const { wallet } = useParams();
  const [walletData, setWalletData] = useState<WalletData | null>(result);
  const [loading, setLoading] = useState<boolean>(!result);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!walletData) {
      const fetchWalletData = async () => {
        try {
          const data = await getAddressData(wallet!);
          if (data) {
            setWalletData(data);
          } else {
            throw new Error("Keine Wallet-Daten gefunden.");
          }
        } catch (err) {
          console.error("API-Fehler:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchWalletData();
    }
  }, [wallet, walletData]);

  return (
    <div className="wallet-container">
      {loading && <p>⏳ Lade Wallet-Daten...</p>}
      {error && <p className="wallet-error">{error}</p>}

      {walletData && (
        <>
          <h1 className="wallet-title">Wallet-Adresse</h1>
          <div className="wallet-info">
            <p>
              <strong>Adresse:</strong> {walletData.address}
            </p>
            <p>
              <strong>Gesamt empfangen:</strong>{" "}
              {(walletData.total_received / 100000000).toFixed(8)} BTC
            </p>
            <p>
              <strong>Gesamt gesendet:</strong>{" "}
              {(walletData.total_sent / 100000000).toFixed(8)} BTC
            </p>
            <p>
              <strong>Aktuelles Guthaben:</strong>{" "}
              {(walletData.final_balance / 100000000).toFixed(8)} BTC
            </p>
            <p>
              <strong>Transaktionsanzahl:</strong> {walletData.n_tx}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
