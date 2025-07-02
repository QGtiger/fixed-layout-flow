// /\{\{(.+?)\}\}/g
export const EXPRESSION_REGEXP = /\{\{([\s\S]+?)\}\}/g;

export enum TypeDefinitions {
  OBJECT = "Object",
  NUMBER = "Number",
  ARRAY = "Array",
  FUNCTION = "Function",
  BOOLEAN = "Boolean",
  STRING = "String",
  UNKNOWN = "Unknown",
  CONST = "Const",
  PROPERTY = "Property",
}
