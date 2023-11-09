"use client";
import React from "react";
import BodyMap from "../../components/BodyMap/BodyMap";
import { useUser } from "@auth0/nextjs-auth0/client";
import AuthError from "../../components/AuthError/AuthError";
import { useSession } from "next-auth/react";

export default function AddReport() {
  const { data: session } = useSession();

  return (
    <div>
      {!session ? (
        <AuthError />
      ) : (
        <div>
          <BodyMap />
        </div>
      )}
    </div>
  );
}
