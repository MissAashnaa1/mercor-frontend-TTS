import { useState } from "react";
import {
  Flex,
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  InputLeftElement,
  chakra,
  Box,
  Link,
  Avatar,
  FormControl,
  FormHelperText,
  InputRightElement,
} from "@chakra-ui/react";
import { FaUserAlt, FaLock } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

import { useNavigate } from "react-router-dom";

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleShowClick = () => setShowPassword(!showPassword);

  const navigate = useNavigate();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log("You clicked submit.");
    console.log(name);
    if (name.trim() === "") {
      toast.error("Please enter your name");
      return;
    } else {
      setSubmitting(true);
      try {
        let res = await axios.post("http://localhost:5000/api/user/create", {
          username: name,
        });
        console.log(res.data);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        toast.success("User created successfully");
        setTimeout(() => {
          navigate("/attempt-test");
        }, 1000);
        setSubmitting(false);
      } catch (error) {
        console.log(error);
        toast.error("Username aleardy exists! Please try another name");
        setSubmitting(false);
      }
    }
  };

  return (
    <Flex
      flexDirection="column"
      width="100wh"
      height="100vh"
      backgroundColor="gray.200"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        flexDir="column"
        mb="2"
        justifyContent="center"
        alignItems="center"
      >
        <Avatar bg="teal.500" />
        <Heading color="teal.400">Welcome</Heading>
        <Box minW={{ base: "90%", md: "468px" }}>
          <form onSubmit={handleFormSubmit}>
            <Stack
              spacing={4}
              p="1rem"
              backgroundColor="whiteAlpha.900"
              boxShadow="md"
            >
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<CFaUserAlt color="gray.300" />}
                  />
                  <Input
                    type="text"
                    placeholder="Enter your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </InputGroup>
              </FormControl>

              <Button
                isLoading={submitting}
                loadingText="Please Wait"
                borderRadius={0}
                type="submit"
                variant="solid"
                colorScheme="teal"
                width="full"
              >
                Next
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
      <Toaster />
    </Flex>
  );
};

export default Login;
