import { IPaasDynamicFormItem, IPaasFormSchema } from "@/type";
import { isVisibleFunc } from ".";

export function createFormItem(itemConfig: IPaasDynamicFormItem) {
  const { type, payload, next, parent } = itemConfig;

  const nextFunc: IPaasDynamicFormItem["next"] = (current, acient) => {
    let nextItem = next(current, acient);
    if (!nextItem) return null;

    nextItem.parent = current;
    return nextItem;
  };

  return {
    type,
    payload,
    next: nextFunc,
    parent,
  };
}

export function findCusrorItem(
  schema: IPaasFormSchema[],
  formValue: object,
  index: number
): IPaasDynamicFormItem | null {
  if (!schema || index >= schema.length) return null;

  const item = schema[index];
  if (item.visible === false)
    return findCusrorItem(schema, formValue, index + 1);
  // 有校验规则并且不通过 就接着往下找
  if (item.visibleRules && !isVisibleFunc(item.visibleRules, formValue)) {
    return findCusrorItem(schema, formValue, index + 1);
  } else {
    return createFormItem({
      type: item.editor.kind,
      payload: item,
      next: (current, acient) => {
        return findCusrorItem(schema, formValue, index + 1);
      },
      parent: null,
    });
  }
}
