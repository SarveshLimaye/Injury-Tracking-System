import React, { useState } from "react";
import { getBodyPart } from "../BodyMap/bodyParts";
import { useMutation } from "@apollo/client";
import { UPDATE_REPORT } from "../../../../graphql/mutation";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Select,
  useToast,
  ModalCloseButton,
  Button,
  Textarea,
} from "@chakra-ui/react";

function EditModal({ isOpen, onClose, initialContent, reportId, bodyPart }) {
  console.log(bodyPart);
  const [editedContent, setEditedContent] = useState(initialContent);
  const [selectedPart, setSelectedPart] = useState("");
  const toast = useToast();

  const antParts = getBodyPart("en").filter(({ face }) => face === "ant");

  const postParts = getBodyPart("en").filter(({ face }) => face === "post");

  const allParts = [...antParts, ...postParts];

  const [updateReport] = useMutation(UPDATE_REPORT);

  const handleSave = () => {
    if (selectedPart === "") {
      window.alert("Please select a body part");
    }

    updateReport({
      variables: {
        id: reportId,
        bodyPart: selectedPart,
        content: editedContent,
      },
    });
    toast({
      title: "Report updated.",
      description: "Report has been updated. Refresh the page to see changes",
      status: "success",
      duration: 4000,
      isClosable: true,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Report</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <label>Body Part</label>
          <Select
            my={3}
            onChange={(e) => {
              setSelectedPart(e.target.value);
            }}
          >
            {allParts.map((part) => (
              <option selected={bodyPart} value={part.name}>
                {part.name}
              </option>
            ))}
          </Select>
          <label>Content</label>
          <Textarea
            value={editedContent}
            my={2}
            onChange={(e) => setEditedContent(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="teal" m={2} onClick={handleSave}>
            Save
          </Button>
          <Button colorScheme="red" m={2} onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default EditModal;
