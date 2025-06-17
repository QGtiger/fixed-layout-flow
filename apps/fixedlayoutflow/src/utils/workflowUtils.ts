const ArrayIndexKey = "array[index]";
const ArrayIndexLabel = "数组索引";

export function getType(
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

function getDefaultValueByType(type: string): any {
  switch (type) {
    case "number":
      return 0;
    case "string":
      return "mock string";
    case "boolean":
      return false;
    default:
      throw new Error(`Unsupported type: ${type}`);
  }
}

export function generateSampleDataByOutputStruct(
  struct: OutputStructItem[]
): Record<string, any> {
  const sample: Record<string, any> = {};

  function process(currStruct: OutputStructItem[], currSample: any) {
    for (const item of currStruct) {
      if (item.type === "array") {
        // 如果是数组，生成一个空数组
        // 这里可以根据实际情况生成一个默认的数组
        const arrayItem = item.children?.[0];
        if (arrayItem) {
          // 如果数组有子结构，递归处理
          currSample[item.name] = [
            ...Object.values(generateSampleDataByOutputStruct([arrayItem])),
          ];
        } else {
          // 如果没有子结构，生成一个空数组
          currSample[item.name] = [];
        }
      } else if (item.type === "object") {
        // 如果有子结构，递归处理
        currSample[item.name] = {};
        process(item.children || [], currSample[item.name]);
      } else {
        // 否则生成一个默认值
        currSample[item.name] = getDefaultValueByType(item.type);
      }
    }
  }

  process(struct, sample);

  return sample;
}
