const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, updateEmail } = require("firebase/auth");
const firebaseConfig = require("../firebaseConfig.json");
const { initializeApp } = require('firebase/app');
const messages = require('../protos/user_pb');
const crypto = require('crypto');

const firebase = initializeApp(firebaseConfig);
const auth = getAuth(firebase);
let user = null;

function signIn(call, callback) {
    const email = call.request.getEmail();
    const password = call.request.getPassword();

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            user = userCredential.user;
            const token = user.stsTokenManager.accessToken;

            const reply = new messages.UserResponse();
            reply.setMessage('User signed in successfully');
            reply.setToken(token);
            callback(null, reply);
        })
        .catch((error) => {
            callback(error);
        });
}

function signUp(call, callback) {
    const email = call.request.getEmail();
    const password = call.request.getPassword();

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            user = userCredential.user;

            const reply = new messages.UserResponse();
            reply.setMessage('User created successfully');
            reply.setToken(user.stsTokenManager.accessToken);
            callback(null, reply);
        })
        .catch((error) => {
            callback(error);
        });
}

function signOut(call, callback) {
    user = null;
    auth.signOut()
        .then(() => {
            const reply = new messages.EmptyResponse();
            reply.setMessage('User signed out successfully');
            callback(null, reply);
        })
        .catch((error) => {
            callback(error);
        });
}

function resetPassword(call, callback) {
    const email = call.request.getEmail();

    sendPasswordResetEmail(auth, email)
        .then(() => {
            const reply = new messages.UserResponse();
            reply.setMessage('Reset email sent successfully');
            callback(null, reply);
        })
        .catch((error) => {
            callback(error);
        });
}

function changeEmail(call, callback) {
    const newEmail = call.request.getEmail();

    updateEmail(auth.currentUser, newEmail)
        .then(() => {
            const reply = new messages.UserResponse();
            reply.setMessage('Change successfully');
            callback(null, reply);
        })
        .catch((error) => {
            callback(error);
        });
}

async function userRights(call, callback) {
    let rights = null;
  
    try {
      const snapshot = await get(child(dbRef, "users/" + user.uid));
  
      if (snapshot.exists()) {
        let db_user = snapshot.val();
        rights = db_user.rights;
        //res.json({ rights });
        const reply = new messages.UserResponse();
        reply.userRights({ rights })
        reply.setMessage('Rights get successfully');
        callback(null, reply);
      } else {
        res.status(400).json({ message: 'Error, unknown user' });
      }
    } catch (error) {
        callback(error);
    }
  }

async function changeUserRights(call, callback) {
    try {
      const dbRef = ref(getDatabase());
      const uid = call.request.getUid()
      const snapshot = await get(child(dbRef, "users/" + uid));
  
      if (snapshot.exists()) {
        const newRights = req.body.newRights;
        await update(child(dbRef, "users/" + uid), { rights: newRights });
        const reply = new messages.UserResponse();
        reply.setMessage('Rights changed successfully');
        callback(null, reply);
      }
    } catch (error) {
        callback(error);
    }
  }

async function deleteUser(call, callback) {
const uid = call.request.getUid();
try {
    const snapshot = await get(child(dbRef, "users/" + uid));

    if (snapshot.exists()) {
    await remove(child(dbRef, "users/" + uid));
    const reply = new messages.UserResponse();
    reply.setMessage('User deleted successfully');
    callback(null, reply);
    }
} catch (error) {
    callback(error)
}
}

async function usersByProjectId(call, callback) {
let project_id = await GetProjectId();
const filteredUsers = [];
try {
    const usersSnapshot = await get(child(dbRef, "users/"));
    if (usersSnapshot.exists()) {
    const users = usersSnapshot.val();
    
    for (const key in users) {
        if (users[key].project_id == project_id) {
            filteredUsers.push({ [key]: users[key] });
        }
    }
    const reply = new messages.UserResponse();
    reply.setUsers(filteredUsers);
    reply.setMessage('User deleted successfully');
    callback(null, reply);
    }
} catch (error) {
    callback(error)
}
}

async function inviteUser(call, callback) {
const destinataire = call.request.getEmail();
const sujet = 'Création de compte honeybrain';
const token = crypto.randomBytes(32).toString('hex');
const message = 'Bonjour,\nAfin de créer votre compte honeybrain veuillez ouvrir le lien suivant: ' + token;
const expiryDate = new Date();
expiryDate.setHours(expiryDate.getHours() + 24);

set(ref(database, 'invits/' + token), {
    email: destinataire,
    expiryDate: expiryDate,
    isUsed: false,
});


const mailOptions = {
    from: `Honeybrain <${gmailConfig.user}>`,
    to: destinataire,
    subject: sujet,
    text: message
};

try {
    await transporter.sendMail(mailOptions);
    const reply = new messages.UserResponse();
    reply.setToken(token);
    reply.setMessage('Mail sent succesfully');
    callback(null, reply);
    //res.json({token: token});
} catch (error) {
    callback(error)
}
}

async function validateInvitation(call, callback) {
    const token = call.request.getToken();
    try {
        const snapshot = await get(child(dbRef, "invits/"));
        if (snapshot.isUsed == false) {
            set(ref(database, 'invits/' + token), {
                isUsed: true,
            });
            const reply = new messages.UserResponse();
            reply.setEmail(snapshot.email);
            reply.setMessage('Valid invitation');
            callback(null, reply);
        }
    } catch (error) {
        callback(error)
    }
}


module.exports = {
    signIn: signIn,
    signUp: signUp,
    signOut: signOut,
    resetPassword: resetPassword,
    changeEmail: changeEmail,
    userRights: userRights,
    changeUserRights: changeUserRights,
    deleteUser: deleteUser,
    usersByProjectId: usersByProjectId,
    inviteUser: inviteUser,
    validateInvitation: validateInvitation
};
