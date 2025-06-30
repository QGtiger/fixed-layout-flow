function uploadFile(config: { blob: Blob; name: string }): Promise<string> {
  const formData = new FormData();
  formData.append("file", config.blob);
  formData.append("filename", config.name);

  // TODO 先用测试环境的
  return fetch("https://front-gw.yingdao.com/gw-api/upload/file", {
    headers: {
      domain: "front-gw.yingdao.com",
      ContentType: "multipart/form-data",
    },
    method: "POST",
    body: formData,
  })
    .then((r) => r.json())
    .then((r) => r.data.readUrl);
}

function convertFileToBlob(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        resolve(new Blob([event.target.result], { type: file.type }));
      } else {
        reject(new Error("Failed to read file"));
      }
    };
    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };
    reader.readAsArrayBuffer(file);
  });
}

// 图片上传钩子
export const handleImageUpload = async (
  file: File,
  callback: (urL: string, desc: string) => void
) => {
  try {
    const name = file.name || "image.png";
    const blob = await convertFileToBlob(file);
    const url = await uploadFile({
      blob,
      name,
    });

    // 4. 插入编辑器
    callback(url, name);
  } catch (error) {
    console.error("上传失败:", error);
    callback("", "上传失败");
  }
};

export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}
