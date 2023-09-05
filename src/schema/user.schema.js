const userSchema = `#graphql
scalar DateTime
scalar UUID
scalar Upload

type Image {
  id: String!
  filename: String!
}

type User {
  id: UUID
  fullName: String!
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
  ) : User!,
  uploadImage(image: Upload!): String
}

type Subscription {
  userCreated: User
}
`;

export default userSchema;
