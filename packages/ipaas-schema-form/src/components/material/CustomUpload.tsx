import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import classNames from "classnames";
import {
  CloudUploadOutlined,
  DeleteOutlined,
  FileOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { IPaasCommonFormFieldProps } from "@/type";
import { message, Popover } from "antd";
import { getLocals } from "@/utils";
import { useIpaasSchemaStore } from "@/store";

const textAsFile = (text: string, fileExtension: string = "txt") => {
  // 创建一个Blob对象，其内容是文本数据
  const blob = new Blob([text], { type: "text/plain" });

  // 生成文件名：当前时间戳_随机数.fileExtension
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 1000);
  const filename = `text_${timestamp}_${random}.${fileExtension}`;

  // 创建一个File对象
  const file = new File([blob], filename, { type: "text/plain" });
  return file;
};

export type IPaasUploadProps = IPaasCommonFormFieldProps;

const CustomUpload = (props: IPaasUploadProps) => {
  const { value } = props;
  const { uploadFile: uploadFunc } = useIpaasSchemaStore();
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputId = useMemo(() => {
    return "fileInput" + Date.now();
  }, []);
  const [uploadList, setUploadList] = useState<
    {
      fileName: string;
      loading: boolean;
    }[]
  >([] as any[]);

  useEffect(() => {
    if (value) {
      setUploadList([
        {
          fileName: value,
          loading: false,
        },
      ]);
    }
  }, [value]);

  const onFileDelete = (fileName: string) => {
    setUploadList((prev) => prev.filter((file) => file.fileName !== fileName));
  };

  const onFileUpload = (files: File[]) => {
    fileInputRef.current && (fileInputRef.current.value = "");
    const _file = files[0];
    if (!_file || !uploadFunc) {
      message.error(getLocals().uploadImpError);
      return console.error(getLocals().uploadImpError);
    }
    if (_file.size > 20 * 1024 * 1024) {
      message.error(getLocals().uploadFileSizeError);
      return console.error(getLocals().uploadFileSizeError);
    }

    setUploadList(
      [_file].map((file) => ({
        fileName: file.name,
        loading: true,
      }))
    );

    uploadFunc(_file).then((res: string) => {
      setUploadList((prev) =>
        prev.map((file) => {
          if (file.fileName === _file.name) {
            return {
              fileName: file.fileName,
              loading: false,
            };
          }
          return file;
        })
      );
      props.onChange && props.onChange(res);
    });
  };

  const handleDrag: React.DragEventHandler<HTMLLabelElement> = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
    },
    []
  );

  const handleDragIn: React.DragEventHandler<HTMLLabelElement> = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
        setDragging(true);
      }
    },
    []
  );

  const handleDragOut: React.DragEventHandler<HTMLLabelElement> = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragging(false);
    },
    []
  );

  const handleDrop: React.DragEventHandler<HTMLLabelElement> = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        onFileUpload(Array.from(e.dataTransfer.files));
        e.dataTransfer.clearData();
      }
    },
    [onFileUpload]
  );

  const handlePaste: React.ClipboardEventHandler<HTMLLabelElement> =
    useCallback(
      (e) => {
        const items = e.clipboardData.items;
        const files: File[] = [];
        const promiseList: Promise<any>[] = [];
        for (const item of items) {
          promiseList.push(
            new Promise<void>((resolve) => {
              if (item.kind === "file") {
                const _f = item.getAsFile();
                _f && files.push(_f);
                resolve();
              } else if (item.kind === "string" && item.type === "text/plain") {
                item.getAsString((string) => {
                  files.push(textAsFile(string));
                  resolve();
                });
              } else {
                resolve();
              }
            })
          );
        }
        Promise.all(promiseList).then(() => {
          onFileUpload(files);
        });
      },
      [onFileUpload]
    );

  const handleFileSelect: React.ChangeEventHandler<HTMLInputElement> =
    useCallback(
      (e) => {
        e.target.files && onFileUpload(Array.from(e.target.files));
      },
      [onFileUpload]
    );

  return (
    <div className="custom-upload">
      <div
        className={classNames("upload-btn", {
          hidden: uploadList.length > 0,
        })}
      >
        <input
          type="file"
          onChange={handleFileSelect}
          className="hidden"
          style={{
            display: "none",
          }}
          id={fileInputId}
          ref={fileInputRef}
        />
        <label
          htmlFor={fileInputId}
          onDragEnter={handleDragIn}
          onDragLeave={handleDragOut}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onPaste={handlePaste}
          className={classNames(
            " relative flex h-[32px] cursor-pointer items-center justify-center gap-[10px] rounded-[4px] border border-dashed border-gray-400 bg-fill-bg hover:border-[#426ff1] hover:bg-[#eff4ff]",
            {
              "border-[#426ff1] bg-[#eff4ff]": dragging,
            }
          )}
        >
          <div className="pointer-events-none relative inline-flex flex-[0_0_auto] items-center justify-center gap-[4px]">
            <CloudUploadOutlined />
            <div className="relative mt-[-1.00px] w-fit font-normal leading-[normal] tracking-[0] text-primary-black [font-family:'PingFang_SC-Regular',Helvetica]">
              {getLocals().drag_and_drop}
            </div>
          </div>
        </label>
      </div>

      <div className="upload-list">
        {uploadList.map(({ fileName, loading }) => {
          const fileContent = (
            <div className="relative flex h-[32px] flex-1 grow items-center overflow-hidden rounded-[4px] bg-[#f7f8fa] px-[12px] py-[7px]">
              <div className="relative flex flex-1 grow items-center gap-[12px] overflow-hidden">
                <FileOutlined className="text-[#888F9D]" />
                <div className="relative mt-[-1.00px] w-fit overflow-hidden text-ellipsis whitespace-nowrap">
                  {loading ? getLocals().uploading : value}
                </div>
              </div>
              {loading && (
                <div className="relative inline-flex flex-[0_0_auto] items-center gap-[4px] text-[#888F9D]">
                  <LoadingOutlined />
                  <div className="relative mt-[-1.00px] w-fit text-[14px] ">
                    {getLocals().uploading}
                  </div>
                </div>
              )}
            </div>
          );
          return (
            <div
              key={fileName}
              className="relative flex items-center gap-[8px]  py-0 pl-0 pr-[8px]"
            >
              {!loading ? (
                <Popover content={value} title={getLocals().file_url}>
                  {fileContent}
                </Popover>
              ) : (
                fileContent
              )}
              {
                <DeleteOutlined
                  className=" cursor-pointer text-[#888F9D]"
                  onClick={() => {
                    onFileDelete(fileName);
                  }}
                />
              }
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CustomUpload;
