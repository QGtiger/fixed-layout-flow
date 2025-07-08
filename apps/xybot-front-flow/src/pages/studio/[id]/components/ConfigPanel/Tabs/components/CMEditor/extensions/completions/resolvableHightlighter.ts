import { syntaxTree } from "@codemirror/language";
import {
  Decoration,
  EditorView,
  RangeSet,
  StateEffect,
  StateField,
  ViewPlugin,
  ViewUpdate,
} from "@uiw/react-codemirror";

// ================ 1. 定义装饰器 ================
const greenHighlight = Decoration.mark({
  class: "cm-resolvable-valid",
  attributes: { title: "Valid expression" },
});

const redHighlight = Decoration.mark({
  class: "cm-resolvable-error",
  attributes: { title: "Expression error" },
});

const grayHighlight = Decoration.mark({
  class: "cm-resolvable-editing",
  attributes: { title: "Editing in progress" },
});

// ================ 2. 状态效果定义 ================
// 定义更新装饰器的效果
const updateHighlightEffect = StateEffect.define<{
  from: number;
  to: number;
  type: "valid" | "error" | "editing";
}>();

// ================ 3. 状态字段管理 ================
const highlightField = StateField.define<RangeSet<Decoration>>({
  create() {
    return RangeSet.empty;
  },
  update(highlights, tr) {
    // 应用文档变更
    highlights = highlights.map(tr.changes);

    // 处理装饰器更新效果
    for (const effect of tr.effects) {
      if (effect.is(updateHighlightEffect)) {
        const { from, to, type } = effect.value;
        const mark =
          type === "valid"
            ? greenHighlight
            : type === "error"
              ? redHighlight
              : grayHighlight;

        highlights = highlights.update({
          add: [mark.range(from, to)],
          filter: (fromA, toA) => !(fromA >= from && toA <= to),
        });
      }
    }

    return highlights;
  },
  provide: (f) => EditorView.decorations.from(f),
});

// ================ 4. 视图插件实现 ================
const resolvableHighlightPlugin = ViewPlugin.fromClass(
  class {
    private activeResolvable: { from: number; to: number } | null = null;
    private updateTimeout: number | null = null;

    constructor(public view: EditorView) {
      this.updateDecorations();
    }

    update(update: ViewUpdate) {
      // 检测光标是否在 Resolvable 区域内
      const cursorPos = update.state.selection.main.head;
      this.activeResolvable = null;

      syntaxTree(update.state).iterate({
        enter: (node) => {
          if (
            node.name === "Resolvable" &&
            node.from <= cursorPos &&
            node.to >= cursorPos
          ) {
            this.activeResolvable = { from: node.from, to: node.to };
          }
        },
      });

      // 防抖更新（300ms 后更新）
      if (this.updateTimeout) clearTimeout(this.updateTimeout);
      this.updateTimeout = setTimeout(() => {
        this.updateDecorations();
      }, 300) as unknown as number;
    }

    dispathTimeout: number | null = null;
    dispatchEffects(effects: any) {
      // 防抖更新（300ms 后更新）
      if (this.dispathTimeout) clearTimeout(this.dispathTimeout);
      this.dispathTimeout = setTimeout(() => {
        this.view.dispatch({ effects });
      }, 0) as unknown as number;
    }

    private updateDecorations() {
      const effects: StateEffect<unknown>[] = [];
      const state = this.view.state;

      // 遍历所有 Resolvable 节点
      syntaxTree(state).iterate({
        enter: (node) => {
          if (node.name === "Resolvable") {
            const { from, to } = node;
            const content = state.sliceDoc(from, to);

            // 确定装饰类型
            let type: "valid" | "error" | "editing" = "valid";

            // 检查是否正在编辑
            if (
              this.activeResolvable &&
              this.activeResolvable.from === from &&
              this.activeResolvable.to === to
            ) {
              type = "editing";
            }
            // 检查语法错误
            else {
              try {
                // 尝试解析 JavaScript
                new Function(content.substring(2, content.length - 2));
              } catch (e) {
                type = "error";
              }
            }

            // 添加装饰效果
            effects.push(updateHighlightEffect.of({ from, to, type }));
          }
        },
      });

      // 应用所有效果
      if (effects.length > 0) {
        this.dispatchEffects(effects);
      }
    }

    destroy() {
      if (this.updateTimeout) clearTimeout(this.updateTimeout);
    }
  }
);

export const resolvableHighlightExtension = [
  highlightField,
  resolvableHighlightPlugin,
];
