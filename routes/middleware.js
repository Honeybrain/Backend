import admin from 'firebase-admin';
import {initializeApp} from 'firebase/app';
import {getAuth} from "firebase/auth";
import firebaseConfig from "../firebaseConfig.json" assert { type: "json" };

const firebase = initializeApp(firebaseConfig);
const auth = getAuth(firebase);
admin.initializeApp(firebaseConfig)


const verifyToken = async (req, res, next) => {
  if (req.headers.authorization === undefined) {
    return res.status(401).json({ error: 'Unauthorized, no token' });
  }
  const idToken = req.headers.authorization;
  console.log(idToken);
  // Verify the ID token
  admin.auth().verifyIdToken(idToken).then((decodedToken) => {
    console.log('ID token successfully verified');
    //go to route
    next();
  }).catch((error) => {
    console.error('Error verifying ID token:', error);
    res.status(401).json({ error: 'Unauthorized' });
  });
};

export default verifyToken;