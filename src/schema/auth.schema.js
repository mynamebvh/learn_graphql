const authSchema = `#graphql
directive @auth on OBJECT | FIELD_DEFINITION
enum Role {
  ADMIN
  USER
}
`;

export default authSchema;
