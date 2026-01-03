import { useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import { getCart, clearCart } from "../utils/cart";
import { useTranslation } from "react-i18next";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
	const { t } = useTranslation();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPass, setShowPass] = useState(false);
	const [error, setError] = useState("");

	const { login } = useContext(AuthContext);
	const navigate = useNavigate();
	const location = useLocation();

	const from =
		location.state?.from?.pathname ||
		localStorage.getItem("redirectAfterLogin") ||
		"/";

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		try {
			const response = await api.post("/users/login/", {
				email,
				password,
			});

			login({
				access: response.data.access,
				refresh: response.data.refresh,
			});

			localStorage.removeItem("redirectAfterLogin");

			const guestCart = getCart();
			if (guestCart.length) {
				await api.post("/cart/sync/", {
					items: guestCart.map((item) => ({
						product_id: item.product_id,
						quantity: item.quantity,
					})),
				});

				clearCart();
			}

			navigate(from, { replace: true });
		} catch (err) {
			setError(err.response?.data?.detail || t("login.failed"));
		}
	};

	return (
		<Row className="justify-content-center mt-4">
			<Col md={5}>
				<Card className="shadow-sm">
					<Card.Body>
						<Card.Title className="text-center mb-3 fw-semibold">
							{t("login.title")}
						</Card.Title>

						<p className="text-muted small text-center mb-3">{t("login.subtitle")}</p>

						{error && <Alert variant="danger">{error}</Alert>}

						<Form onSubmit={handleSubmit}>
							<Form.Control
								className="mb-3"
								type="email"
								placeholder={t("login.email")}
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>

							<div className="position-relative mb-3">
								<Form.Control
									type={showPass ? "text" : "password"}
									placeholder={t("login.password")}
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
								/>

								<button
									type="button"
									onClick={() => setShowPass((s) => !s)}
									style={{
										position: "absolute",
										right: 10,
										top: "50%",
										transform: "translateY(-50%)",
										border: "none",
										background: "transparent",
										color: "#6b7280",
										cursor: "pointer",
									}}
									tabIndex={-1}
									aria-label="toggle password visibility"
								>
									{showPass ? <FaEyeSlash /> : <FaEye />}
								</button>
							</div>

							<Button type="submit" className="w-100">
								{t("login.button")}
							</Button>

							<div className="text-center mt-3">
								<Link to="/forgot-password" className="text-decoration-none small">
									{t("login.forgot")}
								</Link>
							</div>

							<div className="text-center mt-2 small">
								<Link to="/resend-activation" className="text-decoration-none">
									{t("login.resend")}
								</Link>
							</div>

							<div className="text-center mt-2 small">
								<Link to="/register" className="text-decoration-none">
									{t("login.no_account")}
								</Link>
							</div>
						</Form>
					</Card.Body>
				</Card>
			</Col>
		</Row>
	);
}

export default Login;
