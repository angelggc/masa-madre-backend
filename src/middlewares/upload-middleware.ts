import multer from 'multer';
import firebaseConfig from '../config/firebase';
import firebase from 'firebase/compat/app'; // Importar firebase de esta manera
import { getStorage } from 'firebase/storage';

const app = firebase.initializeApp(firebaseConfig); // Usar firebase.initializeApp en lugar de initializeApp
const storage = getStorage(app);

const upload = multer({ storage: multer.memoryStorage() });

export { upload, storage };
