"use client";
import { ColorModeScript } from "@chakra-ui/react";
import Providers from "../components/Providers/Providers";
import theme from "../utils/theme";
import NavBar from "../components/NavBar/NavBar";

import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <Providers>
          <NavBar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
