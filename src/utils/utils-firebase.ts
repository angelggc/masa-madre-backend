import {
  ref,
  getDownloadURL,
  uploadBytesResumable,
  UploadResult,
  deleteObject,
} from "firebase/storage";
import { storage } from "../middlewares/upload-middleware";
import { Buffer } from "buffer";

export interface File {
  mimetype: string;
  buffer: Buffer;
}

const uploadFile = async (
  file: File,
  folder: string,
  fileName: string
): Promise<string | Error> => {
  try {
    const storageRef = ref(storage, `${folder}/${fileName}`);
    const metadata = {
      contentType: file.mimetype,
    };

    const snapshot: UploadResult = await uploadBytesResumable(
      storageRef,
      file.buffer,
      metadata
    );
    const downloadURL: string = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    return error as Error;
  }
};

const deleteFile = async (folder: string, fileName: string) => {
  try {
    const imageRef = ref(storage, `${folder}/${fileName}`);
    await deleteObject(imageRef);
    return `Imagen ${fileName} en la carpeta ${folder} eliminada correctamente.`;
  } catch (error) {
    console.error("Error al eliminar la imagen:", error);
  }
};

export { uploadFile, deleteFile };
