import {
  PathRuleConnector,
  PathsConnector,
  DefaultPathConnector,
  CodeConnector,
  EndConnector,
  GlobalVariableConnector,
  HttpConnector,
  JSONConnector,
  LoopConnector,
  WaitConnector,
} from "@xybot/build-in-connectors";
import PathsLogo from "@/assets/path.svg";

PathRuleConnector.iconUrl = PathsLogo;
PathsConnector.iconUrl = PathsLogo;
DefaultPathConnector.iconUrl = PathsLogo;

export const buildInConnectorsWithSelect = [
  PathsConnector,
  CodeConnector,
  EndConnector,
  GlobalVariableConnector,
  HttpConnector,
  JSONConnector,
  LoopConnector,
  WaitConnector,
];

export const buildInConnectors = [
  PathRuleConnector,
  PathsConnector,
  DefaultPathConnector,
  CodeConnector,
  EndConnector,
  GlobalVariableConnector,
  HttpConnector,
  JSONConnector,
  LoopConnector,
  WaitConnector,
];

export const buildInConnectorMap = buildInConnectors.reduce(
  (acc, connector) => {
    acc[`${connector.code}_${connector.version}`] = connector;
    return acc;
  },
  {} as Record<string, IPaaSConnectorDetail>
);

export function generateNodeData({
  actionCode,
  connectorDetail,
}: {
  actionCode?: string;
  connectorDetail: IPaaSConnectorDetail;
}) {
  const {
    actions,
    triggers,
    code,
    version,
    iconUrl,
    description,
    needAuth,
    name,
  } = connectorDetail;
  const list = actions.concat(triggers);
  const _actionCode =
    actionCode || (list.length === 1 ? list[0].code : undefined);
  const action = list.find((item) => item.code === _actionCode);

  return {
    connectorCode: code,
    version: version,
    connectorName: name,
    iconUrl,
    description: action?.description || description,

    actionCode: action?.code,
    actionName: action?.name,

    needAuth,
    outputStruct: action?.outputStruct,
    formStatus: !action?.viewMeta?.inputs?.length,
  };
}

export const pathRuleData = generateNodeData({
  connectorDetail: PathRuleConnector,
});

export const defaultPathRuleData = generateNodeData({
  connectorDetail: DefaultPathConnector,
});
