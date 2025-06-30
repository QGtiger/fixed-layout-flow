import { useDragLayer } from "react-dnd";

export default function DragLayer() {
  const { isDragging, item, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    isDragging: monitor.isDragging(),
    currentOffset: monitor.getSourceClientOffset(),
  }));

  // console.log("isDragging", isDragging, item, currentOffset);

  // if (!isDragging) {
  //   return null;
  // }
  return (
    <div
      className=" fixed w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center"
      style={{
        left: currentOffset?.x,
        top: currentOffset?.y,
      }}
    >
      {JSON.stringify(item)} 拖拖拖
    </div>
  );
}
