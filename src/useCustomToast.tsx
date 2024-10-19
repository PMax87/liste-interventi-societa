import { useToast } from "@chakra-ui/react";

interface CustomToast {
  description: string;
  colorScheme: string;
  isClosable: boolean;
  status: "info" | "warning" | "success" | "error" | "loading" | undefined;
}

export const useCustomToast = () => {
  const toast = useToast();

  const showToast = ({
    description,
    colorScheme,
    isClosable,
    status,
  }: CustomToast) => {
    toast({
      description,
      colorScheme: colorScheme,
      isClosable: isClosable,
      position: "top",
      status: status,
    });
  };

  return showToast;
};
