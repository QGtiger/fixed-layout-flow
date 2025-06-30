import { useSchemaStore } from "@/stores/useSchemaStore";
import { useRef } from "react";
import useMaterialDrag from "../../useMaterialDrag";

export default function MaterialItem({ it }: { it: MaterialItem }) {
  const { code } = it;
  const ref = useRef<HTMLDivElement>(null);
  const { insertFormItem } = useSchemaStore();

  // useMaterialDrag({
  //   type: code,
  //   it,
  //   ref,
  // });

  return (
    <div
      ref={ref}
      className="py-2 px-4 flex gap-2 border-gray-300 border border-solid rounded-md hover:bg-gray-100 hover:shadow-md cursor-pointer text-sm"
      key={it.code}
      onClick={() => {
        insertFormItem(it);
      }}
    >
      <div>{it.icon}</div>
      <div className=" line-clamp-1">{it.name}</div>
    </div>
  );
}
