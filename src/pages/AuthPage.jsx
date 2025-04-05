import {
	Container,
	Row,
	Col,
	Card,
	Form,
	Button,
	Modal,
} from 'react-bootstrap';
import { useState } from 'react';
import { db, auth } from '../firebase';
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AuthPage() {
	const [showModal, setShowModal] = useState(false);
	const [registerData, setRegisterData] = useState({
		name: '',
		phone: '',
		email: '',
		password: '',
	});

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const navigate = useNavigate();

	const handleRegister = async (e) => {
		e.preventDefault();
		try {
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				registerData.email,
				registerData.password
			);
			const user = userCredential.user;

			await updateProfile(user, {
				displayName: registerData.name,
			});

			await fetch(
				'https://18de6832-baec-46d2-8a8a-8accf3a8f1b9-00-2xhtzwbqapqog.pike.replit.dev/register',
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						uid: user.uid,
						name: registerData.name,
						email: registerData.email,
						phone: registerData.phone,
					}),
				}
			);

			await setDoc(doc(db, 'users', user.uid), {
				name: registerData.name,
				email: registerData.email,
				phone: registerData.phone,
				uid: user.uid,
			});

			toast.success('Registration Successful');
			setShowModal(false);
		} catch (error) {
			console.error(error.message);
			toast.error(error.message);
		}
	};

	const handleLogin = async (e) => {
		e.preventDefault();
		try {
			const userCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);
			const user = userCredential.user;
			console.log('Login successful:', user);

			const userDocRef = doc(db, 'users', user.uid);
			const userDoc = await getDoc(userDocRef);

			if (!userDoc.exists()) {
				console.log('Creating missing user document in Firestore');
				await setDoc(userDocRef, {
					name: user.displayName || email.split('@')[0],
					email: user.email,
					phone: user.phoneNumber || '',
					uid: user.uid,
					createdAt: new Date(),
				});

				const newUserDoc = await getDoc(userDocRef);
				localStorage.setItem('authToken', await user.getIdToken());
				localStorage.setItem('user', JSON.stringify(newUserDoc.data()));
			} else {
				localStorage.setItem('authToken', await user.getIdToken());
				localStorage.setItem('user', JSON.stringify(userDoc.data()));
			}

			toast.success('Login Successful');
			setTimeout(() => {
				navigate('/home', { replace: true });
			}, 1000);
		} catch (error) {
			console.error(error.message);
			toast.error(error.message);
		}
	};

	return (
		<>
			<ToastContainer />
			<section className="vh-100" style={{ backgroundColor: '#80CBC4' }}>
				<Container className="py-5 h-100">
					<Row className="d-flex justify-content-center align-items-center h-100">
						<Col xl={12}>
							<Card className="shadow-lg" style={{ borderRadius: '1rem' }}>
								<Row className="g-0">
									<Col md={6} lg={6} className="d-none d-md-block">
										<img
											src="https://images.unsplash.com/photo-1553627220-92f0446b6a5f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
											alt="login form"
											className="img-fluid"
											style={{ borderRadius: '1rem 0 0 1rem', height: '100%' }}
										/>
									</Col>

									<Col md={6} lg={6} className="d-flex align-items-center">
										<Card.Body className="p-4 p-lg-5 text-black">
											<Form onSubmit={handleLogin}>
												<div className="d-flex align-items-center mb-3 pb-1">
													<span className="h1 fw-bold mb-0">
														⚽ KickOff Arena ⚽
													</span>
												</div>
												<h5
													className="fw-normal mb-3 pb-3"
													style={{ letterSpacing: '1px' }}>
													Sign into your account
												</h5>
												<Form.Group className="mb-4">
													<Form.Control
														type="email"
														placeholder="Email address"
														size="lg"
														value={email}
														onChange={(e) => setEmail(e.target.value)}
													/>
												</Form.Group>
												<Form.Group className="mb-4">
													<Form.Control
														type="password"
														placeholder="Password"
														size="lg"
														value={password}
														onChange={(e) => setPassword(e.target.value)}
													/>
												</Form.Group>
												<div className="pt-1 mb-4">
													<Button
														variant="dark"
														size="lg"
														className="w-100"
														type="submit">
														Login
													</Button>
												</div>
												<p
													className="mb-5 pb-lg-2"
													style={{ color: '#393f81' }}>
													Don't have an account?{' '}
													<a
														href="#!"
														style={{ color: '#393f81' }}
														onClick={() => setShowModal(true)}>
														Register here
													</a>
												</p>
											</Form>
										</Card.Body>
									</Col>
								</Row>
							</Card>
						</Col>
					</Row>
				</Container>

				<Modal show={showModal} onHide={() => setShowModal(false)} centered>
					<Modal.Header closeButton>
						<Modal.Title>CREATE AN ACCOUNT</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form onSubmit={handleRegister}>
							<Form.Group className="mb-3">
								<Form.Label>Name</Form.Label>
								<Form.Control
									type="text"
									placeholder="Enter your name"
									value={registerData.name}
									onChange={(e) =>
										setRegisterData({ ...registerData, name: e.target.value })
									}
								/>
							</Form.Group>

							<Form.Group className="mb-3">
								<Form.Label>Phone Number</Form.Label>
								<Form.Control
									type="tel"
									placeholder="Enter your phone number"
									value={registerData.phone}
									onChange={(e) =>
										setRegisterData({ ...registerData, phone: e.target.value })
									}
								/>
							</Form.Group>

							<Form.Group className="mb-3">
								<Form.Label>Email</Form.Label>
								<Form.Control
									type="email"
									placeholder="Enter your email"
									value={registerData.email}
									onChange={(e) =>
										setRegisterData({ ...registerData, email: e.target.value })
									}
								/>
							</Form.Group>

							<Form.Group className="mb-3">
								<Form.Label>Password</Form.Label>
								<Form.Control
									type="password"
									placeholder="Enter your password"
									value={registerData.password}
									onChange={(e) =>
										setRegisterData({
											...registerData,
											password: e.target.value,
										})
									}
								/>
							</Form.Group>

							<Button variant="primary" className="w-100" type="submit">
								Register
							</Button>
						</Form>
					</Modal.Body>
				</Modal>
			</section>
		</>
	);
}
