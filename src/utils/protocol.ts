
// Protocol number to name mapping
export const protocols: Record<number, string> = {
  1: "ICMP",
  6: "TCP",
  17: "UDP",
  47: "GRE",
  50: "ESP (IPsec)",
  51: "AH (IPsec)",
  58: "ICMPv6",
  132: "SCTP",
};


export const getProtocolName = (protocol: string | number): string => {
  if (!protocol) return "Unknown";
  const protocolNum = Number(protocol);
  return protocols[protocolNum] || `Protocol ${protocol}`;
};


export const isKnownProtocol = (protocol: string | number): boolean => {
  if (!protocol) return false;
  const protocolNum = Number(protocol);
  return protocolNum in protocols;
};


export const getAllProtocols = (): Array<{ number: number; name: string }> => {
  return Object.entries(protocols).map(([number, name]) => ({
    number: parseInt(number),
    name,
  }));
};
