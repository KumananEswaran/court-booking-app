import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pool from './db.js';

const app = express();
app.use(cors());
app.use(express.json());

// Register a user
app.post('/register', async (req, res) => {
	try {
		console.log('Received data:', req.body);

		const { uid, name, email, phone } = req.body;
		const query =
			'INSERT INTO users (uid, name, email, phone) VALUES ($1, $2, $3, $4)';
		await pool.query(query, [uid, name, email, phone]);
		res.status(201).json({ message: 'User registered successfully' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Error saving user data' });
	}
});

// Fetch a user by UID
app.get('/user/:uid', async (req, res) => {
	try {
		const { uid } = req.params;
		const query = 'SELECT * FROM users WHERE uid = $1';
		const result = await pool.query(query, [uid]);

		if (result.rows.length > 0) {
			res.json(result.rows[0]);
		} else {
			res.status(404).json({ message: 'User not found' });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Error fetching user data' });
	}
});

// Fetch all bookings
app.get('/bookings', async (req, res) => {
	try {
		const result = await pool.query('SELECT * FROM bookings');
		res.json(result.rows);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Add a new booking
app.post('/bookings', async (req, res) => {
	const { uid, court_name, booking_date, booking_time } = req.body;
	try {
		await pool.query(
			'INSERT INTO bookings (uid, court_name, booking_date, booking_time) VALUES ($1, $2, $3, $4)',
			[uid, court_name, booking_date, booking_time]
		);
		res.json({ success: true });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Update a booking
app.put('/bookings/:id', async (req, res) => {
	const { id } = req.params;
	const { booking_date, booking_time } = req.body;

	try {
		const query =
			'UPDATE bookings SET booking_date = $1, booking_time = $2 WHERE id = $3';
		await pool.query(query, [booking_date, booking_time, id]);
		res.json({ message: 'Booking updated successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Delete a booking
app.delete('/bookings/:id', async (req, res) => {
	const { id } = req.params;

	try {
		await pool.query('DELETE FROM bookings WHERE id = $1', [id]);
		res.json({ message: 'Booking deleted successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

app.get('/', (req, res) => {
	res.send('Court Booking API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
