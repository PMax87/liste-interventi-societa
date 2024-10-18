import { useToast } from "@chakra-ui/react";

interface CustomToast {
  description: string;
  colorScheme: string;
  isClosable: boolean;
  status: string;
}

export const useCustomToast = () => {
  const toast = useToast();

  const showToast = ({ description, colorScheme, isClosable }: CustomToast) => {
    toast({
      description,
      colorScheme: colorScheme,
      isClosable: isClosable,
      position: "top",
    });
  };

  return showToast;
};
