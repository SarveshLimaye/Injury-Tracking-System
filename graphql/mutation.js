"use client";
import { gql } from "@apollo/client";

export const ADD_USER = gql`
  mutation AddUser($name: String!, $email: String!) {
    addUser(name: $name, email: $email) {
      id
      name
      email
      createdAt
    }
  }
`;

export const ADD_REPORT = gql`
  mutation AddReport($content: String!, $bodyPart: String!, $userId: ID!) {
    addReport(content: $content, bodyPart: $bodyPart, userId: $userId) {
      id
      content
      bodyPart
      createdAt
      userId
    }
  }
`;
