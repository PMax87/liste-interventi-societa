import { useData } from "../context/DataContext";
import { formatPriceEurCurrency } from "../utils/formatPrice";
import { useEffect, useState } from "react";

const TotalsBox = () => {
  const { assistancesList } = useData();

  // conto manualmente gli interventi in quanto FIREBASE non può contare gli elementi precedentemente filtrati
  const [totalAcceptedAssistances, setTotalAcceptedAssistances] = useState<number>(0);
  const [totalNonAcceptedAssistances, setTotalNonAcceptedAssistances] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);

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

  let totalAssistances = 0;
  let totalAmountWithoutVat = 0;
  let calcVat = 0;

  if (totalAcceptedAssistances && totalNonAcceptedAssistances) {
    totalAssistances = totalAcceptedAssistances + totalNonAcceptedAssistances;
  }

  if (totalAmount !== null) {
    calcVat = (100 * totalAmount) / 122;
    totalAmountWithoutVat = totalAmount - calcVat;
  }

  return (
    <div className="grid grid-cols-5 mt-6 justify-items-center">
      <div className="flex flex-col gap-1 items-center">
        <p className="font-bold">Totale interventi</p>
        <p>{totalAcceptedAssistances + totalNonAcceptedAssistances}</p>
      </div>
      <div className="flex flex-col gap-1 items-center">
        <p className="font-bold">Totale interventi accettati</p>
        <p>{totalAcceptedAssistances}</p>
      </div>
      <div className="flex flex-col gap-1 items-center">
        <p className="font-bold">Totale interventi non accettati</p>
        <p>{totalNonAcceptedAssistances}</p>
      </div>
      <div className="flex flex-col gap-1 items-center">
        <p className="font-bold">Importo imponibile</p>
        <p>{formatPriceEurCurrency(totalAmount - totalAmountWithoutVat)}</p>
      </div>
      <div className="flex flex-col gap-1 items-center">
        <p className="font-bold">Importo Ivato </p>
        <p>{formatPriceEurCurrency(totalAmount)}</p>
      </div>
    </div>
  );
};

export default TotalsBox;
