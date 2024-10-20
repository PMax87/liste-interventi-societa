import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Select,
  FormErrorMessage,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import CustomInput from "./CustomInput";
import { useData } from "../context/DataContext";

interface CalculateAssistanceCostProps {
  isOpen: boolean;
  onClose: () => void;
}

const CalculateAssistanceCost: React.FC<CalculateAssistanceCostProps> = ({
  isOpen,
  onClose,
}) => {
  const { companiesList } = useData();

  const calculateCostFormInitialValues = {
    nome_compagnia: "",
    km_totali: "",
    peso_veicolo: "",
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Calcola importo Intervento</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Formik initialValues={calculateCostFormInitialValues}>
            {(formikProps) => (
              <Form>
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
                <CustomInput
                  name="km_totali"
                  placeholder="Km totali"
                  formLabel="Km Totali"
                  type="text"
                />
              </Form>
            )}
          </Formik>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button variant="ghost">Secondary Action</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CalculateAssistanceCost;
