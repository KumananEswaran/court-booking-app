import { Modal, Button } from 'react-bootstrap';
import { formatBookingDateTime } from '../utils/dateUtils';

const BookingsList = ({
	show,
	handleClose,
	upcomingBookings,
	finishedBookings,
	handleEdit,
	handleDelete,
}) => {
	return (
		<Modal show={show} onHide={handleClose} centered>
			<Modal.Header closeButton>
				<Modal.Title>My Bookings</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<h5>Upcoming Bookings</h5>
				{upcomingBookings.length === 0 ? (
					<p>No upcoming bookings.</p>
				) : (
					upcomingBookings.map((booking) => (
						<div
							key={booking.id}
							className="d-flex justify-content-between align-items-center border p-2 mb-2">
							<div>
								<strong>{booking.court_name}</strong> <br />
								{formatBookingDateTime(booking)}
							</div>
							<div>
								<Button
									variant="warning"
									size="sm"
									onClick={() => handleEdit(booking)}>
									Edit
								</Button>
								<Button
									variant="danger"
									size="sm"
									className="ms-2"
									onClick={() => handleDelete(booking.id)}>
									Delete
								</Button>
							</div>
						</div>
					))
				)}

				<h5 className="mt-3">Finished Bookings</h5>
				{finishedBookings.length === 0 ? (
					<p>No finished bookings.</p>
				) : (
					finishedBookings.map((booking) => (
						<div key={booking.id} className="border p-2 mb-2 text-muted">
							<strong>{booking.court_name}</strong> <br />
							{formatBookingDateTime(booking)}
						</div>
					))
				)}
			</Modal.Body>
		</Modal>
	);
};

export default BookingsList;
