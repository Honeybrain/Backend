import express from 'express';

const honeypotRouter = express.Router();
honeypotRouter.use(express.urlencoded({ extended: false }));

// main route for honeypots
honeypotRouter.get('/', (req, res) => {
    res.send('routes for the honeypots !');
});

// Route to whitlist users
honeypotRouter.get('/whitelist', (req, res) => {
    res.send('please send you whitelist here !');
});
 
// Route to blacklist users
honeypotRouter.get('/blacklist', (req, res) => {
    res.send('please send you blacklist here !');
});

// Route to fetch data of the honeypot
honeypotRouter.post('/fetch-data', (req, res) => {
    const data = req.body;
    console.log(data);
    if (data && data.length > 0) {
    res.send('data received !');
    } else {
        res.status(404).send('no data received !');
    }
});

// Route to fetch the owner connections of the honeypot
honeypotRouter.post('/fetch-owner-connection', (req, res) => {
    const data = req.body;
    console.log(data);
    if (data && data.length > 0) {
    res.send('owner connection received !');
    } else {
        res.status(404).send('no data received !');
    }
});

// Route to update the settings of the honeypot of the honeypot
honeypotRouter.post('/update-settings', (req, res) => {
    const data = JSON.stringify("data will be here");
    res.send(data);
});

export default honeypotRouter;