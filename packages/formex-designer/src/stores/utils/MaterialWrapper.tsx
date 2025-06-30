import { PropsWithChildren, useEffect, useRef } from "react";
import { useMaterialStore } from "../useMaterialStore";
import { useDrag, useDrop } from "react-dnd";
import { useMount } from "ahooks";
import { useSchemaStore } from "../useSchemaStore";
import { getEmptyImage } from "react-dnd-html5-backend";

interface ItemType {
  code: string;
  dragType?: "move" | "add";
  id: string;
}

export default function MaterialWrapper(
  props: PropsWithChildren<MaterialItemProps>
) {
  const { materialKeys, materialMap, getMaterialItemByCode } =
    useMaterialStore();
  const { code } = props;
  const materialItem = getMaterialItemByCode(code);

  const {
    setOverComponentId,
    setOverComponentPlacement,
    insertFormItem,
    swapFormItem,
  } = useSchemaStore();
  const ref = useRef<HTMLDivElement>(null);

  const [{ isOver }, drop] = useDrop({
    accept: materialKeys,
    drop(item: ItemType, monitor) {
      if (!ref.current || item.id === props.id) return;
      // 防止重复触发
      if (monitor.didDrop()) {
        return;
      }

      if (item.dragType === "move") {
        console.log("move", item);
        swapFormItem(item.id, props.id);
        return;
      }

      insertFormItem(materialMap[item.code]);
    },
    hover(item: any, monitor) {
      if (!ref.current || item.id === props.id) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverThreshold =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // 计算鼠标悬停位置
      // 通过 monitor.getClientOffset() 获取鼠标位置
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      setOverComponentPlacement(
        hoverClientY < hoverThreshold ? "top" : "bottom"
      );
    },
    collect: (monitor) => {
      // 只有在 不是自身元素时 才是 isOver
      const draggingItem = monitor.getItem() as ItemType | null;
      const isOverValid =
        !!monitor.isOver({ shallow: true }) && draggingItem?.id !== props.id;

      return {
        isOver: isOverValid,
        canDrop: !!monitor.canDrop(),
      };
    },
  });

  const [, drag, dragPreview] = useDrag({
    type: props.code,
    item: (monitor) => {
      console.log("drag", monitor);
      return {
        dragType: "move",
        id: props.id,
        code: props.code,
      };
    },
    collect(monitor) {
      return {
        dragging: monitor.isDragging(),
      };
    },
  });

  useMount(() => {
    if (!materialItem.hidden) {
      drop(ref);
      drag(ref);
      // dragPreview(getEmptyImage());
    }
  });

  useEffect(() => {
    setOverComponentId(isOver ? props.id : "");
  }, [isOver, setOverComponentId, props.id]);

  return (
    <div
      ref={ref}
      data-component-id={props.id}
      className=" cursor-pointer"
      onMouseDownCapture={(e) => e.stopPropagation()}
    >
      {props.children}
    </div>
  );
}
