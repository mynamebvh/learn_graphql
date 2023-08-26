const authSchema = `#graphql
directive @auth(role: Role = USER) on OBJECT | FIELD_DEFINITION
enum Role {
  ADMIN
  USER
}
`;

export default authSchema;
