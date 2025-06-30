import { MinusOutlined } from "@ant-design/icons";
import { Button, Form, Select } from "antd";
import React, { useRef, useState } from "react";
import { useEditor, useIpaasSchemaStore } from "@xybot/ipaas-schema-form";
import classNames from "classnames";
import { useSize } from "ahooks";

enum Operator {
  Equal = "equal", // 等于
  NotEqual = "notEqual", // 不等于
  GreaterThan = "greaterThan", // 大于
  GreaterThanOrEqual = "greaterEqual", // 大于等于
  LessThan = "lessThan", // 小于
  LessThanOrEqual = "lessEqual", // 小于等于
  Contains = "contains", // 包含
  NotContains = "notContains", // 不包含
  NotPresent = "notPresent", // 不存在
  IsPresent = "isPresent", // 存在
}

const operators = [
  { label: "等于", value: Operator.Equal },
  { label: "不等于", value: Operator.NotEqual },
  { label: "大于", value: Operator.GreaterThan },
  { label: "大于等于", value: Operator.GreaterThanOrEqual },
  { label: "小于", value: Operator.LessThan },
  { label: "小于等于", value: Operator.LessThanOrEqual },
  { label: "包含", value: Operator.Contains },
  { label: "不包含", value: Operator.NotContains },
  { label: "为空", value: Operator.NotPresent },
  { label: "不为空", value: Operator.IsPresent },
];

function NewCard(props: React.PropsWithChildren) {
  return (
    <div className="">
      <div className="card flex flex-col items-start gap-[16px] p-[12px] pb-[2px] relative bg-[#f6f8fb] rounded-[8px] shadow-md">
        {props.children}
      </div>
      <div className="flex items-center justify-center gap-[12px] relative mt-2 mb-2">
        <div className="relative flex-1 grow h-[1px] bg-[#e9ecf2]" />
        <div className="relative w-fit mt-[-1.00px] [font-family:'PingFang_SC-Regular',Helvetica] font-normal text-primary-black text-[14px] tracking-[0] leading-[normal]">
          或
        </div>
        <div className="relative flex-1 grow h-[1px] bg-[#e9ecf2]" />
      </div>
    </div>
  );
}

const ConditionEditor = (props: any) => {
  const eleRef = useRef<HTMLDivElement>(null);
  const eleSize = useSize(() => eleRef.current);
  const form = Form.useFormInstance();
  const FormInput = useEditor("Input");
  const { normalize } = useIpaasSchemaStore();

  const large = eleSize?.width === undefined ? false : eleSize?.width > 540;

  return (
    <Form.List name={props.name}>
      {(fields, { add, remove }) => (
        <div className="flex flex-col" ref={eleRef}>
          {fields.map((field) => (
            <NewCard key={field.key}>
              <Form.Item className="w-full" name="add">
                <Form.List name={[field.name, "add"]}>
                  {(subFields, subOpt) => (
                    <div className="flex flex-col subFields">
                      {subFields.map((subField, index) => {
                        const uk = index > 0 ? "且" : "当";
                        return (
                          <div className="sub" key={subField.key}>
                            {!large && (
                              <div className="flex justify-between mb-[10px]">
                                <span>{uk}</span>
                                <MinusOutlined
                                  onClick={() => {
                                    subOpt.remove(subField.name);
                                    if (subFields.length === 1) {
                                      remove(field.name);
                                    }
                                  }}
                                />
                              </div>
                            )}
                            <div
                              className={classNames(
                                "flex gap-[10px] items-center mb-2",
                                { "flex-col": !large }
                              )}
                            >
                              {large && <span>{uk}</span>}
                              <div className=" w-full flex-1 ">
                                <Form.Item
                                  noStyle
                                  name={[subField.name, "lexp"]}
                                  rules={[
                                    {
                                      validator(rule, value, callback) {
                                        const _v = normalize(value);
                                        if (!_v) {
                                          callback("请输入左侧表达式");
                                        }
                                      },
                                    },
                                  ]}
                                >
                                  {/* <FormField fieldType="Input" placeholder={props.placeholder} /> */}
                                  <FormInput placeholder="请输入" />
                                </Form.Item>
                              </div>
                              <div className="w-full flex-1">
                                <Form.Item
                                  noStyle
                                  name={[subField.name, "operate"]}
                                  rules={[
                                    {
                                      required: true,
                                      message: "请选择操作",
                                    },
                                  ]}
                                >
                                  <Select
                                    options={operators}
                                    placeholder="请选择操作"
                                    style={{
                                      width: "100%",
                                    }}
                                  />
                                </Form.Item>
                              </div>
                              <div className="w-full flex-1">
                                {[
                                  Operator.NotPresent,
                                  Operator.IsPresent,
                                ].includes(
                                  form.getFieldValue([
                                    "condition",
                                    field.name,
                                    "add",
                                    subField.name,
                                    "operate",
                                  ])
                                ) || (
                                  <Form.Item
                                    noStyle
                                    name={[subField.name, "rexp"]}
                                  >
                                    <FormInput placeholder="请输入" />
                                  </Form.Item>
                                )}
                              </div>
                              {large && (
                                <MinusOutlined
                                  onClick={() => {
                                    subOpt.remove(subField.name);
                                    if (subFields.length === 1) {
                                      remove(field.name);
                                    }
                                  }}
                                />
                              )}
                            </div>
                          </div>
                        );
                      })}
                      <Button
                        type="dashed"
                        onClick={() => subOpt.add()}
                        block
                        className="bg-inherit"
                      >
                        + 新增 且
                      </Button>
                    </div>
                  )}
                </Form.List>
              </Form.Item>
            </NewCard>
          ))}

          <Button
            type="dashed"
            onClick={() =>
              add({
                add: [{}],
              })
            }
            block
          >
            + 新增 或
          </Button>
        </div>
      )}
    </Form.List>
  );
};

export default ConditionEditor;
