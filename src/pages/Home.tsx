import React, { useEffect, useState } from "react";
import { getMemPoolData } from "../utils/api_interaction";
import "../styles/mempool.css";
import BitcoinChart from "../components/BitcoinChart";

interface Transaction {
  hash: string;
  block_height: number;
  addresses: string[];
  total: number;
  fees: number;
  size: number;
  vsize: number;
  received: string;
}

export default function Home() {
  const [mempool, setMempool] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [shownTransactions, setShownTransactions] = useState<Transaction[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [offset, setOffset] = useState<number>(0);
  const [autoUpdate, setAutoUpdate] = useState<boolean>(true);

  const transactionListLength = 20;

  const fetchMempoolData = async () => {
    if (!autoUpdate) return;

    setLoading(true);

    try {
      const txArray = await getMemPoolData();
      if (txArray && Array.isArray(txArray)) {
        setMempool(txArray);
        setShownTransactions(txArray.slice(0, transactionListLength));
        setOffset(transactionListLength);
        setLastUpdated(new Date());
        setAutoUpdate(true);
      }
    } catch (error) {
      console.log("API ERROR", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!autoUpdate) return;
    fetchMempoolData();
    const interval = setInterval(() => {
      fetchMempoolData();
    }, 10000);
    return () => clearInterval(interval);
  }, [autoUpdate]);

  const loadMoreTransactions = () => {
    const nextOffset = offset + transactionListLength;
    const moreTx = mempool.slice(offset, nextOffset);
    setShownTransactions([...shownTransactions, ...moreTx]);
    setOffset(nextOffset);
    setAutoUpdate(false);
  };

  const manualFetchMempoolData = () => {
    setAutoUpdate(true);
    fetchMempoolData();
  };

  return (
    <>
      <BitcoinChart />
      <div className="mempool-container">
        {lastUpdated && (
          <p className="mempool-update-time">
            Zuletzt aktualisiert: {lastUpdated.toLocaleTimeString()}
          </p>
        )}

        <button
          onClick={manualFetchMempoolData}
          className="mempool-refresh-button"
        >
          aktualisieren
        </button>

        {loading && <p className="mempool-loading">Lade Mempool...</p>}

        {shownTransactions.length > 0 ? (
          <>
            <h2>Mempool</h2>
            <table className="mempool-table">
              <thead>
                <tr>
                  <th>TX Hash</th>
                  <th>Gesamtbetrag</th>
                  <th>Gebühren</th>
                  <th>Größe</th>
                  <th>Zeit</th>
                </tr>
              </thead>
              <tbody>
                {shownTransactions.map((tx) => (
                  <tr key={tx.hash}>
                    <td>
                      <a href={`/tx/${tx.hash}`} className="mempool-link">
                        {tx.hash.slice(0, 15)}...
                      </a>
                    </td>
                    <td>{(tx.total / 100000000).toFixed(8)} BTC</td>
                    <td>{(tx.fees / 100000000).toFixed(8)} BTC</td>
                    <td>{tx.size} Bytes</td>
                    <td>{new Date(tx.received).toLocaleTimeString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {offset <= mempool.length && (
              <button
                onClick={loadMoreTransactions}
                className="mempool-load-more-button"
              >
                Mehr laden
              </button>
            )}
          </>
        ) : (
          !loading && <p>Keine Transaktionen gefunden.</p>
        )}
      </div>
    </>
  );
}
