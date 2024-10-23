import { useFilter } from "../context/FilterContext";
import { formatPriceEurCurrency } from "../utils/formatPrice";

const TotalsBox = () => {
  const { totalAcceptedAssistances, totalNonAcceptedAssistances, totalAmount } = useFilter();

  let totalAssistances = null;

  if (totalAcceptedAssistances && totalNonAcceptedAssistances !== null) {
    totalAssistances = totalAcceptedAssistances + totalNonAcceptedAssistances;
  }

  const calcVat = (100 * totalAmount) / 122;
  const totalAmountWithoutVat = totalAmount - calcVat;

  return (
    <div className="grid grid-cols-5 mt-6 justify-items-center">
      <div className="flex flex-col gap-1 items-center">
        <p className="font-bold">Totale interventi</p>
        <p>{totalAssistances === null ? "" : totalAssistances}</p>
      </div>
      <div className="flex flex-col gap-1 items-center">
        <p className="font-bold">Totale interventi accettati</p>
        <p>{totalAcceptedAssistances === null ? "" : totalAcceptedAssistances}</p>
      </div>
      <div className="flex flex-col gap-1 items-center">
        <p className="font-bold">Totale interventi non accettati</p>
        <p>{totalNonAcceptedAssistances === null ? "" : totalNonAcceptedAssistances}</p>
      </div>
      <div className="flex flex-col gap-1 items-center">
        <p className="font-bold">Importo imponibile</p>
        <p>{totalAmountWithoutVat === null ? "" : formatPriceEurCurrency(totalAmount - totalAmountWithoutVat)}</p>
      </div>
      <div className="flex flex-col gap-1 items-center">
        <p className="font-bold">Importo Ivato </p>
        <p>{totalAmount === null ? "" : formatPriceEurCurrency(totalAmount)}</p>
      </div>
    </div>
  );
};

export default TotalsBox;
