import React from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import { DELETE_REPORT } from "../../../../graphql/mutation";

export default function ReportCard({
  content,
  createdAt,
  index,
  bodyPart,
  reportId,
}) {
  let s = new Date(+createdAt);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [deleteReport] = useMutation(DELETE_REPORT);
  const toast = useToast();
  const router = useRouter();

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      deleteReport({
        variables: { id: reportId },
      });
      toast({
        title: "Report deleted.",
        description:
          "We've deleted your report. Refresh the page to see updated list",
        status: "success",
        duration: 4000,
        isClosable: true,
      });

      onClose();
    }
  };

  return (
    <Box bg="dark" borderRadius="lg" boxShadow="md" p={4} borderWidth="1px">
      <Flex justify="space-between" align="center">
        <Heading size="md">Report {index + 1}</Heading>
        <Flex>
          <Button size="sm" colorScheme="blue" mr={2}>
            Edit
          </Button>
          <Button size="sm" colorScheme="red" onClick={handleDelete}>
            Delete
          </Button>
          <Button size="sm" colorScheme="teal" ml={2} onClick={onOpen}>
            View
          </Button>
        </Flex>
      </Flex>
      <Text mt={2}>
        <strong>Body Part:</strong> {bodyPart}
      </Text>
      <Text mt={2}>
        <strong>Content:</strong> {content.substring(0, 50)}...
      </Text>
      <Text mt={2}>
        <strong>Day and Date:</strong> {s.toDateString()}
      </Text>
      <Text mt={2}>
        <strong>Time:</strong> {s.toLocaleTimeString()}
      </Text>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Full Report</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{content}</ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
