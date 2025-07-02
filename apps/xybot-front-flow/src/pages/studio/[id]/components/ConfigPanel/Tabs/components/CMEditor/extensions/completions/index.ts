import { ifIn } from "@codemirror/autocomplete";
import { nonDollarCompletions } from "./nonDollar.completions";

export function completionSources() {
  return [nonDollarCompletions].map((source) => ({
    autocomplete: ifIn(["Resolvable"], source),
  }));
}
