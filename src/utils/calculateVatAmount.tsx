const vatRate = 0.22;

export const VatAmountFromGross = (nGrossAmount) => {
  return nGrossAmount / (1 + 1 / vatRate);
};

export const VatAmountFromNet = (nNetAmount: number) => {
  return nNetAmount * (1 + vatRate);
};
