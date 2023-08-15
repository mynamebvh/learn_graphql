import { mapSchema, getDirective, MapperKind } from "@graphql-tools/utils";
import { defaultFieldResolver } from "graphql";

function authDirective(directiveName) {
  const typeDirectiveArgumentMaps = {};
  return {
    authDirectiveTransformer: (schema) =>
      mapSchema(schema, {
        [MapperKind.TYPE]: (type) => {
          const authDirective = getDirective(schema, type, directiveName)?.[0];
          if (authDirective) {
            typeDirectiveArgumentMaps[type.name] = authDirective;
          }
          return undefined;
        },
        [MapperKind.OBJECT_FIELD]: (fieldConfig, _fieldName, typeName) => {
          const authDirective =
            getDirective(schema, fieldConfig, directiveName)?.[0] ??
            typeDirectiveArgumentMaps[typeName];
          if (authDirective) {
            const { resolve = defaultFieldResolver } = fieldConfig;
            fieldConfig.resolve = function (source, args, context, info) {
              const { isAuth } = context;
              if (!isAuth) {
                throw new Error("not authorized");
              }
              return resolve(source, args, context, info);
            };
            return fieldConfig;
          }
        },
      }),
  };
}

const { authDirectiveTransformer } = authDirective("auth");

export default authDirectiveTransformer;
