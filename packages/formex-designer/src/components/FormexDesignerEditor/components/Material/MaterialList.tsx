import { useMaterialList } from "@/stores/useMaterialStore";
import MaterialItem from "./MaterialItem";

export default function MaterialList() {
  const list = useMaterialList();

  const filterList = list.filter((it) => {
    return !it.hidden;
  });
  return (
    <div className=" grid grid-cols-2 gap-3">
      {filterList.map((it) => {
        return <MaterialItem key={it.code} it={it} />;
      })}
    </div>
  );
}
