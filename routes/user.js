import express from 'express';
import { getDatabase, ref, set, child, get, remove, update, query, equalTo} from "firebase/database";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, updateEmail} from "firebase/auth";
import firebaseConfig from "../firebaseConfig.json" assert { type: "json" };
import {initializeApp} from 'firebase/app';
import {saveProjectId, GetProjectId} from '../savepid.js';
const userRouter = express.Router();
const firebase = initializeApp(firebaseConfig);
const auth = getAuth(firebase);
const database = getDatabase(firebase);
const dbRef = ref(database);


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
      get(child(dbRef, "users/" + user.uid)).then((snapshot) => {
        if (snapshot.exists()) {
          let db_user = snapshot.val();
          let puid = GetProjectId();
          console.log(puid)
          console.log(db_user)
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

// Get User Rights

userRouter.get('/userRights', async (req, res) => {
  let rights = null;

  try {
    const snapshot = await get(child(dbRef, "users/" + user.uid));

    if (snapshot.exists()) {
      let db_user = snapshot.val();
      console.log(db_user);
      rights = db_user.rights;
      res.json({ rights });
      res.status(200).json({ message: 'Rights get successfully'});
    } else {
      res.status(400).json({ message: 'Error, unknown user' });
    }
  } catch (error) {
    // error getting rights
    res.status(400).send(`Error getting rights: ${error}`);
  }
});



// Change User Rights

userRouter.post('/changeUserRights', async (req, res) => {
  try {
    console.log(req.body);
    const dbRef = ref(getDatabase());
    const uid = req.body.uid;
    const snapshot = await get(child(dbRef, "users/" + uid));

    if (snapshot.exists()) {
      const newRights = req.body.newRights;
      await update(child(dbRef, "users/" + uid), { rights: newRights });
      res.status(200).json({ message: 'Rights changed successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    // error changing rights
    res.status(400).send(`Error changing rights: ${error}`);
  }
});

// Delete User

userRouter.delete('/deleteUser', async (req, res) => {
  const uid = req.body.uid;

  try {
    const snapshot = await get(child(dbRef, "users/" + uid));

    if (snapshot.exists()) {
      await remove(child(dbRef, "users/" + uid));
      res.json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    // error deleting user
    res.status(400).send(`Error deleting user: ${error}`);
  }
});

userRouter.get('/usersByProjectId', async (req, res) => {
  let project_id = GetProjectId();
  const filteredUsers = [];
  try {
    const usersSnapshot = await get(child(dbRef, "users/"));
    if (usersSnapshot.exists()) {
      const users = usersSnapshot.val();

      for (const key in users) {
        if (users[key].project_id === project_id) {
          filteredUsers.push({ [key]: users[key] });
        }
      }
      console.log(users)
      res.status(200).json(filteredUsers);
    } else {
      res.status(404).json({ message: 'No users found for the given project_id' });
    }
  } catch (error) {
    // Erreur lors de la récupération des utilisateurs
    res.status(400).send(`Error fetching users: ${error}`);
  }
});

export default userRouter;