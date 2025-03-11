export function useFileUploader() {
  const cloudName = "djp7gmsgk";
  const apiKey = "713424869258163";
  const apiSecret = "-ea4-sCuDptgulpDd93l1ZecGgM";
  const folderName = "Documentos";

  const isUploading = ref(false);

  async function generateSignature(timestamp: number) {
    const stringToSign = `folder=${folderName}&timestamp=${timestamp}${apiSecret}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(stringToSign);
    const hashBuffer = await crypto.subtle.digest("SHA-1", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  }

  async function uploadFile(file: File) {
    if (!file) throw new Error("No se seleccionó un archivo.");

    isUploading.value = true;
    
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = await generateSignature(timestamp);

    const fileData = new FormData();
    fileData.append("file", file);
    fileData.append("api_key", apiKey);
    fileData.append("timestamp", String(timestamp));
    fileData.append("signature", signature);
    fileData.append("folder", folderName);
    fileData.append("resource_type", "image");

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: fileData
      });

      const data = await response.json();
      if (response.ok) {
        return { success: true, url: data.secure_url };
      } else {
        throw new Error(data.error?.message || "Error al subir archivo.");
      }
    } catch (error) {
      console.error("Error en la subida:", error);
      return { success: false, error: (error as Error).message };
    } finally {
      isUploading.value = false;
    }
  }

  return { uploadFile };
}
