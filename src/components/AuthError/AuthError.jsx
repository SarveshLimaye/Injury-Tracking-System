"use client";

import { Box, Heading, Text } from "@chakra-ui/react";
import { WarningTwoIcon } from "@chakra-ui/icons";

export default function AuthError() {
  return (
    <Box textAlign="center" py={10} px={6}>
      <WarningTwoIcon boxSize={"50px"} color={"orange.300"} />
      <Heading as="h2" size="xl" mt={6} mb={2}>
        You are not authorized to view this page.
      </Heading>
      <Text color={"gray.500"}>
        Pls login to view this page. You can login by clicking on the login
        button on the top right corner.
      </Text>
    </Box>
  );
}
