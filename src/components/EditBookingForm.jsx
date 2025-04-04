import { Modal, Form, Button } from 'react-bootstrap';
import { availableTimes } from '../utils/dateUtils';
import moment from 'moment-timezone';

const EditBookingForm = ({
	show,
	handleClose,
	editBookingId,
	selectedCourt,
	editDate,
	setEditDate,
	editTime,
	setEditTime,
	bookings,
	handleUpdate,
}) => {
	return (
		<Modal show={show} onHide={handleClose} centered>
			<Modal.Header closeButton>
				<Modal.Title>Edit Booking</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form>
					<Form.Group className="mb-3">
						<Form.Label>Select New Date</Form.Label>
						<Form.Control
							type="date"
							value={editDate}
							onChange={(e) => setEditDate(e.target.value)}
						/>
					</Form.Group>

					<Form.Group className="mb-3">
						<Form.Label>Select New Time</Form.Label>
						<Form.Select
							value={editTime}
							onChange={(e) => setEditTime(e.target.value)}>
							<option value="">Select Time</option>
							{availableTimes.map((time, index) => {
								const isUnavailable = bookings.some(
									(b) =>
										b.court_name === selectedCourt &&
										moment(b.booking_date).format('YYYY-MM-DD') === editDate &&
										b.booking_time === time &&
										b.id !== editBookingId
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
					Cancel
				</Button>
				<Button variant="success" onClick={handleUpdate}>
					Update Booking
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default EditBookingForm;
