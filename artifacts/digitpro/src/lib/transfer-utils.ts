export const BANKS = {
  novabank: { name: "Novabank", domain: "novabank.com", color: "#1a56db", logo: "NB", fullName: "Nova Bank International", swift: "NOVABKXX", address: "15 Rue de la Paix, 75001 Paris, France" },
  neobank:  { name: "Neobank",  domain: "neobank.com",  color: "#7c3aed", logo: "NB", fullName: "Neobank Europe S.A.", swift: "NEOBKXX", address: "Kirchenstraße 5, 10117 Berlin, Germany" },
  upsbank:  { name: "Upsbank",  domain: "upsbank.com",  color: "#0d9488", logo: "UB", fullName: "Upsbank Financial Group", swift: "UPSBKXX", address: "30 St Mary Axe, London EC3A 8EP, UK" },
};

export type BankKey = keyof typeof BANKS;

export function generateSecureCode(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const ts = Date.now().toString(36);
  let rand = "";
  for (let i = 0; i < 6; i++) rand += chars[Math.floor(Math.random() * chars.length)];
  return rand + ts;
}

export function generateTrackingUrl(bank: BankKey, code: string): string {
  return `https://secure${code}.${BANKS[bank].domain}`;
}

export function generateTransactionRef(): string {
  const prefix = ["TRF", "VIR", "WTR", "PAY"][Math.floor(Math.random() * 4)];
  const num = Math.floor(Math.random() * 9000000000) + 1000000000;
  return `${prefix}${num}`;
}
