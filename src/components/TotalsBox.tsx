import { useFilter } from "../context/FilterContext";
import { formatPriceEurCurrency } from "../utils/formatPrice";

const TotalsBox = () => {
  const { totalAcceptedAssistances, totalNonAcceptedAssistances, totalAmount } =
    useFilter();

  let totalAssistances;

  if (totalAcceptedAssistances && totalNonAcceptedAssistances !== null) {
    totalAssistances = totalAcceptedAssistances + totalNonAcceptedAssistances;
  }

  return (
    <div className="grid grid-cols-4 mt-5">
      <div className="flex flex-col">
        <p className="font-bold">Totale interventi</p>
        <p>{totalAssistances === null ? "" : totalAssistances}</p>
      </div>
      <div className="flex flex-col">
        <p className="font-bold">Totale interventi accettati</p>
        <p>
          {totalAcceptedAssistances === null ? "" : totalAcceptedAssistances}
        </p>
      </div>
      <div className="flex flex-col">
        <p className="font-bold">Totale interventi non accettati</p>
        <p>
          {totalNonAcceptedAssistances === null
            ? ""
            : totalNonAcceptedAssistances}
        </p>
      </div>
      <div className="flex flex-col">
        <p className="font-bold">Importo: </p>
        <p className="font-bold">
          {totalAmount === null ? "" : formatPriceEurCurrency(totalAmount)}
        </p>
      </div>
    </div>
  );
};

export default TotalsBox;
