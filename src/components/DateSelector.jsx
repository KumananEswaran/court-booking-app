import { Row, Col, Button } from 'react-bootstrap';
import { generateDates } from '../utils/dateUtils';

const DateSelector = ({ selectedDate, setSelectedDate }) => {
	const dates = generateDates();

	return (
		<Row className="mb-4 text-center">
			{dates.map((date, index) => (
				<Col key={index} xs={2}>
					<Button
						variant={
							selectedDate === date.fullDate ? 'primary' : 'outline-primary'
						}
						className="w-100"
						onClick={() => setSelectedDate(date.fullDate)}>
						{date.display}
					</Button>
				</Col>
			))}
		</Row>
	);
};

export default DateSelector;
