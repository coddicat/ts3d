// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDHvblsgljieh_bgPwVh8uhGcQTBqQiHFI',
  authDomain: 'raycastingjs.firebaseapp.com',
  projectId: 'raycastingjs',
  storageBucket: 'raycastingjs.appspot.com',
  messagingSenderId: '446922510855',
  appId: '1:446922510855:web:d8fe8a995200b2d4ea90a2',
  measurementId: 'G-6VQJJ55KTR'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
getAnalytics(app);
