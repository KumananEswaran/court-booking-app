import { useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment-timezone';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

// Custom Hook
import useBookings from '../hooks/useBookings';

// Components
import DateSelector from '../components/DateSelector';
import CourtCard from '../components/CourtCard';
import TimeSlots from '../components/TimeSlots';
import BookingForm from '../components/BookingForm';
import BookingsList from '../components/BookingsList';
import EditBookingForm from '../components/EditBookingForm';
import ReviewPage from './ReviewPage';

export default function HomePage() {
	const [user, setUser] = useState(() => {
		return JSON.parse(localStorage.getItem('user')) || null;
	});

	const navigate = useNavigate();

	// State for modals
	const [showModal, setShowModal] = useState(false);
	const [showBookingsModal, setShowBookingsModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);

	// State for booking form
	const [selectedCourt, setSelectedCourt] = useState('');
	const [selectedDate, setSelectedDate] = useState(
		moment().format('YYYY-MM-DD')
	);
	const [selectedTime, setSelectedTime] = useState('');

	// State for edit form
	const [editBookingId, setEditBookingId] = useState(null);
	const [editDate, setEditDate] = useState('');
	const [editTime, setEditTime] = useState('');

	// Court data
	const courts = [
		{
			id: 1,
			name: 'Court A',
			image:
				'https://images.unsplash.com/photo-1571354188019-9a5038b88457?q=80&w=1932&auto=format&fit=crop',
		},
		{
			id: 2,
			name: 'Court B',
			image:
				'https://images.unsplash.com/photo-1614632537190-23e4146777db?q=80&w=2070&auto=format&fit=crop',
		},
		{
			id: 3,
			name: 'Court C',
			image:
				'https://images.unsplash.com/photo-1516567727245-ad8c68f3ec93?q=80&w=1949&auto=format&fit=crop',
		},
	];

	// Use custom hook for bookings
	const {
		bookings,
		upcomingBookings,
		finishedBookings,
		loading,
		createBooking,
		updateBooking,
		deleteBooking,
	} = useBookings(user);

	// Modal handlers
	const handleClose = () => setShowModal(false);
	const handleShow = (courtName, time = '') => {
		setSelectedCourt(courtName);
		setSelectedTime(time);
		setShowModal(true);
	};

	// Auth handlers
	const handleLogout = () => {
		auth
			.signOut()
			.then(() => {
				toast.info('You have been logged out.');
				localStorage.removeItem('authToken');
				localStorage.removeItem('user');
				navigate('/login', { replace: true });
			})
			.catch((error) => {
				console.error('Logout Error:', error.message);
				toast.error('Failed to logout. Please try again');
			});
	};

	// Booking handlers
	const handleBooking = async () => {
		if (!selectedCourt || !selectedDate || !selectedTime) return;

		const result = await createBooking({
			court_name: selectedCourt,
			booking_date: selectedDate,
			booking_time: selectedTime,
		});

		if (result) {
			handleClose();
		}
	};

	const handleEdit = (booking) => {
		setEditBookingId(booking.id);
		setSelectedCourt(booking.court_name);
		setEditDate(booking.booking_date);
		setEditTime(booking.booking_time);
		setShowEditModal(true);
	};

	const handleUpdate = async () => {
		const success = await updateBooking(editBookingId, {
			booking_date: editDate,
			booking_time: editTime,
		});

		if (success) {
			setShowEditModal(false);
		}
	};

	const handleDelete = async (bookingId) => {
		await deleteBooking(bookingId);
	};

	return (
		<div className="bg-light">
			<ToastContainer />
			<div
				className="text-center text-white py-5"
				style={{ backgroundColor: '#80CBC4' }}>
				<h1 className="display-4 fw-bold">⚽ KickOff Arena ⚽</h1>
				<h3>Welcome, {user?.name}!</h3>
				<div className="mt-3">
					<Button
						variant="outline-light"
						className="me-2"
						onClick={() => setShowBookingsModal(true)}>
						View Bookings
					</Button>
					<Button variant="dark" onClick={() => handleShow('')}>
						Book Now
					</Button>
				</div>
				<Button
					variant="danger"
					onClick={handleLogout}
					className="position-absolute top-0 end-0 m-3">
					Logout
				</Button>
			</div>

			<Container className="py-4">
				<DateSelector
					selectedDate={selectedDate}
					setSelectedDate={setSelectedDate}
				/>

				{courts.map((court) => (
					<Row key={court.id} className="mb-4 align-items-center">
						<Col md={4}>
							<CourtCard court={court} />
						</Col>
						<Col md={8}>
							<TimeSlots
								court={court}
								selectedDate={selectedDate}
								bookings={bookings}
								onTimeSelect={(courtName, time) => handleShow(courtName, time)}
							/>
						</Col>
					</Row>
				))}
			</Container>

			<div
				className="text-center text-white py-5"
				style={{ backgroundColor: '#80CBC4' }}>
				<div className="mt-3">
					<Link to="/reviews">
						<Button variant="dark">Leave a Review</Button>
					</Link>
				</div>
			</div>

			<BookingForm
				show={showModal}
				handleClose={handleClose}
				selectedCourt={selectedCourt}
				setSelectedCourt={setSelectedCourt}
				selectedDate={selectedDate}
				setSelectedDate={setSelectedDate}
				selectedTime={selectedTime}
				setSelectedTime={setSelectedTime}
				bookings={bookings}
				handleBooking={handleBooking}
			/>

			<BookingsList
				show={showBookingsModal}
				handleClose={() => setShowBookingsModal(false)}
				upcomingBookings={upcomingBookings}
				finishedBookings={finishedBookings}
				handleEdit={handleEdit}
				handleDelete={handleDelete}
			/>

			<EditBookingForm
				show={showEditModal}
				handleClose={() => setShowEditModal(false)}
				editBookingId={editBookingId}
				selectedCourt={selectedCourt}
				editDate={editDate}
				setEditDate={setEditDate}
				editTime={editTime}
				setEditTime={setEditTime}
				bookings={bookings}
				handleUpdate={handleUpdate}
			/>
		</div>
	);
}
