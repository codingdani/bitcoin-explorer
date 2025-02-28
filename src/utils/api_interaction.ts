import axios from "axios";

const VITE_BLOCKCYPHER_API_KEY = import.meta.env.VITE_BLOCKCYPHER_API_KEY;
const TOKEN_EXTENSION = `?token=${VITE_BLOCKCYPHER_API_KEY}`;
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

//Funktion um Block-Hash oder Block-Height abzurufen
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

/**
 * Holt die Coinbase-Transaktion eines Blocks und gibt die Miner-Adresse zurück
 * @param _blockHash Hash des Blocks
 * @returns Miner-Adresse oder null
 */
export const getBlockMinerAddress = async (
  _blockHash: string
): Promise<string | null> => {
  try {
    const blockResponse = await axios.get(
      `${BASE_API_URL}/blocks/${_blockHash}${TOKEN_EXTENSION}`
    );
    const blockData = blockResponse.data;

    if (!blockData.txids || blockData.txids.length === 0) {
      throw new Error("Keine Transaktionen im Block gefunden.");
    }

    const coinbaseTxId = blockData.txids[0]; // Coinbase-Transaktion

    const txResponse = await axios.get(
      `${BASE_API_URL}/txs/${coinbaseTxId}${TOKEN_EXTENSION}`
    );
    const txData = txResponse.data;

    if (!txData.outputs || txData.outputs.length === 0) {
      throw new Error("Keine Outputs in der Coinbase-Transaktion gefunden.");
    }

    const minerAddress = txData.outputs[0].addresses
      ? txData.outputs[0].addresses[0]
      : null;
    return minerAddress;
  } catch (error) {
    console.error("Fehler beim Abrufen der Miner-Adresse:", error);
    return null;
  }
};
