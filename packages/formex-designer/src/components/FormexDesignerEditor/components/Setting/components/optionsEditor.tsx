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
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { createRef, useEffect, useState } from "react";
import classNames from "classnames";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Form, Input, Modal } from "antd";
import { FormInstance } from "antd/lib";

interface Option {
  value: string;
  label: string;
}

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

// 可拖拽项组件
const SortableItem = ({
  id,
  value,
  suffix,
}: {
  id: string;
  value: Option;
  suffix?: React.ReactNode;
}) => {
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
    // cursor: "move",
    opacity: isDragging ? 0.8 : 1,
    position: "relative",
    zIndex: isDragging ? 999 : "auto",
    left: 0,
    right: 0,
  };

  return (
    <div
      style={style}
      {...attributes}
      className="flex bg-gray-100 gap-1 items-center group cursor-pointer py-1 hover:bg-gray-200 rounded-sm my-1 justify-between"
    >
      <div className="flex gap-1 items-center">
        <div className="icon" ref={setNodeRef} {...listeners}>
          <svg
            width="1em"
            height="1em"
            fill="none"
            className={classNames(
              "cursor-move text-gray-400 z-10 text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200",
              isDragging ? "opacity-100" : "opacity-0"
            )}
            color="currentColor"
            viewBox="0 0 16 16"
          >
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="M10 10.75a.25.25 0 0 1 .25.25v1a.25.25 0 0 1-.25.25H9a.25.25 0 0 1-.25-.25v-1a.25.25 0 0 1 .25-.25zm-3 0a.25.25 0 0 1 .25.25v1a.25.25 0 0 1-.25.25H6a.25.25 0 0 1-.25-.25v-1a.25.25 0 0 1 .25-.25zm2-3.5h1a.25.25 0 0 1 .25.25v1a.25.25 0 0 1-.25.25H9a.25.25 0 0 1-.25-.25v-1A.25.25 0 0 1 9 7.25m-3 0h1a.25.25 0 0 1 .25.25v1a.25.25 0 0 1-.25.25H6a.25.25 0 0 1-.25-.25v-1A.25.25 0 0 1 6 7.25m4-3.5a.25.25 0 0 1 .25.25v1a.25.25 0 0 1-.25.25H9A.25.25 0 0 1 8.75 5V4A.25.25 0 0 1 9 3.75zm-3 0a.25.25 0 0 1 .25.25v1a.25.25 0 0 1-.25.25H6A.25.25 0 0 1 5.75 5V4A.25.25 0 0 1 6 3.75z"
              clipRule="evenodd"
            ></path>
          </svg>
        </div>
        <div>{value.label}</div>
      </div>
      <div className="mr-2 text-gray-500 opacity-0 group-hover:opacity-100">
        {suffix}
      </div>
    </div>
  );
};

// 排序列表容器
const SortableList = ({
  items,
  onItemsChange,
}: {
  items: Option[];
  onItemsChange?: (items: Option[]) => void;
}) => {
  const [modal, modalHolder] = Modal.useModal();
  const [listItems, setListItems] = useState(
    items.map((item) => ({ id: `item-${generateId()}`, value: item }))
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

  const addItem = () => {
    const newItem = {
      id: `item-${generateId()}`,
      value: {
        value: `选项${listItems.length + 1}`,
        label: `选项${listItems.length + 1}`,
      },
    };
    setListItems((items) => [...items, newItem]);
  };

  const removeItem = (id: string) => {
    setListItems((items) => items.filter((item) => item.id !== id));
  };

  const editItem = (id: string, value: Option) => {
    const formRef = createRef<FormInstance>();
    modal.confirm({
      icon: null,
      title: "编辑选项",
      centered: true,
      content: (
        <Form ref={formRef} colon={false} layout="vertical">
          <Form.Item
            label="选项名称"
            name="label"
            initialValue={value.label}
            rules={[{ required: true, message: "请输入选项名称" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="选项值"
            name="value"
            initialValue={value.value}
            rules={[{ required: true, message: "请输入选项值" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      ),
      okText: "保存",
      cancelText: "取消",
      async onOk() {
        const values = await formRef.current?.validateFields();
        if (values) {
          setListItems((items) =>
            items.map((item) => {
              if (item.id === id) {
                return {
                  ...item,
                  value: { ...item.value, ...values },
                };
              }
              return item;
            })
          );
        }
      },
    });
  };

  useEffect(() => {
    onItemsChange?.(listItems.map((item) => item.value));
  }, [listItems]);

  return (
    <div className=" relative">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        // 强制只能在垂直方向拖拽
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext
          items={listItems}
          strategy={verticalListSortingStrategy}
        >
          <div className=" rounded-md border border-gray-300 border-solid px-1">
            {listItems.length ? (
              listItems.map((item) => (
                <div
                  key={item.id}
                  className=""
                  onClick={() => editItem(item.id, item.value)}
                >
                  <SortableItem
                    key={item.id}
                    id={item.id}
                    value={item.value}
                    suffix={
                      <DeleteOutlined
                        onClickCapture={(e) => {
                          e.stopPropagation();
                          removeItem(item.id);
                        }}
                      />
                    }
                  />
                </div>
              ))
            ) : (
              <div
                className="text-gray-400 text-sm p-2 cursor-pointer "
                onClick={addItem}
              >
                暂无选项, 请添加
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>
      <div
        className=" absolute -top-[26px] right-1 text-gray-500 cursor-pointer hover:text-gray-700 transition-colors duration-200"
        onClick={addItem}
      >
        <PlusOutlined />
      </div>
      {modalHolder}
    </div>
  );
};

export default function OptionsEditor({
  value = [],
  onChange = () => {},
}: {
  value?: Option[];
  onChange?: (value: Option[]) => void;
}) {
  // 添加APP 组件树 修改。 Setting => onKeyDownCapture 可以被捕获
  return <SortableList items={value} onItemsChange={onChange} />;
}
