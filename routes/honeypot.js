import express from 'express';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

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
 
// Route to get blacklisted IP
honeypotRouter.get('/blacklist', (req, res) => {
    // Read the file
    const data = fs.readFileSync(path.join(process.cwd(), '/honeypot/block.conf'), 'utf8');

    // Regular expression to match IP addresses
    const regex = /deny\s+((?:\d{1,3}\.){3}\d{1,3});/g;

    let match;
    let ips = [];

    while ((match = regex.exec(data)) !== null) {
    // Push the matched IP address to the array
    ips.push(match[1]);
    }

    // Respond with the array of IP addresses
    res.json(ips);
});

// Route to get blacklisted IP
honeypotRouter.post('/blacklist', (req, res) => {
    console.log(res.body);
    
    // Extract IP address from request body
    const { ip } = req.body;

    if (!ip) {
        return res.status(400).json({ error: 'IP address is required' });
    }

    // Define the command
    const cmd = `docker exec fail2ban fail2ban-client set nginx-honeypot banip ${ip}`;

    // Execute the command
    exec(cmd, (error, stdout, stderr) => {
    if (error) {
        console.error(`exec error: ${error}`);
        return res.status(500).json({ error: 'Failed to execute command' });
    }

    // On success, return a message
    res.json({ message: `IP ${ip} banned successfully` });
    });
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