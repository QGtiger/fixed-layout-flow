以下是使用 `dnd-kit` 重构你的代码的示例，包含流畅的拖拽动画效果：

```tsx
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
export const SortableListDemo = () => {
  const initialItems = ["选项1", "选项2", "选项3", "选项4"];
  return <SortableList items={initialItems} />;
};
```

主要改动说明：

1. **核心依赖变更**：

   - 使用 `@dnd-kit/core` 替代 `react-dnd`
   - 使用 `@dnd-kit/sortable` 实现排序逻辑
   - 使用 `arrayMove` 处理数组排序

2. **动画实现**：

   - 通过 `useSortable` 的 `transform` 和 `transition` 实现平滑动画
   - 使用 `CSS.Translate.toString()` 处理位移
   - 自动处理拖拽时的层级（zIndex）和透明度

3. **传感器配置**：

   - 同时支持鼠标（PointerSensor）和键盘（KeyboardSensor）操作
   - 自动处理边界碰撞检测（closestCenter）

4. **性能优化**：

   - 内置的 `verticalListSortingStrategy` 优化垂直列表性能
   - 自动处理过渡动画的 CSS 属性

5. **antd 集成**：
   - 保持 List 组件样式的同时添加拖拽功能
   - 通过包裹 div 的方式兼容 antd 的 List.Item

如果需要更复杂的动画效果，可以配合 `@dnd-kit/modifiers` 和 `@dnd-kit/utilities` 实现：

```bash
npm install @dnd-kit/modifiers
```

然后添加滚动边界限制：

```tsx
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

// 在 DndContext 中添加
<DndContext
  modifiers={[restrictToVerticalAxis]}
  // 其他配置...
>
```

这个实现方案相比原始方案有以下优势：

1. 更流畅的动画效果
2. 更好的触摸设备支持
3. 内置的键盘可访问性
4. 更简洁的 API 设计
5. 更好的 TypeScript 支持
