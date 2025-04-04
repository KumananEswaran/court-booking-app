import { Modal, Form, Button } from 'react-bootstrap';
import { availableTimes, isTimeSlotBooked } from '../utils/dateUtils';

const BookingForm = ({
	show,
	handleClose,
	selectedCourt,
	setSelectedCourt,
	selectedDate,
	setSelectedDate,
	selectedTime,
	setSelectedTime,
	bookings,
	handleBooking,
}) => {
	return (
		<Modal show={show} onHide={handleClose} centered>
			<Modal.Header closeButton>
				<Modal.Title>Book a Court</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form>
					<Form.Group className="mb-3">
						<Form.Label>Select Court</Form.Label>
						<Form.Select
							value={selectedCourt}
							onChange={(e) => setSelectedCourt(e.target.value)}>
							<option value="">Choose a Court</option>
							<option value="Court A">Court A</option>
							<option value="Court B">Court B</option>
							<option value="Court C">Court C</option>
						</Form.Select>
					</Form.Group>

					<Form.Group className="mb-3">
						<Form.Label>Select Date</Form.Label>
						<Form.Control
							type="date"
							value={selectedDate}
							onChange={(e) => setSelectedDate(e.target.value)}
						/>
					</Form.Group>

					<Form.Group className="mb-3">
						<Form.Label>Select Time</Form.Label>
						<Form.Select
							value={selectedTime}
							onChange={(e) => setSelectedTime(e.target.value)}>
							<option value="">Select Time</option>
							{availableTimes.map((time, index) => {
								const isUnavailable = isTimeSlotBooked(
									bookings,
									selectedCourt,
									selectedDate,
									time
								);

								return (
									<option
										key={index}
										value={time}
										disabled={isUnavailable}
										style={{
											backgroundColor: isUnavailable ? '#d6d6d6' : 'white',
											color: isUnavailable ? '#6c757d' : 'black',
										}}>
										{time}
									</option>
								);
							})}
						</Form.Select>
					</Form.Group>
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={handleClose}>
					Close
				</Button>
				<Button
					variant="success"
					onClick={handleBooking}
					disabled={!selectedCourt || !selectedTime}>
					Confirm Booking
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default BookingForm;
