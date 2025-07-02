import {
  Command,
  EditorState,
  EditorView,
  Extension,
  keymap,
  showTooltip,
  StateEffect,
  StateField,
  Tooltip,
} from "@uiw/react-codemirror";

// tooltips demo
function getCursorTooltips(state: EditorState): readonly Tooltip[] {
  return state.selection.ranges
    .filter((range) => range.empty)
    .map((range) => {
      let line = state.doc.lineAt(range.head);
      let text = line.number + ":" + (range.head - line.from);
      return {
        pos: range.head,
        above: true,
        strictSide: true,
        arrow: true,
        create: () => {
          let dom = document.createElement("div");
          dom.className = "cm-tooltip-cursor";
          dom.textContent = text;
          return { dom };
        },
      };
    });
}

const cursorTooltipField = StateField.define<readonly Tooltip[]>({
  create: getCursorTooltips,

  update(tooltips, tr) {
    if (!tr.docChanged && !tr.selection) return tooltips;
    return getCursorTooltips(tr.state);
  },

  provide: (f) => showTooltip.computeN([f], (state) => state.field(f)),
});

const cursorTooltipBaseTheme = EditorView.baseTheme({
  ".cm-tooltip.cm-tooltip-cursor": {
    backgroundColor: "#66b",
    color: "white",
    border: "none",
    padding: "2px 7px",
    borderRadius: "4px",
    "& .cm-tooltip-arrow:before": {
      borderTopColor: "#66b",
    },
    "& .cm-tooltip-arrow:after": {
      borderTopColor: "transparent",
    },
  },
});

const closeInfoBoxEffect = StateEffect.define<null>();

export const closeCursorInfoBox: Command = (view) => {
  const state = view.state.field(cursorTooltipField, false);
  if (!state?.tooltip) return false;

  view.dispatch({ effects: closeInfoBoxEffect.of(null) });
  return true;
};

export const infoBoxTooltips = (): Extension[] => {
  return [
    cursorTooltipField,
    cursorTooltipBaseTheme,

    // cursorInfoBoxTooltip,
    // hoverInfoBoxTooltip,
    keymap.of([
      {
        key: "Escape",
        run: closeCursorInfoBox,
      },
    ]),
  ];
};
