import userRouter from "./routes/user.js";
import honeypotRouter from "./routes/honeypot.js";
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
// Express conf
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Routers
app.use('/honeypot', honeypotRouter);
app.use("/user", userRouter);

// Home route
app.get('/', (req, res) => {
  res.send('Welcome to our website!');
});

// About route
app.get('/about', (req, res) => {
  res.send('This is our company information.');
});

// Contact route
app.get('/contact', (req, res) => {
  res.send('Please fill out the contact form to get in touch with us.');
});

// 404 route
app.use((req, res) => {
  res.status(404).send('Page not found.');
});

// Start server
app.listen(8000, () => {
  console.log('Server started on port 8000');
});

