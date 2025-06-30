import PreviewDevFormex from "./PreviewDevFormex";

export default function EditArea() {
  return (
    <div className="flex flex-col h-full ">
      <div className=" h-[40px] flex-shrink-0 bg-white border-b border-gray-300  flex items-center justify-center text-sm font-semibold text-gray-600">
        预览
      </div>
      <div className="editor-area-container flex justify-center h-1 flex-1 overflow-auto p-10">
        {/* <div className="device rounded-2xl bg-white  border border-gray-200 shadow-md w-[375px] min-h-[667px] overflow-hidden">
          <PreviewDevFormex />
        </div> */}
        <div className="relative bg-white shadow-2xl rounded-xl  w-[800px] flex flex-col h-full">
          <div className="h flex justify-center relative bg-[#212936] p-2 flex-shrink-0 rounded-t-xl overflow-hidden">
            <div className=" absolute flex gap-1.5 left-4 top-4">
              <div className="circle rounded-full bg-[#686e77] w-3 h-3"></div>
              <div className="circle rounded-full bg-[#565c66] w-3 h-3"></div>
              <div className="circle rounded-full bg-[#454b56] w-3 h-3"></div>
            </div>
            <div className="u bg-[#58606d] p-1 px-10 text-[#cccccc] rounded-md text-xs font-semibold ">
              表单预览
            </div>
          </div>
          <main className=" h-1 flex-1">
            <PreviewDevFormex />
          </main>
        </div>
      </div>
    </div>
  );
}
