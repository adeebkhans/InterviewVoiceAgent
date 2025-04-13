require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const authRoutes = require('./Routes/AuthRoutes.js');
const jobRoutes = require('./Routes/JobRoutes.js');
const db = require('./config/database');
const candidateRoutes = require('./Routes/CandidateRoutes');
const appointmentRoutes = require('./Routes/AppointmentRoutes');
const conversationRoutes = require('./Routes/ConversationRoutes');
const cors = require('cors')
const voiceAgentRoutes = require('./Routes/voiceAgentRoutes');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
    cors({
      origin: ["http://localhost:5173"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    })
  );

// Cookie security options
app.use((req, res, next) => {
    res.cookie('cookieName', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: 'strict',
        path: '/'
    });
    next();
});

app.use('/api/auth', authRoutes);
app.use('/api/job', jobRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/voice', voiceAgentRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});
