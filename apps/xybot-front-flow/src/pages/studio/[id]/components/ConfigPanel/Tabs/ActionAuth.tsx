import { request } from "@/api/request";
import { useRequest } from "ahooks";
import { StudioFlowModel } from "../../../StudioFlowModel";
import { MinimalLoader } from "@/components/MinimalLoader";
import classNames from "classnames";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import Badge from "@/components/Badge";
import ScrollContent from "@/components/ScrollContent";
import { Button } from "antd";
import { ConfigPanelModel } from "../model";
import { useEffect } from "react";

interface AuthItem {
  /**
   * 授权id
   */
  authId: string;
  /**
   * 授权连接名称
   */
  authName: string;
  /**
   * 连接器编码
   */
  connectorCode: string;
  /**
   * 连接器名称
   */
  connectorName: string;
  connectorVersion: string;
  /**
   * 创建时间
   */
  createTime?: null | string;
  /**
   * 创建人
   */
  creatorName?: null | string;
  /**
   * 创建人
   */
  creatorUuid?: null | string;
  /**
   * 授权状态，fail: 授权失败，success: 授权成功，expired：授权已过期
   */
  status?: AuthStatus;
  [property: string]: any;
}

enum AuthStatus {
  Expired = "expired",
  Fail = "fail",
  Success = "success",
}

function AuthItem({ active, item }: { active?: boolean; item: AuthItem }) {
  const disabled = false;
  const { authName, connectorName, owner, status, createTime } = item;
  const success = status === "success";
  return (
    <div
      className={classNames(
        "relative flex cursor-pointer flex-col items-start overflow-hidden rounded-[8px] border border-solid bg-[#ffffff] p-3 transition-colors duration-150 ease-out hover:bg-[#F6F8FB]",
        {
          "cursor-not-allowed pointer-events-none bg-[#F2F4F7]": disabled,

          "border-[#3170FA]": active,
          "border-[#DDDFE3]": !active,
          "!bg-[#EFF4FF]": active,
        }
      )}
    >
      <span className="mb-2 inline-flex items-center justify-start space-x-2">
        <span className="text-sm font-semibold inline-block max-w-[200px]  overflow-hidden text-ellipsis whitespace-nowrap truncate">
          {authName || connectorName}
        </span>

        {owner && (
          <span>
            <EditOutlined />{" "}
          </span>
        )}
        <span
          className={classNames(
            " px-2 text-green-700 bg-[#f1fee7] text-xs rounded-full"
          )}
        >
          {success ? "有效" : "失效"}
        </span>
      </span>
      <span className="text-xs text-zinc-400">{createTime}</span>
      {active && <Badge />}
    </div>
  );
}

export default function ActionAuth({ authId }: { authId?: string }) {
  const { selectedNode } = StudioFlowModel.useModel();
  const { connectorDetail } = ConfigPanelModel.useModel();
  const { data: authList } = useRequest(async () => {
    if (!connectorDetail?.needAuth) return;
    return request<AuthItem[]>({
      url: "/api/tool/ipaas/auth/queryAuthedList",
      method: "POST",
      data: {
        connectorCode: selectedNode?.connectorCode,
        version: selectedNode?.version,
        page: 1,
        size: 500,
      },
    }).then(({ data }) => {
      return data;
    });
  });

  const { data: authDetail, refresh } = useRequest(
    async () => {
      if (!authId) return;
      return request<AuthItem>({
        url: "/api/tool/ipaas/auth/getAuthRecordById",
        params: {
          authId,
        },
      }).then(({ data }: any) => {
        return {
          authName: data.name,
          authId: data.id,
          status: data.status,
          owner: data.owner,
          ...data,
        } as AuthItem;
      });
    },
    {
      manual: true,
    }
  );

  useEffect(() => {
    refresh();
  }, [authId]);

  if (!authList) {
    return (
      <div className="relative h-[300px]">
        <MinimalLoader />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full gap-4 flex-col">
      <div className="text-gray-500 font-normal font-['PingFang SC'] leading-snug">
        {authList.length === 0 ? "无授权账号" : "授权账号"}
      </div>
      {authDetail && (
        <div className="authedIt">
          <AuthItem active item={authDetail} />
        </div>
      )}
      <ScrollContent className="h-1 flex-1  scroll-content relative">
        <div className="flex flex-col gap-2">
          {authList.map((item) => (
            <AuthItem key={item.authId} item={item} />
          ))}
        </div>
      </ScrollContent>
      <Button block type="primary" className="py-2" icon={<PlusOutlined />}>
        添加账号
      </Button>
    </div>
  );
}
