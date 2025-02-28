import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBlockData, getTransactionData } from "../utils/api_interaction";
import "../styles/blockinfo.css";

interface BlockData {
  height: number;
  hash: string;
  time: string;
  size: number;
  n_tx: number;
  miner: string;
  fees: number;
  txids: string[];
  nonce: number;
}

interface BlockInfoPageProps {
  result: BlockData | null;
}

export default function BlockInfoPage({ result }: BlockInfoPageProps) {
  const { block } = useParams();
  const navigate = useNavigate();

  const [blockData, setBlockData] = useState<BlockData | null>(null);
  const [miner, setMiner] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBlockData = async () => {
      try {
        const data = await getBlockData(block!);
        if (data) {
          setBlockData(data);
          const miner = await getMinerOfBlock(data);
          setMiner(miner);
        } else {
          throw new Error("Keine Blockdaten gefunden.");
        }
      } catch (err) {
        console.error("API-Fehler:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlockData();
  }, [block]);

  const handleTransactionClick = async (_txID: string) => {
    const transaction = await getTransactionData(_txID);
    if (transaction) {
      navigate(`/tx/${_txID}`);
    } else {
      alert("Fehler: Transaktionsdaten nicht gefunden!");
    }
  };

  const getMinerOfBlock = async (_blockData: BlockData) => {
    try {
      if (!_blockData || !_blockData.txids || _blockData.txids.length === 0) {
        throw new Error("Ungültige Blockdaten: Keine Transaktionen gefunden.");
      }
      const coinbaseTx = _blockData.txids[0];
      const txData = await getTransactionData(coinbaseTx);
      if (!txData || !txData.outputs || txData.outputs.length === 0) {
        throw new Error("Keine Outputs in der Coinbase-Transaktion gefunden.");
      }
      // Standard: Erste Output-Adresse
      let minerAddress = txData.outputs[0]?.addresses?.[0] || null;
      // Falls `outputs[0]` keine Adresse hat
      if (!minerAddress && txData.outputs.length > 1) {
        minerAddress = txData.outputs[1]?.addresses?.[0] || null;
      }
      return minerAddress;
    } catch (error) {
      console.error("Fehler beim Abrufen der Miner-Adresse:", error);
      return null;
    }
  };

  return (
    <div className="block-container">
      {loading && <p>Lade Blockdaten...</p>}
      {blockData && (
        <>
          <h1 className="block-title">Block #{blockData.height}</h1>
          <div className="block-info">
            <p>
              <strong>Block Hash:</strong> {blockData.hash}
            </p>
            <p>
              <strong>Nonce:</strong> {blockData.nonce}
            </p>
            <p>
              <strong>Miner:</strong> {miner}
            </p>
            <p>
              <strong>Blockgröße:</strong> {blockData.size} Bytes
            </p>
            <p>
              <strong>Transaktionen:</strong> {blockData.n_tx}
            </p>
            <p>
              <strong>Belohnung:</strong> {blockData.fees / 100000000} BTC
            </p>
            <p>
              <strong>Zeit:</strong> {new Date(blockData.time).toLocaleString()}
            </p>
          </div>
          <table className="block-table">
            <thead>
              <tr>
                <th>TX Hashes</th>
              </tr>
            </thead>
            <tbody>
              {blockData.txids.map((tx) => (
                <tr key={tx}>
                  <td>{tx.slice(0, 15)}...</td>
                  <td>
                    <button
                      onClick={() => handleTransactionClick(tx)}
                      className="block-button"
                    >
                      Details anzeigen
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
