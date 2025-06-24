import type {
  CompletionsQuery,
  CompletionsQueryResult,
  File,
  TypeQuery,
  TypeQueryResult,
} from "tern";
import { Server } from "tern";

import type { Completion, CompletionContext } from "@codemirror/autocomplete";

import ecmascript from "./defs/ecmascript.json";
// import { createApiInfoDom } from '@/components/CmEditor/CmInput/extensions/dom';
import { TypeDefinitions } from "../constant";

function formatTernCompletionsType(
  type?: string,
  name?: string
): TypeDefinitions {
  if (name && ["uuid", "moment"].includes(name)) return TypeDefinitions.CONST;
  if (!type) return TypeDefinitions.UNKNOWN;
  else if (type === "number") return TypeDefinitions.NUMBER;
  else if (type === "string") return TypeDefinitions.STRING;
  else if (type === "bool") return TypeDefinitions.BOOLEAN;
  else if (type === "array") return TypeDefinitions.ARRAY;
  else if (/^\[/.test(type)) return TypeDefinitions.ARRAY;
  else if (type.includes("fn")) return TypeDefinitions.FUNCTION;
  else return TypeDefinitions.UNKNOWN;
}

class TernServer {
  static instance: TernServer;
  server: Server;

  constructor() {
    // @ts-expect-error good tern
    this.server = new Server({ defs: [ecmascript], async: true });
  }

  packTernRequestQuery(end: number): CompletionsQuery {
    return {
      /**
       * Asks the server for a set of completions at the given point.
       */
      type: "completions",
      file: "#0",
      end,
      /**
       * Whether to include the types of the completions in the result data.
       */
      types: true,
      /**
       * Whether to include documentation strings, urls, and origin files (if found) in the result data.
       */
      docs: true,
      urls: true,
      origins: true,
      /**
       * Whether to use a case-insensitive compare between the current word and potential completions.
       */
      caseInsensitive: true,
      /**
       * Whether to include JavaScript keywords when completing something that is not a property.
       */
      includeKeywords: true,
      /**
       * default true
       * If completions should be returned when inside a literal.
       */
      inLiteral: true,
      /**
       * default true
       * Whether to ignore the properties of Object.prototype unless they have been spelled out by at least to characters.
       */
      omitObjectPrototype: true,
      /**
       * default true
       * When disabled, only the text before the given position is considered part of the word. When enabled (the default), the whole variable name that the cursor is on will be included.
       */
      expandWordForward: true,
      /**
       * default true
       * Determines whether the result set will be sorted.
       */
      sort: true,
      /**
       * default true
       * When completing a property and no completions are found, Tern will use some heuristics to try and return some properties anyway. Set this to false to turn that off.
       */
      guess: false,
      /**
       * default true
       * When on, only completions that match the current word at the given point will be returned. Turn this off to get all results, so that you can filter on the client side.
       */
      filter: true,
    };
  }

  packTernFnRequestQuery(end: number, start?: number): TypeQuery {
    return {
      type: "type",
      start,
      end,
      preferFunction: true,
      file: "#0",
    };
  }

  packTernRequestFiles(text: string): File[] {
    return [
      {
        name: "cmInput",
        text: text,
        type: "full",
      } as File,
    ];
  }

  getCompletionsQueryResult(
    context: CompletionContext,
    source: Record<string, any>
  ): CompletionsQueryResult | null {
    let result = null;
    // 注入当前用户使用的变量，以获取对应的提示信息和类型
    const keys = Object.keys(source);
    const text = context.state.doc.toString();
    const usedKeys = keys.filter((key) => text.includes(key));
    let scopeText = ``;
    usedKeys.forEach((key) => {
      if (typeof source[key] === "object" && source[key] !== null)
        scopeText += `const ${key} = ${JSON.stringify(source[key])};\n`;
    });
    const scopeTextLength = scopeText.length;
    const query = this.packTernRequestQuery(scopeTextLength + context.pos);
    const files = this.packTernRequestFiles(scopeText + text);
    this.server.request({ query, files }, (error, data) => {
      if (error) console.error(error);
      result = {
        ...data,
        // 排除注入内容长度，获取原始的位置信息
        start: data?.start ? (data.start as number) - scopeTextLength : 0,
        end: data?.end ? (data.end as number) - scopeTextLength : 0,
      };
    });
    return result;
  }

  getTooltipQueryResult(
    end: number,
    text: string,
    start?: number
  ): TypeQueryResult | null {
    let result = null;
    const query = this.packTernFnRequestQuery(end, start);
    const files = this.packTernRequestFiles(text);
    this.server.request({ query, files }, (error, data) => {
      if (error) console.error(error);
      result = data;
    });
    return result;
  }

  generateAutocompletion(
    context: CompletionContext,
    source: Record<string, any>
  ) {
    const result = this.getCompletionsQueryResult(context, source);
    if (!result) return { completions: [], start: context.pos };
    const completions = result.completions.map((item) => {
      if (typeof item !== "object") return {} as Completion;
      // @ts-expect-error like a tern type missing
      const { doc, name, type, url, isKeyword } = item || {};
      const displayType = isKeyword
        ? "Keyword"
        : formatTernCompletionsType(type, name);
      const completion: Completion = {
        label: name,
        detail: displayType,
      };
      if (!isKeyword && doc)
        // completion.info = () => {
        //   const dom = createApiInfoDom(name, displayType, doc, url);
        //   return { dom };
        // };

        return completion;
    });
    return {
      completions,
      start: result.start,
    };
  }

  static getInstance() {
    if (!TernServer.instance) {
      TernServer.instance = new TernServer();
    }
    return TernServer.instance;
  }
}

export const TernServerInstance = TernServer.getInstance();
