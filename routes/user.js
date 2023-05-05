import express from 'express';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import firebaseConfig from "../firebaseConfig.json" assert { type: "json" };
import {initializeApp} from 'firebase/app';

const userRouter = express.Router();
const firebase = initializeApp(firebaseConfig);
const auth = getAuth(firebase);
let user = null;
// Login route
userRouter.get('/login', (req, res) => {
  if (!req.query)
    res.send('Please enter your signup credentials.');
  const password = req.query.password;
  const email = req.query.email;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      user = userCredential.user;
      // user signed in successfully
      res.status(200).send('User signed in successfully');
    })
    .catch((error) => {
      // error signing in user
      res.status(400).send(`Error signing in user: ${error}`);
    });
});

// Signup route
userRouter.get('/signup', (req, res) => {
  if (!req.query)
    res.send('Please enter your signup credentials.');
  const password = req.query.password;
  const email = req.query.email;

  createUserWithEmailAndPassword(auth, email, password)
  .then((userRecord) => {
    // user created successfully
    res.status(200).send('User created successfully');
  })
  .catch((error) => {
    // error creating user
    res.status(400).send(`Error creating user: ${error}`);
  });
});

// Signup route
userRouter.get('/signout', (req, res) => {
  user = null;
  auth.signOut()
  .then(() => {
    // user signed out successfully
    res.status(200).send('User signed out successfully');
  })
  .catch((error) => {
    // error signing out user
    res.status(400).send(`Error signing out user: ${error}`);
  });
});

  export default userRouter;