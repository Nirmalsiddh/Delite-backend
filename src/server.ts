import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import session from 'express-session';
import passport from 'passport';
import './config/passport';
import noteRoutes from './routes/noteRoutes';

dotenv.config();
const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// connect to DB
connectDB();

app.use(
  session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

app.get('/', (req, res) => {
  res.send('API is working ');
});

// start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
