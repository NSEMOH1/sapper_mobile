export const REMITA_CONFIG = {
  base_url: "https://demo.remita.net/payment/v1/payment/query/",
  public_key: "",
  merchantId: "",
  serviceTypeId: "",
};

export const generateTransactionRef = () => {
  return `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// export const generateHash = async (orderId: any, amount: any, responseUrl: any) => {
//   const hashString = `${REMITA_CONFIG.merchantId}${REMITA_CONFIG.serviceTypeId}${orderId}${amount}${responseUrl}`;
//   return await Crypto.digestStringAsync(
//     Crypto.CryptoDigestAlgorithm.SHA512,
//     hashString + REMITA_CONFIG.public_key
//   );
// };