import { ErrorBoundary } from "react-error-boundary";
import { createRoot } from "react-dom/client";

import "./index.css";
import IndexPage from "./pages";
import CodeEditorPage from "./pages/CodeEditor";
import CodeEditorFormChatGpt from "./pages/CodeEditor/CodeEditorFormChatGpt";
import CustomCodeEditor from "./pages/CodeEditor/CustomCodeEditor";
import { completeOutputStruct } from "./utils/workflowUtils";

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary fallback={<div>Something went wrong</div>}>
    <div
      style={{
        height: "100vh",
      }}
    >
      {/* <IndexPage /> */}
      <CodeEditorPage />
      {/* <CodeEditorFormChatGpt /> */}
      <CustomCodeEditor
        structMap={{
          节点1: completeOutputStruct([], {
            a: {
              p: [{ pp: 123 }, { pp: 456 }],
              pc: [2],
            },
          }),
          RPA: [
            {
              name: "jobUuid",
              label: "应用运行uuid",
              type: "string",
              key: "96486195-64f6-429b-8e92-132c595b9374",
            },
            {
              name: "status",
              label: "应用运行状态",
              type: "string",
              key: "96486195-64f6-429b-8e92-132c595b9371",
            },
            {
              name: "statusName",
              label: "应用运行状态描述",
              type: "string",
              key: "96486195-64f6-429b-8e92-132c595b9372",
            },
            {
              name: "remark",
              label: "备注信息",
              type: "string",
              key: "96486195-64f6-429b-8e92-132c595b9373",
            },
            {
              name: "screenshotUrl",
              label: "job的截屏url",
              type: "string",
              key: "96486195-64f6-429b-8e92-132c595b9374",
            },
            {
              name: "robotClientName",
              label: "机器人名称",
              type: "string",
              key: "12f4e30c-d029-4a18-8c42-ac497491c68b",
            },
            {
              name: "robotName",
              label: "应用名称",
              type: "string",
              key: "480ebb04-103a-431d-b6c1-e43ed1b5997d",
            },
            {
              name: "robotUuid",
              label: "应用uuid",
              type: "string",
              key: "b487a042-016f-426c-904a-a780ceb534c4",
            },
            {
              name: "robotParams",
              label: "应用运行参数",
              type: "object",
              key: "50b41544-ee32-4b77-97a9-f929bf65e7ef",
              children: [
                {
                  key: "78169c41-5e2e-43f1-9b6a-b8bf6bb17846",
                  name: "inputs",
                  label: "应用输入参数",
                  type: "array",
                  children: [
                    {
                      disabled: true,
                      name: "array[index]",
                      label: "array[index]",
                      key: "55810f7f-56ea-4afb-a631-50862be8fac7",
                      type: "object",
                      children: [
                        {
                          key: "2c36ba95-033e-44db-86e3-cb64708f51df",
                          name: "name",
                          label: "name",
                          type: "string",
                        },
                        {
                          key: "3718144c-cb45-42d5-855b-080f60fc931e",
                          name: "value",
                          label: "value",
                          type: "string",
                        },
                      ],
                    },
                  ],
                },
                {
                  key: "7859c7ca-2109-4448-83b1-d287546e3fb3",
                  name: "outputs",
                  label: "应用输出参数",
                  type: "array",
                  children: [
                    {
                      disabled: true,
                      name: "array[index]",
                      label: "array[index]",
                      key: "9aa6dac6-09cb-4270-b8c1-4849aa05f7bc",
                      type: "object",
                      children: [
                        {
                          key: "9efd79d7-f28a-40b2-af10-7c0da97b9d1f",
                          name: "name",
                          label: "name",
                          type: "string",
                        },
                        {
                          key: "5f24c46c-d3ab-4dbf-8842-41d504f33b7d",
                          name: "value",
                          label: "value",
                          type: "string",
                        },
                        {
                          key: "2db34cea-ba1c-4437-9ade-af9f0a6ce5f5",
                          name: "type",
                          label: "type",
                          type: "string",
                        },
                      ],
                    },
                  ],
                },
                {
                  key: "7859c7ca-2109-4448-83b1-d287546e3fb4",
                  name: "inputValue",
                  label: "应用输入参数对象",
                  type: "object",
                },
                {
                  key: "7859c7ca-2109-4448-83b1-d287546e3fb5",
                  name: "outputValue",
                  label: "应用输出参数对象",
                  type: "object",
                },
              ],
            },
            {
              name: "robotClientUuid",
              label: "机器人uuid",
              type: "string",
              key: "c5cbb0e5-e7da-4835-962d-7558288a7d0c",
            },
            {
              name: "startTime",
              label: "应用开始运行时间",
              type: "string",
              key: "8bfef414-0dea-4bd0-9bb2-4c3ac50b72e5",
            },
            {
              name: "endTime",
              label: "应用结束运行时间",
              type: "string",
              key: "302e78c7-9a30-4c4d-a17a-ca663a9bdcd2",
            },
          ],
          表单: [
            {
              name: "body",
              label: "输出结果",
              type: "object",
              children: [
                {
                  name: "form",
                  label: "自定义表单输入项",
                  type: "object",
                  key: "71b3635c-f03d-4dc3-8e79-b3b1baec757c",
                  children: [
                    {
                      name: "input-1750124519559",
                      type: "string",
                      label: "输入框",
                    },
                    {
                      name: "inputNumber-1750124519868",
                      type: "string",
                      label: "数字输入",
                    },
                    {
                      name: "multiSelect-1750124520159",
                      type: "string",
                      label: "下拉多选",
                    },
                    {
                      name: "datePicker-1750124520417",
                      type: "string",
                      label: "日期选择",
                    },
                    {
                      name: "upload-1750124520692",
                      type: "string",
                      label: "文件上传",
                    },
                    {
                      name: "select-1750124520970",
                      type: "string",
                      label: "下拉选择",
                    },
                  ],
                },
              ],
              key: "8cc02ee9-51bd-491e-8dde-6db34dd50760",
            },
          ],
        }}
      />
    </div>
  </ErrorBoundary>
);
