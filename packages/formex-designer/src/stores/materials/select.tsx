import { useBoolean } from "ahooks";
import { Select } from "antd";
import { useEffect, useRef } from "react";

export default function CustomSelect(props: any) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLDivElement>(null);
  const [open, openAction] = useBoolean(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const ele = ref.current;
      if (!ele) return;
      if (!ele.contains(event.target as Node)) {
        openAction.setFalse();
      } else {
        const popoverContainer = popoverRef.current;
        if (
          popoverContainer &&
          popoverContainer.contains(event.target as Node)
        ) {
          openAction.setTrue();
        } else {
          openAction.toggle();
        }
      }
    }

    document.body.addEventListener("click", handleClickOutside, {
      capture: true,
    });
    return () => {
      document.body.removeEventListener("click", handleClickOutside, {
        capture: true,
      });
    };
  }, [openAction]);

  return (
    <div ref={ref}>
      <Select
        {...props}
        open={open}
        style={{ width: "100%" }}
        getPopupContainer={() => popoverRef.current as HTMLElement}
        onSelect={openAction.setFalse}
      />
      <div ref={popoverRef}></div>
    </div>
  );
}
