import express from 'express';
import { getDatabase, ref, set, child, get } from "firebase/database";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, updateEmail} from "firebase/auth";
import firebaseConfig from "../firebaseConfig.json" assert { type: "json" };
import {initializeApp} from 'firebase/app';
import {saveProjectId, GetProjectId} from '../savepid.js';
const userRouter = express.Router();
const firebase = initializeApp(firebaseConfig);
const auth = getAuth(firebase);

// Login route
userRouter.post('/login', (req, res) => {
  if (!req.body)
    res.send('Please enter your signup credentials.');
  const password = req.body.password;
  const email = req.body.email;
  const database = getDatabase(firebase);
  const dbRef = ref(database);

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      let user = userCredential.user;
      get(child(dbRef, "users/" + user.uid)).then((snapshot) => {
        if (snapshot.exists()) {
          let db_user = snapshot.val();
          let puid = GetProjectId();
          if (puid != db_user.project_id) {
            res.status(400).send('Error signing in user, unknown user');
          } else
            res.status(200).json({ message: 'User signed in successfully', token: user.stsTokenManager.accessToken });
        } else
          res.status(400).json({ message: 'Error signing in user, unknown user'});
      })
    })
    .catch((error) => {
      // error signing in user
      console.log(error);
      res.status(400).send({ message: `Error signing in user: ${error}`});
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
    let user = userCredential.user;
    const database = getDatabase(firebase);
    let pid = GetProjectId();
    if (pid == "") {
      saveProjectId(user.uid);
      set(ref(database, 'users/' + user.uid), {
        mail: user.email,
        project_id: user.uid
      });
    } else {
      set(ref(database, 'users/' + user.uid), {
        mail: user.email,
        project_id: pid
      });
    }
    res.status(200).json({ message: 'User created successfully', user: user });
  })
  .catch((error) => {
    // error creating user
    res.status(400).send(`Error creating user: ${error}`);
  });
});

// Signout route
userRouter.post('/signout', (req, res) => {
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