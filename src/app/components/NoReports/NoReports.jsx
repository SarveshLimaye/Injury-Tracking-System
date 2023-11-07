"use client";

import { Box, Heading, Text } from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";

export default function NoReports() {
  return (
    <Box textAlign="center" py={10} px={6}>
      <InfoIcon boxSize={"50px"} color={"blue.500"} />
      <Heading as="h2" size="xl" mt={6} mb={2}>
        You have no reports added yet
      </Heading>
      <Text color={"gray.500"}>
        Add a report to get started with Safretrack . You can add a report by
        clicking on the Add Report button on navbar.
      </Text>
    </Box>
  );
}
