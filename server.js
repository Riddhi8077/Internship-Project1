const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 40001;

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON request bodies

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Your email (from .env file)
        pass: process.env.EMAIL_PASS // Your app password (from .env file)
    }
});

// Test endpoint to check if the server is running
app.get('/test', (req, res) => {
    res.send('Server is running!');
});

// Endpoint to send booking confirmation email
app.post('/send-booking-email', (req, res) => {
    console.log('Request received:', req.body); // Log the request body

    const { email, name, bookingId, dates, price, cancellationPolicy } = req.body;

    // Validate request body
    if (!email || !name || !bookingId || !dates || price === undefined || !cancellationPolicy) {
        console.log('Missing required fields:', { email, name, bookingId, dates, price, cancellationPolicy }); // Log missing fields
        return res.status(400).json({ error: 'Missing required fields in the request body.' });
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Booking Confirmation',
        html: `
            <h1>Booking Confirmation</h1>
            <p>Your booking has been confirmed. Below are the details:</p>
            <ul>
                <li><strong>Booking ID:</strong> ${bookingId}</li>
                <li><strong>Dates:</strong> ${dates}</li>
                <li><strong>Price:</strong> $${price}</li>
                <li><strong>Cancellation Policy:</strong> ${cancellationPolicy}</li>
            </ul>
            <p>Thank you for choosing us!</p>
            <p>Support Contact: support@nullclass.com</p>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            res.status(500).json({ error: 'Error sending email: ' + error.message });
        } else {
            console.log('Email sent: ' + info.response);
            res.status(200).json({ message: 'Email sent successfully' });
        }
    });
});

// Function to start the server
const startServer = (port) => {
    const server = app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`); // Corrected console.log
    });

    // Handle port conflicts
    server.on('error', (error) => {
        if (error.code === 'EADDRINUSE') {
            console.log(`Port ${port} is already in use. Trying another port...`); // Corrected console.log
            startServer(port + 1); // Try the next port
        } else {
            console.error('Server error:', error);
        }
    });
};

// Start the server
startServer(PORT);