import { CompletionContext, CompletionResult } from "@codemirror/autocomplete";

const regexes = {
  generalRef: /\$[^$'"]+\.(.*)/, // $input. or $json. or similar ones
  selectorRef: /\$\(['"][\S\s]+['"]\)\.(.*)/, // $('nodeName').

  numberLiteral: /\((\d+)\.?(\d*)\)\.(.*)/, // (123). or (123.4).
  singleQuoteStringLiteral: /('.*')\.([^'{\s])*/, // 'abc'.
  booleanLiteral: /(true|false)\.([^'{\s])*/, // true.
  doubleQuoteStringLiteral: /(".*")\.([^"{\s])*/, // "abc".
  dateLiteral: /\(?new Date\(\(?.*?\)\)?\.(.*)/, // new Date(). or (new Date()).
  arrayLiteral: /\(?(\[.*\])\)?\.(.*)/, // [1, 2, 3].
  indexedAccess: /([^"{\s]+\[.+\])\.(.*)/, // 'abc'[0]. or 'abc'.split('')[0] or similar ones
  objectLiteral: /\(\{.*\}\)\.(.*)/, // ({}).

  mathGlobal: /Math\.(.*)/, // Math.
  datetimeGlobal: /DateTime\.(.*)/, // DateTime.
  objectGlobal: /Object\.(.*)/, // Object. or Object.method(arg).
};

const DATATYPE_REGEX = new RegExp(
  Object.values(regexes)
    .map((regex) => regex.source)
    .join("|")
);

export function datatypeCompletions(
  context: CompletionContext
): CompletionResult | null {
  const word = context.matchBefore(DATATYPE_REGEX);

  console.log("word", word);

  return null;
}
