interface WorkflowNode {
  id: string;

  connectorCode?: string;
  connectorName?: string;
  actionCode?: string;
  actionName?: string;
  iconUrl?: string;
  version?: string;
  description?: string;

  sequence?: number;

  children?: WorkflowNode['id'][];
  next?: WorkflowNode['id'];
  parent?: string;

  inputs?: WorkflowNodeInputs;

  outputStruct?: OutputStructItem[];

  authId?: string;
  needAuth?: boolean;
  formStatus?: boolean;

  // 单步调试样本数据
  sample?: Record<string, any>;

  debugStatus?: number;
  debugResponse?: string;

  viewHash?: Record<string, Record<string, string>>;
}

interface OutputStructItem {
  name: string;
  type: string;
  label: string;
  children?: OutputStructItem[];
}

type WorkflowNodeInputs = Record<
  string,
  {
    value: any;
    label: string;
    type: string;
  }
>;

// useless
type WorkflowNodeData = Omit<WorkflowNode, 'id' | 'next' | 'children'>;
