
import { initializeApp } from "firebase/app"
import { getAuth} from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getDatabase } from "firebase/database"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyCpjJP0FOb10iPzxiEpotk4dAPoY4uOU4w",
  authDomain: "test-41110.firebaseapp.com",
  databaseURL: "https://test-41110-default-rtdb.firebaseio.com",
  projectId: "test-41110",
  storageBucket: "test-41110.firebasestorage.app",
  messagingSenderId: "726178530704",
  appId: "1:726178530704:web:4682d04139c893f513df15",
  measurementId: "G-19BS4XKJBT"
}

const app = initializeApp(firebaseConfig)

const auth = getAuth(app)
const db = getFirestore(app)
const rtdb = getDatabase(app)
const storage = getStorage(app)

export { auth, db, rtdb, storage }

