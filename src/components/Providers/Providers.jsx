"use client";

import { CacheProvider } from "@chakra-ui/next-js";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { SessionProvider } from "next-auth/react";

const client = new ApolloClient({
  uri: "https://earnest-paletas-cd3b94.netlify.app/api/graphql",
  cache: new InMemoryCache(),
});

const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const theme = extendTheme({ config });

export default function Providers({ children }) {
  return (
    <ApolloProvider client={client}>
      <CacheProvider>
        <ChakraProvider>
          <SessionProvider>{children} </SessionProvider>
        </ChakraProvider>
      </CacheProvider>
    </ApolloProvider>
  );
}
