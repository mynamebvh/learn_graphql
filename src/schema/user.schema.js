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
  users: [User!] @auth(role: USER)
}

type Mutation {
  login(username: String!, password: String!): Token!,
  signup(
    fullName: String!
    username: String!
    email: String!
    password: String!
  ) : User!
}
`;

export default userSchema;
