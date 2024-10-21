import { useFilter } from "../context/FilterContext";
import { formatPriceEurCurrency } from "../utils/formatPrice";

const TotalsBox = () => {
  const { accettati, nonAccettati, totale } = useFilter();

  console.log(accettati, nonAccettati);
  console.log("Importo totale", formatPriceEurCurrency(totale));

  return (
    <div className="grid grid-cols-4">
      <p className="font-bold">Totale interventi</p>
      <p className="font-bold">
        Totale importo: {totale !== formatPriceEurCurrency(totale) ? "" : ""}
      </p>
      <p className="font-bold">Accettati</p>
      {/* <p className="font-bold">{accetatti === null ? "" : accetatti}</p> */}
      <p className="font-bold">Non accettati</p>
    </div>
  );
};

export default TotalsBox;
