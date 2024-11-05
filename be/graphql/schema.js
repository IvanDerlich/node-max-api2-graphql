const { buildSchema } = require("graphql");

const oldQuery = `
  type TestData {
    text: String!
    views: Int!
  }


  type RootQuery{
    hello: TestData!
  }

  schema {
    query: RootQuery
  }
`;

module.exports = buildSchema(`
  type Post {
    _id: ID!
    title: String!
    content: String!
    imageUrl: String!
    creator: User!
    createdAt: String!
    updatedAt: String!
  }

  type User {
    _id: ID!
    email: String!
    name: String!
    password: String
    status: String
    posts: [Post!]!
  }

  input UserInputData {
    email: String!
    name: String!
    password: String!
  }

  type AuthData {
    userId: ID!
    token: String!
    tokenExpiration: String!
  }

  input PostInputData {
    title: String!
    content: String!
    imageUrl: String!
  }

  type RootMutation {
    createUser(userInput: UserInputData): User!
    createPost(postInput: PostInputData): Post!
  }

  type RootQuery {
    login(email: String!, password: String!): AuthData!
  }

  schema {
    mutation: RootMutation
    query: RootQuery
  }
`);
