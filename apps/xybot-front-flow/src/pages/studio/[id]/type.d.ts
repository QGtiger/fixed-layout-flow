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
