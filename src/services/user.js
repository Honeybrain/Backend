const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, updateEmail } = require("firebase/auth");
const firebaseConfig = require("../firebaseConfig.json");
const { initializeApp } = require('firebase/app');
const messages = require('../protos/js/user_pb');

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

module.exports = {
    signIn: signIn,
    signUp: signUp,
    signOut: signOut,
    resetPassword: resetPassword,
    changeEmail: changeEmail
};
