// check API Docs: https://www.blockcypher.com/dev/bitcoin/#introduction

import axios from "axios";

const VITE_BLOCKCYPHER_API_KEY = import.meta.env.VITE_BLOCKCYPHER_API_KEY;
const TOKEN_EXTENSION = `?token=${VITE_BLOCKCYPHER_API_KEY}`;
const BASE_API_URL = "https://api.blockcypher.com/v1/btc/main";

//Funktion um Wallet-Adressen abzurufen
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

//Funktion um Transaktion-Hash abzurufen
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

//Funktion um Block-Hash oder Block-Height abzurufen
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

//Funktion um Wallet-Name abzurufen
/**
 * Holt die Informationen einer Wallet Adresse
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
