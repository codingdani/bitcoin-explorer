import { useParams } from "react-router-dom";
import React from "react";

interface Props {
  result: any;
}

export default function BlockInfoPage({ result }: Props) {
  const { block } = useParams();

  return (
    <div>
      <h1>Block-Details</h1>
      {result ? (
        <pre>{JSON.stringify(result, null, 2)}</pre>
      ) : (
        <p>Keine Daten für Block {block} gefunden.</p>
      )}
    </div>
  );
}
