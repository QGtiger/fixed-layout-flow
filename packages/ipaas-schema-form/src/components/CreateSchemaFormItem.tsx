import { IPaasFormSchema } from "@/type";
import { findCusrorItem } from "@/utils/findCursorItem";
// import RecursionFormItem from ".";
import { Fragment, useEffect, useMemo } from "react";
import classNames from "classnames";
import { useBoolean } from "ahooks";
import { CaretRightOutlined } from "@ant-design/icons";
import { Form } from "antd";
import RecursionFormItem from "./RecursionFormItem";

function GroupItem({
  subSchema,
  groupName,
}: {
  subSchema: IPaasFormSchema[];
  groupName: string;
}) {
  const [open, openAction] = useBoolean(true);
  const formIns = Form.useFormInstance();

  console.log("formIns.getFieldsValue()", formIns.getFieldsValue());

  const cursorFormItem = findCusrorItem(subSchema, formIns.getFieldsValue(), 0);

  return (
    <div className="flex flex-col">
      {groupName && (
        <div
          onClick={openAction.toggle}
          className={classNames(
            "text-[14px] font-semibold flex  gap-2 cursor-pointer"
          )}
        >
          <CaretRightOutlined
            className={classNames(" transition-all duration-300", {
              "transform rotate-90": open,
            })}
          />
          <span>{groupName}</span>
        </div>
      )}
      <div
        className={classNames("overflow-hidden mt-2", {
          "max-h-0": !open,
        })}
      >
        {cursorFormItem && <RecursionFormItem formItemState={cursorFormItem} />}
      </div>
    </div>
  );
}

export default function CreateSchemaFormItem({
  schema,
}: {
  schema: IPaasFormSchema[];
}) {
  const listByGroup = useMemo(() => {
    const groupMap = new Map<string, IPaasFormSchema[]>();
    const list: Array<{
      groupName: string;
      subSchema: IPaasFormSchema[];
    }> = [];
    schema.forEach((action) => {
      const group = action.group || "";
      if (!groupMap.has(group)) {
        const v: IPaasFormSchema[] = [];
        groupMap.set(group, v);
        list.push({
          groupName: group,
          subSchema: v,
        });
      }
      groupMap.get(group)?.push(action);
    });
    return list;
  }, [schema]);

  return (
    <Fragment>
      {listByGroup.map((group) => {
        const { groupName, subSchema } = group;
        return (
          <GroupItem
            key={groupName}
            subSchema={subSchema}
            groupName={groupName}
          />
        );
      })}
    </Fragment>
  );
}
