import {
  FormControl,
  Input,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/react";
import { useField } from "formik";
import React from "react";

interface CustomInputProps {
  placeholder: string;
  type: React.HTMLInputTypeAttribute;
  name: string;
  formLabel: string;
}

const CustomInput: React.FC<CustomInputProps> = ({
  name,
  placeholder,
  formLabel,
  ...props
}) => {
  const [field, meta] = useField(name);

  return (
    <FormControl isInvalid={Boolean(meta.error && meta.touched)}>
      <FormLabel fontWeight={"bold"}>{formLabel}</FormLabel>
      <Input {...field} {...props} name={name} placeholder={placeholder} />
      <FormErrorMessage>{meta.error}</FormErrorMessage>
    </FormControl>
  );
};

export default CustomInput;
