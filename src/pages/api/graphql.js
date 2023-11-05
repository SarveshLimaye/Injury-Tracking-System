import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { prisma } from "../../../prisma/db";

const typeDefs = `#graphql

  type User{
    id: ID!
    name: String!
    email: String!
    createdAt: String!
    reports : [Report]
  }

  type Report{
    id : ID!
    content : String!
    bodyPart : String!
    createdAt : String!
    user : User
    userId : ID!
  }

  type Query {
    user (id : ID!) : User
    users : [User]
    countUsersWithEmail(email: String!): Int
    userMailtoId(email: String!): ID
  } 

  type Mutation {
    addUser (name : String!, email : String!) : User
    addReport (content : String!, bodyPart : String!, userId : ID!) : Report
    updateReport (id : ID!, content : String!, bodyPart : String!) : Report
    deleteReport (id : ID!) : Report
  }
`;

const resolvers = {
  Query: {
    users: async (parent, args, context) => {
      return await context.prisma.user.findMany();
    },
    user: async (parent, args, context) => {
      return await context.prisma.user.findUnique({
        where: {
          id: args.id,
        },
      });
    },
    countUsersWithEmail: async (parent, args, context) => {
      const count = await context.prisma.user.count({
        where: {
          email: args.email,
        },
      });
      return count;
    },
    userMailtoId: async (parent, args, context) => {
      const user = await context.prisma.user.findUnique({
        where: {
          email: args.email,
        },
      });
      return user.id;
    },
  },
  User: {
    reports: async (parent, args, context) => {
      return await context.prisma.report.findMany({
        where: {
          userId: parent.id,
        },
      });
    },
  },

  Mutation: {
    addUser: async (parent, args, context) => {
      return await context.prisma.user.create({
        data: {
          name: args.name,
          email: args.email,
        },
      });
    },
    addReport: async (parent, args, context) => {
      return await context.prisma.report.create({
        data: {
          content: args.content,
          bodyPart: args.bodyPart,
          userId: args.userId,
        },
      });
    },
    updateReport: async (parent, args, context) => {
      return await context.prisma.report.update({
        where: {
          id: args.id,
        },
        data: {
          content: args.content,
          bodyPart: args.bodyPart,
        },
      });
    },
    deleteReport: async (parent, args, context) => {
      return await context.prisma.report.delete({
        where: {
          id: args.id,
        },
      });
    },
  },
};

const server = new ApolloServer({
  resolvers,
  typeDefs,
});

export default startServerAndCreateNextHandler(server, {
  context: async (req, res) => ({ req, res, prisma }),
});
