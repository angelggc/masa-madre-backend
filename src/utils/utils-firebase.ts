import {
  ref,
  getDownloadURL,
  uploadBytesResumable,
  UploadResult,
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

export { uploadFile };
