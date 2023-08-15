const userSchema = `#graphql
scalar DateTime
scalar UUID

type User {
  id: UUID
  fullName: String!
  password: String!
  username: String!
  email: String!
  role: String! 
  createdAt: DateTime
  updatedAt: DateTime
}

type Query {
  users: [User!] @auth
}

type Mutation {
  signup(
    fullName: String!
    username: String!
    email: String!
    password: String!
    role: String!
  ) : User!
}
`;

export default userSchema;
