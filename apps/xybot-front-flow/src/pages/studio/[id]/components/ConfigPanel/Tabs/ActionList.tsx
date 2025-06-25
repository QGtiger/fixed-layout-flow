import Badge from "@/components/Badge";
import { CaretRightOutlined } from "@ant-design/icons";
import { useBoolean, useCreation } from "ahooks";
import classNames from "classnames";

function GroupItem(props: {
  groupName: string;
  actions: IPaaSConnectorAction[];
  selectedCode: string | undefined;
  onItemClick?: (code: string) => void;
}) {
  const { groupName, actions, selectedCode, onItemClick } = props;
  const [open, openAction] = useBoolean(true);

  // TODO 是否禁用
  const disabled = false;

  return (
    <div className="flex flex-col">
      {groupName && (
        <div
          onClick={openAction.toggle}
          className={classNames(
            "text-[14px] font-semibold flex  gap-2 cursor-pointer",
            open && "mb-3"
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
        className={classNames(
          "flex flex-col gap-[12px] overflow-hidden transition-all ",
          {
            "max-h-0": !open,
          }
        )}
      >
        {actions.map((action) => {
          const selected = selectedCode === action.code;
          return (
            <div
              key={action.code}
              className={classNames(
                "relative flex cursor-pointer flex-col items-start gap-[4px] overflow-hidden rounded-[8px] border border-solid bg-[#ffffff] px-[16px] py-[16px] transition-colors duration-150 ease-out hover:bg-[#F6F8FB]",
                {
                  "border-[#3170FA]": selected,
                  "border-[#DDDFE3]": !selected,
                  "!bg-[#EFF4FF]": selected,
                  "!bg-[#F2F4F7] cursor-not-allowed pointer-events-none":
                    disabled,
                }
              )}
              onClick={async () => {
                onItemClick?.(action.code);
              }}
            >
              <div className="relative mt-[-1.00px] w-fit text-[14px] font-semibold leading-[normal] tracking-[0] text-primary-black [font-family:'PingFang_SC-Semibold',Helvetica]">
                {action.name}
              </div>
              <div className="relative self-stretch text-[12px] font-normal leading-[normal] tracking-[0] text-secondary-grey [font-family:'PingFang_SC-Regular',Helvetica]">
                {action.description}
              </div>

              {selected && <Badge />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ActionList({
  actionList,
  activeCode,
  onActionChange,
}: {
  actionList: IPaaSConnectorAction[];
  activeCode?: string;
  onActionChange?: (code: string) => void;
}) {
  const listByGroup = useCreation(() => {
    const groupMap = new Map<string, IPaaSConnectorAction[]>();
    const list: Array<{
      groupName: string;
      actions: IPaaSConnectorAction[];
    }> = [];
    actionList.forEach((action) => {
      const group = action.group || "";
      if (!groupMap.has(group)) {
        const v: IPaaSConnectorAction[] = [];
        groupMap.set(group, v);
        list.push({
          groupName: group,
          actions: v,
        });
      }
      groupMap.get(group)?.push(action);
    });
    return list;
  }, [actionList]);

  return (
    <div className="actions-list flex flex-col gap-[12px]">
      {listByGroup.map((group) => {
        return (
          <GroupItem
            groupName={group.groupName}
            actions={group.actions}
            key={group.groupName}
            selectedCode={activeCode}
            onItemClick={onActionChange}
          />
        );
      })}
    </div>
  );
}
