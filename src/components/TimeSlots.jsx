import { Row, Col, Button } from 'react-bootstrap';
import { availableTimes, isTimeSlotBooked } from '../utils/dateUtils';

const TimeSlots = ({ court, selectedDate, bookings }) => {
	return (
		<Row className="g-2">
			{availableTimes.map((time, index) => {
				const isBooked = isTimeSlotBooked(
					bookings,
					court.name,
					selectedDate,
					time
				);
				return (
					<Col key={index} xs={3}>
						<Button
							variant={isBooked ? 'secondary' : 'success'}
							className="w-100"
							disabled={isBooked}>
							{time}
						</Button>
					</Col>
				);
			})}
		</Row>
	);
};

export default TimeSlots;
