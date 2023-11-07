"use client";
import { useEffect } from "react";
import { Link } from "@chakra-ui/next-js";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useMutation, useQuery } from "@apollo/client";
import { ADD_USER } from "../../graphql/mutation";
import { countUsersWithEmail } from "../../graphql/queries";

import NavBar from "../components/NavBar/NavBar";

export default function Home() {
  const { user, isLoading } = useUser();

  const { data, loading, error } = useQuery(countUsersWithEmail, {
    variables: {
      email: user?.email,
    },
    skip: !user, // Skip the query if the user is not authenticated
  });

  const [addUserMutation, { error: addUserError }] = useMutation(ADD_USER);

  useEffect(() => {
    if (user) {
      // Check if the user exists in the database based on the email
      if (data && data.countUsersWithEmail === 0) {
        console.log("User does not exist in database");
        // If the user doesn't exist, add them to the database
        addUserMutation({
          variables: {
            name: user.name,
            email: user.email,
          },
        });
      }
    }
  }, [user, data, addUserMutation]);

  return (
    <>
      <h3> Home Page </h3>
    </>
  );
}
