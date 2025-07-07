import { ifIn } from "@codemirror/autocomplete";
import { nonDollarCompletions } from "./nonDollar.completions";
import { datatypeCompletions } from "./datatype.completions";

export function completionSources() {
  return [datatypeCompletions, nonDollarCompletions].map((source) => ({
    autocomplete: ifIn(["Resolvable"], source),
  }));
}
