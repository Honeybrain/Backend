const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, updateEmail } = require("firebase/auth");
const firebaseConfig = require("../firebaseConfig.json");
const { getDatabase, ref, set, child, get } = require("firebase/database");
const { initializeApp } = require('firebase/app');
const messages = require('../protos/user_pb');
const { saveProjectId, GetProjectId } = require('../utils/savepid');

const firebase = initializeApp(firebaseConfig);
const auth = getAuth(firebase);

function signIn(call, callback) {
    const email = call.request.getEmail();
    const password = call.request.getPassword();

    const database = getDatabase(firebase);
    const dbRef = ref(database);

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            let user = userCredential.user;
            get(child(dbRef, "users/" + user.uid)).then((snapshot) => {
                if (snapshot.exists()) {
                    let db_user = snapshot.val();
                    let puid = GetProjectId();
                    if (puid === db_user.project_id) {
                        const reply = new messages.UserResponse();
                        reply.setMessage('User signed in successfully');
                        reply.setToken(user.stsTokenManager.accessToken);
                        callback(null, reply);
                    }
                }
            })
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

module.exports = {
    signIn: signIn,
    signUp: signUp,
    signOut: signOut,
    resetPassword: resetPassword,
    changeEmail: changeEmail
};
