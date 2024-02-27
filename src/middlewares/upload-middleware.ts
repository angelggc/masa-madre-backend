import multer from "multer";
import firebaseConfig from "../config/firebase";
import firebase from "firebase/compat/app";
import { getStorage } from "firebase/storage";

const app = firebase.initializeApp(firebaseConfig);
const storage = getStorage(app);

const upload = multer({
  storage: multer.memoryStorage(),
});

export { upload, storage };
