import { Button, useToast } from "@chakra-ui/react";
import { Form, Formik, FormikProps } from "formik";
import CustomInput from "./CustomInput";
import { useNavigate } from "react-router-dom";
import {
  browserSessionPersistence,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";
import { loginFormvalidationSchema } from "../validationSchema/loginFormValidationSchema";

interface LoginFormValues {
  email: string;
  password: string;
}

const LoginForm = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const initialLoginValues = {
    email: "",
    password: "",
  };

  const handleLogin = (loginValues: LoginFormValues) => {
    const { email, password } = loginValues;
    setPersistence(auth, browserSessionPersistence)
      .then(() => {
        return signInWithEmailAndPassword(auth, email, password);
      })
      .then(() => {
        navigate("/home");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        toast({
          title: errorMessage,
          status: "error",
        });
        console.log(errorCode);
      });
  };

  return (
    <div className="w-[500px] p-10 shadow-2xl rounded-xl">
      <h2 className="text-center pb-5 font-bold text-2xl">Effettua la Login</h2>
      <Formik
        initialValues={initialLoginValues}
        validationSchema={loginFormvalidationSchema}
        onSubmit={(valuesForm) => handleLogin(valuesForm)}
      >
        {(props: FormikProps<LoginFormValues>) => (
          <Form className="flex flex-col gap-5">
            <CustomInput type="email" name="email" placeholder="La tua mail" />
            <CustomInput
              type="password"
              name="password"
              placeholder="La tua password"
            />
            <Button colorScheme="blue" type="submit" disabled={!props.isValid}>
              Invia
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LoginForm;
