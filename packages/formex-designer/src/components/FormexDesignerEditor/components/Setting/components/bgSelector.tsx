import classNames from "classnames";

const bgList: {
  value: string;
  label: string;
}[] = [
  {
    value:
      "https://winrobot-pub-a.oss-cn-hangzhou.aliyuncs.com/static/bg-6.png",
    label: "午后",
  },
  {
    value:
      "https://winrobot-pub-a-1302949341.cos.ap-shanghai.myqcloud.com/image/20250514202954/395c74ad8b4de6e1b7a38247700842aa.png",
    label: "青春",
  },
  {
    value:
      "https://winrobot-pub-a.oss-cn-hangzhou.aliyuncs.com/static/bg-2.png",
    label: "目标",
  },
  {
    value:
      "https://winrobot-pub-a.oss-cn-hangzhou.aliyuncs.com/static/bg-3.png",
    label: "任务",
  },
  {
    value:
      "https://winrobot-pub-a.oss-cn-hangzhou.aliyuncs.com/static/bg-4.png",
    label: "经典",
  },
  {
    value:
      "https://winrobot-pub-a.oss-cn-hangzhou.aliyuncs.com/static/bg-5.png",
    label: "荣誉",
  },
];

export default function BgSelector({
  value,
  onChange,
}: {
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      {bgList.map((item) => (
        <div
          key={item.value}
          className="flex items-center gap-2 cursor-pointer flex-col justify-center"
          onClick={() => {
            onChange?.(item.value);
          }}
        >
          <img
            src={item.value}
            className={classNames(
              "w-full h-[168px] object-cover rounded-md border-2 border-gray-200 hover:border-blue-500 transition-all",
              {
                "!border-blue-500": value === item.value,
              }
            )}
            alt=""
          />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
