import { request } from "@/api/request";
import { createCustomModel } from "@/common/createModel";
import { useRequest } from "ahooks";
import { useCallback, useRef } from "react";

interface IPaaSConnector {
  version: string;
  name: string;
  code: string;
  description: string;
  iconUrl: string;
  hasActions: boolean;
  hasTriggers: boolean;
  needAuth: boolean;
}

interface IPaaSConnectorDetail {
  code: string;
  name: string;
  iconUrl: string;
  version: string;
  lastedVersion?: string;
  description: string;

  needAuth: boolean;
  documentLink?: string;

  actions: IPaaSConnectorAction[];
  triggers: IPaaSConnectorAction[];
}

interface IPaaSConnectorAction {
  code: string;
  name: string;
  description: string;
  // flowCardDescription?: string | ((data: { form: any; viewHash: WorkflowNode['viewHash'] }) => string);

  // 额外字段待补充 TODO
  // inputs: any;
  outputStruct: OutputStructItem[];
  viewMeta: {
    inputs?: any[];
  };

  group?: string;
  hidden?: boolean;

  triggerType?: "manual" | "webhook" | "schedule";

  testFormUrl?: string;
  testWaitDescription?: string;
  testDescription?: string;
}

export const IPaaSModel = createCustomModel(() => {
  const connectorMapRef = useRef<Record<string, IPaaSConnectorDetail>>({});

  const { data, loading } = useRequest(() => {
    return request<IPaaSConnector[]>({
      url: "/api/flow/v1/connector/listConnector",
      method: "POST",
    }).then((r) => r.data || []);
  });

  const queryIPaaSConnectorDetail = useCallback(
    ({ code, version }: { code: string; version: string }) => {
      const cacheMap = connectorMapRef.current;
      const key = `${code}_${version}`;
      const cacheItem = cacheMap[key];
      if (cacheItem) {
        return Promise.resolve(cacheItem);
      }

      return request<IPaaSConnectorDetail>({
        url: "/api/flow/v1/connector/getDefinition",
        params: {
          connectorCode: code,
          connectorVersion: version,
        },
      }).then(({ data }) => {
        if (data) {
          cacheMap[key] = {
            ...data,
            actions: data.actions
              ?.map((it) => {
                return {
                  ...it,
                  outputStruct: JSON.parse(
                    (it.outputStruct as unknown as string) || "[]"
                  ),
                  viewMeta: JSON.parse(
                    (it.viewMeta as unknown as string) || "{}"
                  ),
                };
              })
              .filter((it) => !it.hidden),
            triggers: data.triggers
              ?.map((it) => {
                return {
                  ...it,
                  outputStruct: JSON.parse(
                    (it.outputStruct as unknown as string) || "[]"
                  ),
                  viewMeta: JSON.parse(
                    (it.viewMeta as unknown as string) || "{}"
                  ),
                };
              })
              .filter((it) => !it.hidden),
          };
        }
        return cacheMap[key];
      });
    },
    []
  );

  return {
    iPaaSConnectors: data || [],
    loading,
    queryIPaaSConnectorDetail,
  };
});
