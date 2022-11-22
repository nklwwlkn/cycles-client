import { FirebaseOptions, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

if (
  !process.env.REACT_APP_API_KEY ||
  !process.env.REACT_APP_AUTH_DOMAIN ||
  !process.env.REACT_APP_PROJECT_ID ||
  !process.env.REACT_APP_STORAGE_BUCKET ||
  !process.env.REACT_APP_MESSANGING_SENDER_ID ||
  !process.env.REACT_APP_ID ||
  !process.env.REACT_APP_MEASUREMENT_ID
) {
  throw new Error('Missing Firebase configuration')
}

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSANGING_SENDER_ID,
  appId: process.env.REACT_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
