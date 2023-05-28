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

// Route to remove IP from blacklist
honeypotRouter.post('/whitelist', (req, res) => {
    // Extract the IP address from the request body
    const { ip } = req.body;
  
    if (!ip) {
        return res.status(400).json({ error: 'IP address is required' });
    }
  
    // Read the file
    const filePath = path.join(process.cwd(), '/honeypot/block.conf');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to read block.conf file' });
        }
  
        // Remove the line containing the IP address
        const newData = data.replace(new RegExp(`deny ${ip};\n`, 'g'), '');
    
        // Write the updated content back to the file
        fs.writeFile(filePath, newData, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Failed to update block.conf file' });
            }

            // Execute the unbanip command
            const cmd = `docker exec fail2ban fail2ban-client set nginx-honeypot unbanip ${ip}`;
            exec(cmd, (error, stdout, stderr) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                    return res.status(500).json({ error: 'Failed to execute unbanip nginx-honeypot' });
                }
            });

            const cmd2 = `docker exec fail2ban fail2ban-client set iptables-honeypot unbanip ${ip}`;
            exec(cmd2, (error, stdout, stderr) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                    return res.status(500).json({ error: 'Failed to execute unbanip iptables-honeypot' });
                }
            });

            // On success, return a success message
            res.json({ message: `IP ${ip} removed from the blacklist and unblocked successfully` });
        });
    });
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
            return res.status(500).json({ error: 'Failed to execute nginx-honeypot banip' });
        }
    });

    const cmd2 = `docker exec fail2ban fail2ban-client set iptables-honeypot banip ${ip}`;
  
    // Execute the command
    exec(cmd2, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).json({ error: 'Failed to execute iptables-honeypot banip' });
        }
    });

    // On success, return a message
    res.json({ message: `IP ${ip} banned successfully` });
});
  

honeypotRouter.get('/logs', (req, res) => {
    // Define the path of the log file
    const data = fs.readFileSync(path.join(process.cwd(), '/honeypot/fast.log'), 'utf8');
    res.send(data);
});

honeypotRouter.get('/containers', (req, res) => {
    exec('docker network inspect honeypot_honeypot_network --format "{{json .Containers}}"', (err, stdout1, stderr) => {
        if (err) {
            console.error(`exec error: ${err}`);
            return;
        }

        const networkContainers = JSON.parse(stdout1);
        const containerIds = Object.keys(networkContainers);

        exec('docker ps --format \'{"ID":"{{.ID}}", "Image":"{{.Image}}", "Command":{{json .Command}}, "CreatedSince":"{{.RunningFor}}", "Status":"{{.Status}}", "Ports":"{{.Ports}}", "Names":"{{.Names}}"}\'', (err, stdout2, stderr) => {
            if (err) {
                console.error(`exec error: ${err}`);
                return;
            }

            const runningContainers = JSON.parse(`[${stdout2.split("\n").filter(Boolean).join(",")}]`);
            const honeypotContainers = runningContainers.filter(container => containerIds.some(id => id.startsWith(container.ID)));

            const containersData = honeypotContainers.map(container => {
                // Find the key in networkContainers that starts with the container ID
                const networkContainerKey = Object.keys(networkContainers).find(key => key.startsWith(container.ID));

                // Use the found key to access networkContainers
                const networkContainer = networkContainerKey ? networkContainers[networkContainerKey] : undefined;

                return {
                    name: container.Names,
                    status: container.Status,
                    ip: networkContainer ? networkContainer.IPv4Address : 'Not found',
                };
            });

            res.send(containersData);
        });
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