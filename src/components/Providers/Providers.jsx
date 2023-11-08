"use client";

import { CacheProvider } from "@chakra-ui/next-js";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { UserProvider } from "@auth0/nextjs-auth0/client";

const client = new ApolloClient({
  uri: "https://injury-tracking-system-gamma.vercel.app/api/graphql",
  cache: new InMemoryCache(),
});

const colors = {
  brand: {
    50: "#ecefff",
    100: "#cbceeb",
    200: "#a9aed6",
    300: "#888ec5",
    400: "#666db3",
    500: "#4d5499",
    600: "#3c4178",
    700: "#2a2f57",
    800: "#181c37",
    900: "#080819",
  },
};
const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const theme = extendTheme({ colors, config });

export default function Providers({ children }) {
  return (
    <ApolloProvider client={client}>
      <CacheProvider>
        <ChakraProvider>
          <UserProvider>{children} </UserProvider>
        </ChakraProvider>
      </CacheProvider>
    </ApolloProvider>
  );
}
