import { useParams } from "react-router-dom";
import React from "react";

interface Props {
  result: any;
}

export default function TransactionPage({ result }: Props) {
  const { hash } = useParams();

  return (
    <div>
      <h1>Transaktionsdetails</h1>
      {result ? (
        <pre>{JSON.stringify(result, null, 2)}</pre>
      ) : (
        <p>Keine Daten für {hash} gefunden.</p>
      )}
    </div>
  );
}
