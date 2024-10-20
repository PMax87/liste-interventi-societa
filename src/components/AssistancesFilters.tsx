import { Formik, Form } from "formik";
import CustomInput from "./CustomInput";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  Button,
  AccordionButton,
  Box,
  AccordionIcon,
} from "@chakra-ui/react";
import { useData } from "../context/DataContext";
import { AssistanceDatas } from "../models/AssistanceDatas";

const AssistancesFilters = () => {
  const filterFormInitialValues = {
    start_date: "",
    end_date: "",
    accepted: false,
    targa: "",
  };

  const { setAssistancesList, setIsLoadingAssistances } = useData();

  const countByDateRange = async (values) => {
    setIsLoadingAssistances(true);
    const { start_date, end_date } = values;
    const q = query(
      collection(db, "lista_interventi"),
      where("data_intervento", ">=", start_date),
      where("data_intervento", "<=", end_date)
    );
    const querySnapshot = await getDocs(q);

    const assistancesArray = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as AssistanceDatas)
    );
    setAssistancesList(assistancesArray);
    setIsLoadingAssistances(false);
  };

  return (
    <div className="mt-8">
      <Accordion allowToggle>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left" fontWeight="bold">
                Filtra gli interventi
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel>
            <Formik
              initialValues={filterFormInitialValues}
              onSubmit={(values) => countByDateRange(values)}
            >
              {(props) => (
                <Form>
                  <div className="grid grid-cols-3 gap-5 mt-2">
                    <CustomInput
                      type="date"
                      name="start_date"
                      placeholder="Data di inizio"
                      formLabel="Data di inizio"
                    />
                    <CustomInput
                      type="date"
                      name="end_date"
                      placeholder="Data di fine"
                      formLabel="Data di fine"
                    />
                    <CustomInput
                      type="text"
                      name="targa"
                      placeholder="Cerca per targa"
                      formLabel="Cerca per targa"
                    />
                    <CustomInput
                      type="text"
                      name="numero_dossier"
                      placeholder="Cerca per Dossier"
                      formLabel="Cerca per dossier"
                    />
                  </div>
                  <Button type="submit" className="mt-4">
                    Cerca
                  </Button>
                </Form>
              )}
            </Formik>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default AssistancesFilters;
