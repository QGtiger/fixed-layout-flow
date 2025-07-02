type DocMetadataArgument = {
  name: string;
  type?: string;
  optional?: boolean;
  variadic?: boolean;
  description?: string;
  default?: string;
  // Function arguments have nested arguments
  args?: DocMetadataArgument[];
};

type DocMetadataExample = {
  example: string;
  evaluated?: string;
  description?: string;
};

type DocMetadata = {
  name: string;
  returnType: string;
  description?: string;
  section?: string;
  hidden?: boolean;
  aliases?: string[];
  args?: DocMetadataArgument[];
  examples?: DocMetadataExample[];
  docURL?: string;
};
