import { useMount } from "ahooks";
import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";

export default function useMaterialDrag({
  type,
  it,
  ref,
}: {
  type: string;
  it: MaterialItem;
  ref: React.RefObject<HTMLDivElement | null>;
}) {
  const [, drag, dragPreview] = useDrag({
    type,
    item: { ...it },
  });

  useMount(() => {
    drag(ref);
    // dragPreview(getEmptyImage());
  });
}
