"use client";

import { CacheProvider } from "@chakra-ui/next-js";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { UserProvider } from "@auth0/nextjs-auth0/client";

const client = new ApolloClient({
  uri: "http://localhost:3000/api/graphql",
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
          <UserProvider loginUrl="api/auth/login" profileUrl="api/auth/me">
            {children}{" "}
          </UserProvider>
        </ChakraProvider>
      </CacheProvider>
    </ApolloProvider>
  );
}
