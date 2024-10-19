import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getCountFromServer,
} from "firebase/firestore";
import { db } from "../firebase";
import { useData } from "../context/DataContext";

const TotalAssistancesRow = () => {
  const { assistancesList } = useData();
  const [counter, setCounter] = useState<number | null>(null);

  const count = async () => {
    const coll = collection(db, "lista_interventi");
    const q = query(coll, where("nome_compagnia", "==", "hlpy"));
    const snapshot = await getCountFromServer(q);
    setCounter(snapshot.data().count);
    console.log("count: ", snapshot.data().count);
  };

  useEffect(() => {
    count();
  }, [assistancesList]);

  return (
    <div>
      <p>{counter}</p>
    </div>
  );
};

export default TotalAssistancesRow;
