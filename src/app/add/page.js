"use client";
import React from "react";
import BodyMap from "../../components/BodyMap/BodyMap";
import { useUser } from "@auth0/nextjs-auth0/client";
import AuthError from "../../components/AuthError/AuthError";

export default function AddReport() {
  const { user } = useUser();
  return (
    <div>
      {user === undefined ? (
        <AuthError />
      ) : (
        <div>
          <BodyMap />
        </div>
      )}
    </div>
  );
}
