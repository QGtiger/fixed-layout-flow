import React from "react";
import { CaretDownOutlined, CloudOutlined } from "@ant-design/icons";
import { Tree } from "antd";
import type { TreeDataNode, TreeProps } from "antd";
import { useSchemaStore } from "@/stores/useSchemaStore";
import { useMaterialMap } from "@/stores/useMaterialStore";

function getTreeData(
  items: FormexItem[],
  materialMap: Record<string, MaterialItem>
): TreeDataNode[] {
  return items.map((item) => {
    const { id, code, children } = item;
    const { icon, name } = materialMap[code] || {};
    const treeNode: TreeDataNode = {
      title: (
        <div className="flex gap-1.5">
          {icon}
          <span>{name}</span>
        </div>
      ),
      key: id,
    };

    if (children && children.length > 0) {
      treeNode.children = getTreeData(children, materialMap);
    }

    return treeNode;
  });
}

const MaterialTree: React.FC = () => {
  const { schema, selectedComponentId, setSelectedComponentId } =
    useSchemaStore();
  const { formItems } = schema;
  const materialMap = useMaterialMap();

  const customTreeData: TreeDataNode[] = [
    {
      title: (
        <div className="flex gap-1.5">
          <CloudOutlined />
          <span>页面</span>
        </div>
      ),
      key: "root",
      children: getTreeData(formItems, materialMap),
    },
  ];

  const onSelect: TreeProps["onSelect"] = (selectedKeys, info) => {
    const key = selectedKeys[0];
    if (!key || key === "root") return;
    setSelectedComponentId(selectedKeys[0] as string);
  };

  return (
    <Tree
      showLine
      switcherIcon={
        <div
          style={{
            transform: "translateY(-2px)",
          }}
        >
          <CaretDownOutlined />
        </div>
      }
      defaultExpandAll
      onSelect={onSelect}
      treeData={customTreeData}
      selectedKeys={[selectedComponentId]}
    />
  );
};

export default MaterialTree;
