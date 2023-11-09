"use client";
import { useEffect } from "react";
import { Link } from "@chakra-ui/next-js";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useMutation, useQuery } from "@apollo/client";
import { ADD_USER } from "../../graphql/mutation";
import { countUsersWithEmail } from "../../graphql/queries";
import Hero from "../components/Hero/Hero";
import { useSession } from "next-auth/react";
import NavBar from "../components/NavBar/NavBar";

export default function Home() {
  const { data: session } = useSession();

  const { data, loading, error } = useQuery(countUsersWithEmail, {
    variables: {
      email: session?.user?.email,
    },
    skip: !session, // Skip the query if the user is not authenticated
  });

  const [addUserMutation, { error: addUserError }] = useMutation(ADD_USER);

  useEffect(() => {
    if (session) {
      // Check if the user exists in the database based on the email
      if (data && data.countUsersWithEmail === 0) {
        console.log("User does not exist in database");
        // If the user doesn't exist, add them to the database
        addUserMutation({
          variables: {
            name: session.user.name,
            email: session.user.email,
          },
        });
      }
    }
  }, [session, data, addUserMutation]);

  return <Hero />;
}
