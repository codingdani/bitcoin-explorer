import React from "react";
import { useParams } from "react-router-dom";

interface Props {
  result: any;
}

export default function WalletAddressPage({ result }: Props) {
  const { wallet } = useParams();

  return (
    <div>
      <h1>Wallet-Details</h1>
      {result ? (
        <pre>{JSON.stringify(result, null, 2)}</pre>
      ) : (
        <p>Keine Daten für {wallet} gefunden.</p>
      )}
    </div>
  );
}
