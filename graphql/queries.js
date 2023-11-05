import { gql } from "@apollo/client";

export const countUsersWithEmail = gql`
  query countUsersWithEmail($email: String!) {
    countUsersWithEmail(email: $email)
  }
`;

export const userMailtoId = gql`
  query userMailtoId($email: String!) {
    userMailtoId(email: $email)
  }
`;
