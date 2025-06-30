import { request } from "@/api/request";
import { createCustomModel } from "@/common/createModel";
import { useRequest } from "ahooks";
import { useCallback, useRef } from "react";
import { buildInConnectorMap } from "./buildInConnector";

export const IPaaSModel = createCustomModel(() => {
  const connectorMapRef =
    useRef<Record<string, IPaaSConnectorDetail>>(buildInConnectorMap);

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
