import { Button } from "@chakra-ui/react";

interface CustomButtonProps {
  buttonText: string;
  buttonColor: string;
  onClick?: () => void;
  isDisabled: boolean;
  type: "button" | "submit" | "reset" | undefined;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  buttonText,
  buttonColor,
  type,
}) => {
  return (
    <Button type={type} colorScheme={buttonColor}>
      {buttonText}
    </Button>
  );
};

export default CustomButton;
