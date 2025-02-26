export type SearchType = "address" | "64hash" | "blockHeight" | "invalid";

export const validateSearchQuery = (_query: string): SearchType => {
  const query = _query.trim();

  //Is Input a Number? ?> BlockNumber
  if (/^\d+$/.test(query)) return "blockHeight";

  //64 stelliger Hex-String? => Transaction or BlockHash
  if (/^[0-9a-fA-F]{64}$/.test(query)) return "64hash";

  //bitcoin address? => starts with 1, 3, or bc1
  if (/^(1|3|bc1)[a-zA-Z0-9]{25,41}$/.test(query)) return "address";

  return "invalid";
};
