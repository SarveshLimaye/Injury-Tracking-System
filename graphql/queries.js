import { gql } from "@apollo/client";

export const countUsersWithEmail = gql`
  query countUsersWithEmail($email: String!) {
    countUsersWithEmail(email: $email)
  }
`;
