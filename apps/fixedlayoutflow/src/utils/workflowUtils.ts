const ArrayIndexKey = "array[index]";
const ArrayIndexLabel = "数组索引";

function getType(
  value: any
): "number" | "string" | "boolean" | "object" | "array" {
  if (Array.isArray(value)) {
    return "array";
  }
  return typeof value as any;
}

function generateStructBySample(sample: any): OutputStructItem[] | undefined {
  if (typeof sample !== "object" || !sample) return;

  if (Array.isArray(sample)) {
    // 如果是数组，处理数组的第一个元素
    if (sample.length > 0) {
      const firstItem = sample[0];
      const itemType = getType(firstItem);
      return [
        {
          name: ArrayIndexKey,
          type: itemType,
          label: ArrayIndexLabel,
          children: generateStructBySample(firstItem),
        },
      ];
    } else {
      // 空数组情况
      return [];
    }
  }

  const struct: OutputStructItem[] = [];

  for (const key in sample) {
    const value = sample[key];
    const type = getType(value);

    struct.push({
      name: key,
      type,
      label: key,
      children: generateStructBySample(value),
    });
  }

  return struct;
}

/**
 * 根据样本数据补全输出结构
 * @param outputStruct 数据结构
 * @param sample 样本数据
 */
export function completeOutputStruct(
  struct: OutputStructItem[],
  sample: Record<string, any>
): OutputStructItem[] {
  const cloneSample = JSON.parse(JSON.stringify(sample));
  const cloneStruct = JSON.parse(JSON.stringify(struct));

  function process(currStruct: OutputStructItem[], currSample: any) {
    if (typeof currSample !== "object" || !currSample) return;

    for (const key in currSample) {
      const value = currSample[key];
      const item = currStruct.find((s) => s.name === key);

      if (item) {
        // 存在的话 就纠正下
        const type = getType(value);
        const index = currStruct.indexOf(item);

        currStruct[index] = {
          ...item,
          type: type,
          children: generateStructBySample(value),
        };
      } else {
        // 如果没有找到对应的结构，添加一个新的项
        const type = getType(value);

        currStruct.push({
          name: key,
          type,
          label: key,
          children: generateStructBySample(value),
        });
      }
    }
  }

  process(cloneStruct, cloneSample);

  return cloneStruct;
}
