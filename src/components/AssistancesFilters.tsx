import { Formik, Form } from "formik";
import CustomInput from "./CustomInput";
import {
  FormControl,
  FormLabel,
  Select,
  FormErrorMessage,
} from "@chakra-ui/react";
import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionButton,
  Box,
  AccordionIcon,
} from "@chakra-ui/react";
import CustomButton from "./CustomButton";
import { useFilter } from "../context/FilterContext";
import { useData } from "../context/DataContext";
import filtersFormValidationSchema from "../validationSchema/filtersFormValidationSchema";
import { TotalsBox } from ".";
import { useEffect } from "react";

export interface AssistanceFiltersValues {
  start_date: string;
  end_date: string;
  esito_intervento: string;
  numero_dossier: string;
  targa: string;
  nome_compagnia: string;
}

const AssistancesFilters = () => {
  const filterFormInitialValues: AssistanceFiltersValues = {
    start_date: "",
    end_date: "",
    targa: "",
    numero_dossier: "",
    nome_compagnia: "",
    esito_intervento: "",
  };

  const { filterData, resetAllFilters } = useFilter();
  const { companiesList, getAssistancesList } = useData();

  useEffect(() => {
    getAssistancesList();
  }, []);

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
              onSubmit={(values) => filterData(values)}
              validationSchema={filtersFormValidationSchema}
            >
              {(formikProps) => (
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
                  </div>
                  <div className="grid grid-cols-3 gap-5 mt-3">
                    <CustomInput
                      type="text"
                      name="numero_dossier"
                      placeholder="Cerca per Dossier"
                      formLabel="Cerca per dossier"
                    />
                    <FormControl
                      isInvalid={Boolean(
                        formikProps.errors.nome_compagnia &&
                          formikProps.touched.nome_compagnia
                      )}
                    >
                      <FormLabel htmlFor="lista_Societa" fontWeight="bold">
                        Lista società
                      </FormLabel>
                      <Select
                        name="nome_compagnia"
                        placeholder="Seleziona una società"
                        onChange={formikProps.handleChange}
                        value={formikProps.values.nome_compagnia}
                      >
                        {companiesList &&
                          companiesList.map((companyName) => {
                            return (
                              <option
                                value={companyName.nome_compagnia}
                                className="capitalize"
                                key={companyName.id}
                              >
                                {companyName.nome_compagnia}
                              </option>
                            );
                          })}
                      </Select>
                      <FormErrorMessage>
                        {formikProps.errors.nome_compagnia}
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl>
                      <FormLabel htmlFor="accettato" fontWeight="bold">
                        Accettato
                      </FormLabel>
                      <Select
                        name="esito_intervento"
                        onChange={formikProps.handleChange}
                        value={formikProps.values.esito_intervento}
                      >
                        <option value="">Tutti</option>
                        <option value="si">Si</option>
                        <option value="no">No</option>
                      </Select>
                    </FormControl>
                  </div>
                  <div className="flex justify-center gap-1 mt-5">
                    <CustomButton
                      type="submit"
                      buttonColor="blue"
                      buttonText="Applica filtri"
                      isDisabled={!formikProps.isValid}
                    />
                    <CustomButton
                      onClick={() => resetAllFilters(formikProps.resetForm)}
                      type="button"
                      buttonColor="red"
                      isDisabled={false}
                      buttonText="Resetta i filtri"
                    />
                  </div>
                </Form>
              )}
            </Formik>
            <TotalsBox />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default AssistancesFilters;
