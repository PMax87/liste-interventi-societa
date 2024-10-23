import { useData } from "../context/DataContext";
import { formatPriceEurCurrency } from "../utils/formatPrice";
import { useEffect, useState } from "react";

const TotalsBox = () => {
  const { assistancesList } = useData();

  // conto manualmente gli interventi in quanto FIREBASE non può contare gli elementi precedentemente filtrati
  const [totalAcceptedAssistances, setTotalAcceptedAssistances] = useState<number | null>(null);
  const [totalNonAcceptedAssistances, setTotalNonAcceptedAssistances] = useState<number | null>(null);
  const [totalAmount, setTotalAmount] = useState<number | null>(null);

  useEffect(() => {
    if (assistancesList) {
      const acceptedCount = assistancesList.filter((item) => item.esito_intervento === true).length;
      const nonAcceptedCount = assistancesList.filter((item) => item.esito_intervento === false).length;
      const calcTotalAmount = assistancesList.reduce((accumulator, assistance) => accumulator + assistance.importo_intervento, 0);
      setTotalAcceptedAssistances(acceptedCount);
      setTotalNonAcceptedAssistances(nonAcceptedCount);
      setTotalAmount(calcTotalAmount);
    }
  }, [assistancesList]);

  let totalAssistances = null;
  let totalAmountWithoutVat = null;
  let calcVat = null;

  if (totalAcceptedAssistances && totalNonAcceptedAssistances !== null) {
    totalAssistances = totalAcceptedAssistances + totalNonAcceptedAssistances;
  }

  calcVat = (100 * totalAmount) / 122;
  totalAmountWithoutVat = totalAmount - calcVat;
  console.log(totalAmountWithoutVat);

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
