import React from "react";
import { Spinner, AbsoluteCenter, Box } from "@chakra-ui/react";

export default function Loading() {
  return (
    <Box position="relative" h="100px" mt={5}>
      <AbsoluteCenter axis="both">
        <Spinner size="xl" />
      </AbsoluteCenter>
    </Box>
  );
}
