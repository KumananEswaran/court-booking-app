import { Card } from 'react-bootstrap';

const CourtCard = ({ court }) => {
	return (
		<Card className="border-0 shadow-lg">
			<Card.Img
				variant="top"
				src={court.image}
				className="rounded"
				style={{ height: '250px', objectFit: 'cover' }}
			/>
			<Card.Body className="text-center">
				<Card.Title className="fw-bold">{court.name}</Card.Title>
			</Card.Body>
		</Card>
	);
};

export default CourtCard;
