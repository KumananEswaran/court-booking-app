import { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import { toast } from 'react-toastify';

export default function useBookings(user) {
	const [bookings, setBookings] = useState([]);
	const [upcomingBookings, setUpcomingBookings] = useState([]);
	const [finishedBookings, setFinishedBookings] = useState([]);
	const [loading, setLoading] = useState(false);

	const fetchBookings = async () => {
		try {
			setLoading(true);
			const response = await fetch('http://localhost:5000/bookings');
			const data = await response.json();

			setBookings(data);

			const now = moment().tz('Asia/Kuala_Lumpur');

			const userBookings = data.filter((booking) => booking.uid === user?.uid);

			const upcoming = userBookings.filter((booking) => {
				const bookingDate = moment.tz(
					booking.booking_date,
					'Asia/Kuala_Lumpur'
				);
				const fullDateTime = `${bookingDate.format('YYYY-MM-DD')} ${
					booking.booking_time
				}`;
				const bookingTime = moment.tz(
					fullDateTime,
					'YYYY-MM-DD hh:mm A',
					'Asia/Kuala_Lumpur'
				);

				return bookingTime.isAfter(now);
			});

			const finished = userBookings.filter((booking) => {
				const bookingDate = moment.tz(
					booking.booking_date,
					'Asia/Kuala_Lumpur'
				);
				const fullDateTime = `${bookingDate.format('YYYY-MM-DD')} ${
					booking.booking_time
				}`;
				const bookingTime = moment.tz(
					fullDateTime,
					'YYYY-MM-DD hh:mm A',
					'Asia/Kuala_Lumpur'
				);
				return bookingTime.isBefore(now);
			});

			setUpcomingBookings(upcoming);
			setFinishedBookings(finished);
		} catch (error) {
			console.error('Error fetching bookings:', error);
			toast.error('Failed to load bookings');
		} finally {
			setLoading(false);
		}
	};

	const createBooking = async (bookingData) => {
		try {
			setLoading(true);
			const response = await fetch('http://localhost:5000/bookings', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					uid: user.uid,
					...bookingData,
				}),
			});

			const data = await response.json();

			toast.success(
				`Booking confirmed for ${bookingData.court_name} on ${bookingData.booking_date} at ${bookingData.booking_time}`
			);

			await fetchBookings();
			return data;
		} catch (error) {
			console.error('Error booking:', error);
			toast.error('Failed to create booking');
			return null;
		} finally {
			setLoading(false);
		}
	};

	const updateBooking = async (bookingId, bookingData) => {
		try {
			setLoading(true);
			const response = await fetch(
				`http://localhost:5000/bookings/${bookingId}`,
				{
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(bookingData),
				}
			);

			if (response.ok) {
				toast.success('Booking updated successfully');
				await fetchBookings();
				return true;
			} else {
				throw new Error('Failed to update booking');
			}
		} catch (error) {
			console.error('Error updating booking:', error);
			toast.error('Error updating booking');
			return false;
		} finally {
			setLoading(false);
		}
	};

	const deleteBooking = async (bookingId) => {
		if (!window.confirm('Are you sure you want to delete this booking?'))
			return false;

		try {
			setLoading(true);
			const response = await fetch(
				`http://localhost:5000/bookings/${bookingId}`,
				{
					method: 'DELETE',
				}
			);

			if (response.ok) {
				toast.success('Booking deleted successfully');
				await fetchBookings();
				return true;
			} else {
				throw new Error('Failed to delete booking');
			}
		} catch (error) {
			console.error('Error deleting booking:', error);
			toast.error('Error deleting booking');
			return false;
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (user) {
			fetchBookings();
		}
	}, [user]);

	return {
		bookings,
		upcomingBookings,
		finishedBookings,
		loading,
		fetchBookings,
		createBooking,
		updateBooking,
		deleteBooking,
	};
}
