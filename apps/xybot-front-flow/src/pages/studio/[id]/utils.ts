import { deepClone } from "@/utils";

interface FlowMeta {
  nodes: WorkflowNode[];
  version?: "1.0";
}

function traverse(
  opts: {
    obj: Record<string, any>;
    cb: (
      obj: Record<string, any>,
      key: string,
      value: any,
      path: string[]
    ) => void;
  },
  path: string[] = []
): Record<string, any> {
  const { obj, cb } = opts;
  Object.entries(obj).forEach(([key, value]) => {
    if (typeof value === "object" && value !== null) {
      // 如果是对象，递归处理
      traverse(
        {
          obj: value,
          cb,
        },
        [...path, key]
      );
    } else {
      // 基本类型，直接返回
      cb(obj, key, value, [...path, key]);
    }
  });
  return obj;
}

//更新
export function UpgradeFlowMeta(meta: FlowMeta) {
  const newMeta = deepClone(meta);
  const { nodes, version } = newMeta;
  // 旧版本，升级成v1
  if (!version) {
    meta.version = "1.0";
    meta.nodes = nodes.map((node) => {
      const { inputs, viewHash } = node;
      if (inputs) {
        const obj = Object.keys(inputs).reduce(
          (accu, key) => {
            const current = inputs[key];
            accu[key] = current.value;
            return accu;
          },
          {} as Record<string, any>
        );
        node.inputs = traverse({
          obj,
          cb: (obj, key, value, path) => {
            const pathStr = path.join(".");
            const isExpression = /{{\s*([^\s}}]+)\s*}}/g.test(value);
            const o: FormItemValueType = {
              value,
              isExpression,
            };
            if (isExpression) {
              delete o.value; // 如果是表达式，则不需要 value
              o.expression = value;
            }
            if (viewHash && viewHash[pathStr]) {
              // 如果有 viewHash，使用 viewHash 的值
              const hash = viewHash[pathStr];
              o.selectcache = Object.entries(hash).reduce(
                (acc, [value, label]) => {
                  acc.push({
                    value,
                    label,
                  });
                  return acc;
                },
                [] as any[]
              );
            }
            obj[key] = o;
          },
        });
      }
      return node;
    });
  }

  return newMeta;
}
