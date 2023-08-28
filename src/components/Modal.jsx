import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  RadioGroup,
  Stack,
  Radio,
  Button,
  Box,
} from "@chakra-ui/react";

const SubmissionModal = ({ isOpen, onOpen, onClose, submissions }) => {
  return (
    <>
      <Modal
        size={"full"}
        onClose={onClose}
        isOpen={isOpen}
        scrollBehavior={"inside"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>My Submissions</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box
              h={"100%"}
              w={"100%"}
              display={"flex"}
              alignItems={"flex-start"}
              justifyContent={"center "}
              flexDirection={"column"}
            >
              {submissions.length === 0 ? (
                <p>No submissions yet</p>
              ) : (
                submissions.map((sub, i) => (
                  <Box
                    key={i}
                    border={"1px solid"}
                    borderRadius={"md"}
                    borderTop={0}
                    my={4}
                    w="100%"
                    p={3}
                    shadow={"md"}
                  >
                    <p>Question: {sub.question}</p>
                    <p>Answer: {sub.answer}</p>
                  </Box>
                ))
              )}
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SubmissionModal;
