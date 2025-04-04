import { useEffect, useState } from 'react';
import { db, collection, getDocs } from '../firebase';
import { Card, Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ReviewModal from '../components/ReviewModal';

const ReviewPage = () => {
	const [reviews, setReviews] = useState([]);
	const [showModal, setShowModal] = useState(false);

	useEffect(() => {
		const fetchReviews = async () => {
			const querySnapshot = await getDocs(collection(db, 'reviews'));
			const reviewsData = querySnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setReviews(reviewsData);
		};

		fetchReviews();
	}, []);

	return (
		<Container>
			<div className="d-flex justify-content-between align-items-center my-4">
				<h2>Reviews</h2>
				<div>
					<Button
						variant="primary"
						className="me-2"
						onClick={() => setShowModal(true)}>
						Add a Review
					</Button>
					<Link to="/home">
						<Button variant="dark">Home</Button>
					</Link>
				</div>
			</div>

			<Row>
				{reviews.map((review) => (
					<Col md={4} key={review.id} className="mb-4">
						<Card>
							{review.imageUrl && (
								<Card.Img variant="top" src={review.imageUrl} />
							)}
							<Card.Body>
								<Card.Title>{review.name || 'Anonymous'}</Card.Title>
								<Card.Text>{review.text}</Card.Text>
							</Card.Body>
						</Card>
					</Col>
				))}
			</Row>

			<ReviewModal show={showModal} handleClose={() => setShowModal(false)} />
		</Container>
	);
};

export default ReviewPage;
