import { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { db, storage } from '../firebase';
import {
	collection,
	addDoc,
	serverTimestamp,
	doc,
	getDoc,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const ReviewModal = ({ show, handleClose }) => {
	const [text, setText] = useState('');
	const [image, setImage] = useState(null);
	const [userName, setUserName] = useState('');
	const auth = getAuth();

	const fetchUserName = async (uid) => {
		try {
			const userDocRef = doc(db, 'users', uid);
			const userDocSnapshot = await getDoc(userDocRef);
			if (userDocSnapshot.exists()) {
				setUserName(userDocSnapshot.data().name);
			} else {
				setUserName('Anonymous');
			}
		} catch (error) {
			console.error('Error fetching user name:', error);
			setUserName('Anonymous');
		}
	};

	useEffect(() => {
		if (auth.currentUser) {
			fetchUserName(auth.currentUser.uid);
		}
	}, [auth.currentUser]);

	const handleImageChange = (e) => {
		if (e.target.files[0]) {
			setImage(e.target.files[0]);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		let imageUrl = '';

		if (image) {
			const imageRef = ref(storage, `reviews/${Date.now()}_${image.name}`);
			try {
				const snapshot = await uploadBytes(imageRef, image);

				imageUrl = await getDownloadURL(snapshot.ref());
			} catch (error) {
				console.error('Upload failed:', error);
				alert('Failed to upload image. Try again.');
				return;
			}
		}

		try {
			await addDoc(collection(db, 'reviews'), {
				uid: auth.currentUser.uid,
				name: auth.currentUser.displayName || userName,
				text,
				imageUrl,
				createdAt: serverTimestamp(),
			});
			alert('Review added successfully');
			handleClose();
		} catch (error) {
			console.error('Error adding review', error);
			alert('Failed to submit review. Try again');
		}

		handleClose();
	};

	return (
		<Modal show={show} onHide={handleClose} centered>
			<Modal.Header closeButton>
				<Modal.Title>Add a Review</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form onSubmit={handleSubmit}>
					<Form.Group className="mb-3">
						<Form.Label>Review</Form.Label>
						<Form.Control
							as="textarea"
							rows={3}
							value={text}
							onChange={(e) => setText(e.target.value)}
							required
						/>
					</Form.Group>

					<Form.Group className="mb-3">
						<Form.Label>Upload Image</Form.Label>
						<Form.Control type="file" onChange={handleImageChange} />
					</Form.Group>

					<Button variant="primary" type="submit">
						Submit Review
					</Button>
				</Form>
			</Modal.Body>
		</Modal>
	);
};

export default ReviewModal;
