const express = require('express')

const user = require('./routes/user.js')

const honeypot = require('./routes/honeypot.js')

const app = express()

const hostname = "127.0.0.1";
const port = 8000;

app.use("/user", user);
app.use("/honeypot", honeypot);


// Démarrer le serveur et écouter un port donné
const PORT = 8000;

app.listen(PORT, () => {
  // Fonction éxecutée lorsque l'application a démarré
  console.log(`Serveur démarré : http://${hostname}:${PORT}`)
})