import {
  PathRuleConnector,
  PathsConnector,
  DefaultPathConnector,
} from "@xybot/build-in-connectors";
import PathsLogo from "@/assets/path.svg";

PathRuleConnector.iconUrl = PathsLogo;
PathsConnector.iconUrl = PathsLogo;
DefaultPathConnector.iconUrl = PathsLogo;

export const buildInConnectors = [
  PathRuleConnector,
  PathsConnector,
  DefaultPathConnector,
];

export const buildInConnectorMap = buildInConnectors.reduce(
  (acc, connector) => {
    acc[`${connector.code}_${connector.version}`] = connector;
    return acc;
  },
  {} as Record<string, IPaaSConnectorDetail>
);
