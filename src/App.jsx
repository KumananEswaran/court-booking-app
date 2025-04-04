import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect } from 'react';
import ReviewPage from './pages/ReviewPage';

function ProtectedRoute({ children }) {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			setUser(currentUser);
			setLoading(false);
		});
		return () => unsubscribe();
	}, []);

	if (loading) return <p>Loading...</p>;

	return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route
					path="/home"
					element={
						<ProtectedRoute>
							<HomePage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/reviews"
					element={
						<ProtectedRoute>
							<ReviewPage />
						</ProtectedRoute>
					}
				/>
				<Route path="/login" element={<AuthPage />} />
				<Route path="*" element={<AuthPage />} />
			</Routes>
		</BrowserRouter>
	);
}
