const authSchema = `#graphql
directive @auth(role: Role = USER) on OBJECT | FIELD_DEFINITION
enum Role {
  ADMIN
  USER
}

type Token {
  accessToken: String!
} 
`;

export default authSchema;
