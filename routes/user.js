import express from 'express';
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, updateEmail} from "firebase/auth";
import firebaseConfig from "../firebaseConfig.json" assert { type: "json" };
import {initializeApp} from 'firebase/app';

const userRouter = express.Router();
const firebase = initializeApp(firebaseConfig);
const auth = getAuth(firebase);
let user = null;

// Login route
userRouter.post('/login', (req, res) => {
  if (!req.body)
    res.send('Please enter your signup credentials.');
  const password = req.body.password;
  const email = req.body.email;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      user = userCredential.user;
      const token = user.stsTokenManager.accessToken;
      // user signed in successfully
      res.status(200).json({ message: 'User signed in successfully', token: token });
    })
    .catch((error) => {
      // error signing in user
      console.log(error);
      res.status(400).send(`Error signing in user: ${error}`);
    });
});

// Change Passsword
userRouter.post('/resetPassword', (req, res) => {
  if (!req.body)
    res.send('Please enter your signup credentials.');
  const email = req.body.email;

  console.log(req.body);
  sendPasswordResetEmail(auth, email)
  .then((userCredential) => {
    //user = userCredential.user;
    // email sent successfully
    console.log(userCredential);
    res.status(200).json({ message: 'Reset email sent successfully'});
  })
  .catch((error) => {
    // error changing password
    res.status(400).send(`Error creating user: ${error}`);
  });
});

// Signup route
userRouter.post('/signup', (req, res) => {
  if (!req.body)
    res.send('Please enter your signup credentials.');
  const password = req.body.password;
  const email = req.body.email;

  console.log(req.body);
  createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // user created successfully
    user = userCredential.user;
    res.status(200).json({ message: 'User created successfully', user: user });
  })
  .catch((error) => {
    // error creating user
    res.status(400).send(`Error creating user: ${error}`);
  });
});

// Signout route
userRouter.post('/signout', (req, res) => {
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

// Change Email route

userRouter.post('/changeEmail', (req, res) => {
  if (!req.body)
    res.send('Please enter your signup credentials.');
  const newEmail = req.body.newEmail;

  console.log(newEmail);
  console.log(auth.currentUser)
  updateEmail(auth.currentUser, newEmail)
  .then(() => {
    res.status(200).json({ message: 'Change successfully'});
  })
  .catch((error) => {
    // error changing email
    res.status(400).send(`Error creating user: ${error}`);
  });
});

  export default userRouter;