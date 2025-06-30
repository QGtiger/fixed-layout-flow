import Material from "./components/Material";
import EditArea from "./components/EditArea";
import Setting from "./components/Setting";

import Header from "./components/Header";
import { useEffect, useRef } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  SchemaStore,
  SchemaStoreConfig,
  StoreContext,
  createSchemaStore,
} from "@/stores/useSchemaStore";
import { ConfigProvider } from "antd";

import zhCN from "antd/locale/zh_CN";
import { FormexModel, FormexModelProps } from "@/stores/FormexModel";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import DragLayer from "./DragLayer";

const defaultObj = {
  disableSubmit: true,
};

export default function FormexDesignerEditor(
  props: {
    height?: number;
    title?: string;
    headerMenu?: React.ReactNode;
  } & SchemaStoreConfig &
    FormexModelProps
) {
  const { height, title, headerMenu } = props;
  const storeRef = useRef<SchemaStore>();

  if (!storeRef.current) {
    storeRef.current = createSchemaStore(props);
  }

  // useEffect(() => {
  //   const ele = document.getElementById("allotment-container");
  //   if (ele) {
  //     setTimeout(() => {
  //       ele.style.opacity = "1";
  //     }, 50);
  //   }
  // }, []);

  return (
    <div className="formex-designer">
      <ConfigProvider locale={zhCN}>
        <StoreContext.Provider value={storeRef.current}>
          <FormexModel.Provider
            value={{
              ...props,
              ...defaultObj,
            }}
          >
            <DndProvider backend={HTML5Backend}>
              <div
                className="h-[100vh] w-[100%] flex flex-col"
                style={{
                  height: height ? `${height}px` : "100vh",
                }}
              >
                <Header title={title} rightContent={headerMenu} />
                <PanelGroup direction="horizontal" autoSaveId="persistence">
                  <Panel defaultSize={30} minSize={15}>
                    <Material />
                  </Panel>
                  <PanelResizeHandle className="w-[1px] bg-gray-300" />
                  <Panel minSize={36} className="bg-[#e5e8ec]">
                    <EditArea />
                  </Panel>
                  <PanelResizeHandle className="w-[1px] bg-gray-300" />
                  <Panel defaultSize={30} minSize={20}>
                    <Setting />
                  </Panel>
                </PanelGroup>
                {/* <Allotment
                defaultSizes={[100]}
                id="allotment-container"
                className="opacity-0"
              >
                <Allotment.Pane
                  preferredSize={280}
                  maxSize={400}
                  minSize={200}
                >
                  <Material />
                </Allotment.Pane>
                <Allotment.Pane className="bg-[#e5e8ec]">
                  <EditArea />
                </Allotment.Pane>
                <Allotment.Pane
                  preferredSize={340}
                  maxSize={450}
                  minSize={300}
                >
                  <Setting />
                </Allotment.Pane>
              </Allotment> */}
              </div>

              {/* <div className=" relative">
              <DragLayer />
            </div> */}
            </DndProvider>
          </FormexModel.Provider>
        </StoreContext.Provider>
      </ConfigProvider>
    </div>
  );
}
