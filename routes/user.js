const express = require("express");
const router = express.Router();



router.use(express.static(__dirname + '/pages'));

router.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

router.route('/login')
  .get((req, res) => {
    res.send('Login')
  })


router.route('/logout')
  .get((req, res) => {
    res.send('Logout')
  })

router.route('/register')
  .post((req, res) => {
    res.send('register')
  })



module.exports = router;