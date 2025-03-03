// check API Docs: https://www.blockcypher.com/dev/bitcoin/#introduction

import axios from "axios";

const VITE_BLOCKCYPHER_API_KEY = import.meta.env.VITE_BLOCKCYPHER_API_KEY;
const TOKEN_EXTENSION = `?token=${VITE_BLOCKCYPHER_API_KEY}`;
const BASE_API_URL = "https://api.blockcypher.com/v1/btc/main";
const COINGECKO_API_URL = "https://api.coingecko.com/api/v3";

/**
 * Holt den aktuellen Bitcoin-Preis.
 * @returns Preis in USD oder null bei Fehler.
 */
export const getBitcoinPrice = async (): Promise<number | null> => {
  try {
    const response = await axios.get(
      `${COINGECKO_API_URL}/simple/price?ids=bitcoin&vs_currencies=usd`
    );
    return response.data.bitcoin.usd;
  } catch (error) {
    console.error("❌ Fehler beim Abrufen des Bitcoin-Preises:", error);
    return null;
  }
};

/**
 * Holt historische Bitcoin-Preise der letzten X Tage.
 * @param _days Anzahl der Tage (max. 90 bei CoinGecko kostenlos)
 * @returns Array mit Zeitstempeln & Preisen oder null
 */
export const getHistoricalBitcoinPrices = async (
  _days: number = 7
): Promise<{ time: string; price: number }[] | null> => {
  try {
    const response = await axios.get(
      `${COINGECKO_API_URL}/coins/bitcoin/market_chart?vs_currency=usd&days=${_days}`
    );
    const prices = response.data.prices.map((entry: [number, number]) => ({
      time: new Date(entry[0]).toLocaleDateString(), // 🏗️ Datum formatieren
      price: entry[1],
    }));
    return prices;
  } catch (error) {
    console.error("Fehler beim Abrufen der historischen Bitcoin-Daten:", error);
    return null;
  }
};

//Funktion um Wallet-Informationen abzurufen
/**
 * Holt die Informationen einer Wallet
 * @param _address of Bitcoin-Wallet
 * @returns Wallet {}
 */
export const getAddressData = async (_address: string) => {
  try {
    const response = await axios.get(
      `${BASE_API_URL}/addrs/${_address}${TOKEN_EXTENSION}`
    );
    return response.data;
  } catch (error) {
    console.error("Fehler beim Aufrufen der Adresse", error);
    return null;
  }
};

//Funktion um Transaktion-Details abzurufen
/**
 * Holt die Informationen einer Transaktion
 * @param _txID 64 stelliger Hash einer tx
 * @returns TX {}
 */
export const getTransactionData = async (_txID: string) => {
  try {
    const response = await axios.get(
      `${BASE_API_URL}/txs/${_txID}${TOKEN_EXTENSION}`
    );
    return response.data;
  } catch (error) {
    console.error("Fehler beim Aufrufen der Transaktion", error);
    return null;
  }
};

//Funktion um unverarbeitete Transaktionen abzurufen
/**
 * Holt unbestätigte Transaktionen (Mempool)
 * default Anzahl ist 10, kann auf bis zu 100 erhöht werden
 * @returns Array von TX_IDs
 */
export const getMemPoolData = async () => {
  try {
    const response = await axios.get(`${BASE_API_URL}/txs${TOKEN_EXTENSION}`);
    return response.data;
  } catch (error) {
    console.error(
      "Fehler beim Aufrufen von unbestätigten Transaktionen",
      error
    );
    return null;
  }
};

//Funktion um Block-Informationen abzurufen
/**
 * Holt die Informationen eines spezifischen Blocks
 * @param _blockHashOrHeight 64 stelliger Hash oder Height/Nummer des Blocks
 * @returns Block
 */
export const getBlockData = async (_blockHashOrHeight: string) => {
  try {
    const response = await axios.get(
      `${BASE_API_URL}/blocks/${_blockHashOrHeight}${TOKEN_EXTENSION}`
    );
    return response.data;
  } catch (error) {
    console.error("Fehler beim Aufrufen von Block Daten", error);
    return null;
  }
};

//Funktion um Wallet-Adressen abzurufen
/**
 * Holt die Wallet Adressen zu einem spezifischen Namen
 * @param _walletName zugewisener Name zu einer oder mehrere Wallet adressen
 * @returns Wallet or HDWallet
 */
export const getAddressDataByName = async (_walletName: string) => {
  try {
    const response = await axios.get(
      `${BASE_API_URL}/wallets/${_walletName}${TOKEN_EXTENSION}`
    );
    return response.data;
  } catch (error) {
    console.error("Fehler beim Aufrufen der Wallet Daten", error);
    return null;
  }
};
