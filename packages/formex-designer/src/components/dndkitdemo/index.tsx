import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { List } from "antd";
import { useState } from "react";

// 可拖拽项组件
const SortableItem = ({ id, value }: { id: string; value: string }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    cursor: "move",
    opacity: isDragging ? 0.5 : 1,
    position: "relative",
    zIndex: isDragging ? 999 : "auto",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <List.Item
        style={{
          padding: "12px",
          border: "1px solid #f0f0f0",
          marginBottom: "8px",
          backgroundColor: "#fff",
        }}
      >
        {value}
      </List.Item>
    </div>
  );
};

// 排序列表容器
const SortableList = ({ items }: { items: string[] }) => {
  const [listItems, setListItems] = useState(
    items.map((item, index) => ({ id: `item-${index}`, value: item }))
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setListItems((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={listItems} strategy={verticalListSortingStrategy}>
        <List
          bordered
          dataSource={listItems}
          renderItem={(item) => (
            <SortableItem key={item.id} id={item.id} value={item.value} />
          )}
        />
      </SortableContext>
    </DndContext>
  );
};

// 使用示例
export const DndkitDemo = () => {
  const initialItems = ["选项1", "选项2", "选项3", "选项4"];
  return <SortableList items={initialItems} />;
};
