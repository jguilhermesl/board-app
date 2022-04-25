import firebase from 'firebase/app'
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyAG_I0_A-chcObXpBsB-IFAFC_iRA3gh2o",
    authDomain: "boardapp-6f4af.firebaseapp.com",
    projectId: "boardapp-6f4af",
    storageBucket: "boardapp-6f4af.appspot.com",
    messagingSenderId: "491268145887",
    appId: "1:491268145887:web:8b69c2c596c36d95761f6a",
    measurementId: "G-YTYNDT31NJ"
  };

  if(!firebase.apps.length){
      firebase.initializeApp(firebaseConfig)
  }

  export default firebase;