import { FormControl, FormErrorMessage, FormLabel, Select } from "@chakra-ui/react";
import { useField } from "formik";

interface CustomSelectProps<T> {
  placeholder: string;
  name: string;
  formLabel: string;
  options: T[] | undefined;
  getOptionLabel: (option: T) => string;
  getOptionValue: (option: T) => string | number;
}

const CustomSelect = <T,>({ placeholder, name, formLabel, options, getOptionLabel, getOptionValue, ...props }: CustomSelectProps<T>) => {
  const [field, meta] = useField(name);

  console.log(field.value);

  return (
    <FormControl isInvalid={Boolean(meta.error && meta.touched)}>
      <FormLabel fontWeight={"bold"}>{formLabel}</FormLabel>
      <Select placeholder={placeholder} {...field}>
        {options &&
          options.map((option) => {
            return (
              <option key={getOptionValue(option)} {...props}>
                {getOptionLabel(option)}
              </option>
            );
          })}
      </Select>
      <FormErrorMessage>{meta.error}</FormErrorMessage>
    </FormControl>
  );
};

export default CustomSelect;
