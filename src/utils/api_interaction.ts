import axios from "axios";

const BLOCKCYPHER_API_KEY = import.meta.env.VITE_BLOCKCYPHER_API_KEY;
const TOKEN_EXTENSION = `?token=${BLOCKCYPHER_API_KEY}`;
const BASE_API_URL = "https://api.blockcypher.com/v1/btc/main";

//Funktion um Wallet-Adressen abzurufen
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
export const getMemPoolData = async () => {
  try {
    const response = await axios.get(`${BASE_API_URL}/txs${TOKEN_EXTENSION}`);
    //returns an Array of up to 100 Tx in the mempool
    return response.data;
  } catch (error) {
    console.error(
      "Fehler beim Aufrufen von unbestätigten Transaktionen",
      error
    );
    return null;
  }
};

//Funktion um Block-Hash abzurufen
export const getBlockDataByHash = async (_blockHash: string) => {
  try {
    const response = await axios.get(
      `${BASE_API_URL}/blocks/${_blockHash}${TOKEN_EXTENSION}`
    );
    return response.data;
  } catch (error) {
    console.error("Fehler beim Aufrufen von Block Daten", error);
    return null;
  }
};

//Funktion um Block-Nummer abzurufen
export const getBlockDataByBlockHeight = async (_blockHeight: string) => {
  try {
    const response = await axios.get(
      `${BASE_API_URL}/blocks/${_blockHeight}${TOKEN_EXTENSION}`
    );
    return response.data;
  } catch (error) {
    console.error("Fehler beim Aufrufen der Block Daten", error);
    return null;
  }
};

//Funktion um Wallet-Name abzurufen
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
