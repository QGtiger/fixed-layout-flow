import { MDType, sendBuryByFlow } from "@/utils/md";
import { useDebounceFn } from "ahooks";
import { ConfigProvider, Empty, Input, InputRef, Tabs, TabsProps } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";
import { IPaaSModel } from "../../IPaaSModel";
import { buildInConnectorsWithSelect } from "../../buildInConnector";
import classNames from "classnames";

const items: TabsProps["items"] = [
  {
    key: "ipaas",
    label: "应用",
  },
  {
    key: "flow",
    label: "逻辑与工具",
  },
];

export default function AddNodeModal({
  onItemClick,
  isTrigger,
  currCode,
}: {
  onItemClick: (item: { code: string; version: string }) => void;
  isTrigger?: boolean;
  currCode?: string;
}) {
  const [searchText, setSearchText] = useState("");
  const isComposingRef = useRef(false);
  const { actionList, triggerList } = IPaaSModel.useModel();
  const [tabKey, setTabKey] = useState("ipaas");
  const inputRef = useRef<InputRef>(null);

  useEffect(() => {
    inputRef.current?.focus();
  });

  const { run: handleInput } = useDebounceFn(
    (text: string) => {
      if (isComposingRef.current) return;
      setSearchText(text);

      text &&
        sendBuryByFlow(MDType.SEARCH_NODE, {
          searchKey: text,
        });
    },
    {
      wait: 300,
    }
  );

  const filterToolList = useMemo(() => {
    if (isTrigger) {
      return triggerList.filter((it) => {
        return it.name.toLowerCase().includes(searchText.toLowerCase());
      });
    }

    const list = tabKey === "ipaas" ? actionList : buildInConnectorsWithSelect;
    const sk = searchText.toLowerCase();
    if (!sk) return list;
    // @ts-expect-error
    return actionList.concat(buildInConnectorsWithSelect).filter((it) => {
      return it.name.toLowerCase().includes(sk);
    });
  }, [searchText, tabKey, actionList, triggerList, isTrigger]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [showShadow, setShowShadow] = useState(false);

  const handleScroll = () => {
    if (scrollRef.current) {
      setShowShadow(scrollRef.current.scrollTop > 0);
    }
  };

  const hiddenTab = searchText || isTrigger;

  return (
    <div className="mt-2">
      <Input
        placeholder="搜索"
        onChange={(e) => {
          handleInput(e.target.value);
        }}
        onCompositionStart={() => {
          isComposingRef.current = true;
        }}
        onCompositionEnd={(e) => {
          isComposingRef.current = false;
          handleInput((e.target as HTMLInputElement).value);
        }}
        ref={inputRef}
      />
      <div className={classNames("-mb-4", { hidden: hiddenTab })}>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#000000",
            },
          }}
        >
          <Tabs
            items={items}
            activeKey={tabKey}
            onChange={(e) => setTabKey(e)}
            tabBarGutter={10}
          />
        </ConfigProvider>
      </div>
      <div className="relative mt-2 h-[500px]">
        <div
          className="list max-h-[500px] overflow-auto scroll-content relative grid grid-cols-2 gap-x-[16px] gap-y-[6px]"
          ref={scrollRef}
          onScroll={handleScroll}
        >
          {filterToolList.length
            ? filterToolList!.map((item) => {
                const disabled = item.code === currCode;
                return (
                  <div
                    onClick={() => {
                      if (disabled) return;
                      onItemClick(item);

                      if (isTrigger) {
                        sendBuryByFlow(MDType.ADD_TRIGGER, {
                          triggerName: item.name,
                          triggerCode: item.code,
                          version: item.version,
                        });
                      } else {
                        sendBuryByFlow(MDType.ADD_ACTION, {
                          actionName: item.name,
                          actionCode: item.code,
                          version: item.version,
                        });
                      }
                    }}
                    className={classNames(
                      "flex items-center gap-2 p-[12px] hover:bg-slate-200 rounded-md cursor-pointer ",
                      {
                        "bg-slate-200 !cursor-not-allowed": disabled,
                      }
                    )}
                    key={item.code}
                  >
                    <div className="flex-shrink-0 flex h-[32px] w-[32px] items-center justify-center rounded-[5.33px] border border-solid border-gray-300 bg-white">
                      <img
                        className="h-[24px] w-[24px]"
                        src={item.iconUrl}
                        alt={item.name}
                      />
                    </div>
                    <div className="t">
                      <div className="name flex-shrink-0 line-clamp-1">
                        {item.name}
                      </div>
                      <div className="desc text-xs text-gray-500 line-clamp-2">
                        {item.description}
                      </div>
                    </div>
                  </div>
                );
              })
            : null}
        </div>
        {!filterToolList.length && (
          <div className="mt-10 flex items-center justify-center">
            <Empty />
          </div>
        )}
        <div
          className={`absolute top-0 left-0 right-0 h-4  z-100 pointer-events-none transition-opacity duration-200 ${
            showShadow ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.1), transparent)",
          }}
        />
      </div>
    </div>
  );
}
