import { useState } from "react";
import { Form, Button, Card, Row, Col, Alert } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useTranslation } from "react-i18next";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";

function Register() {
	const { t } = useTranslation();
	const navigate = useNavigate();

	const [isSeller, setIsSeller] = useState(false);
	const [showPass, setShowPass] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);

	const [formData, setFormData] = useState({
		first_name: "",
		last_name: "",
		email: "",
		phone: "",
		password: "",
		confirm_password: "",
		profile_image: null,
	});

	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const rules = {
		length: formData.password.length >= 8,
		mix: /[A-Z]/i.test(formData.password) && /[0-9]/.test(formData.password),
	};

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleImageChange = (e) => {
		setFormData({
			...formData,
			profile_image: e.target.files[0],
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setSuccess("");

		if (formData.password !== formData.confirm_password) {
			setError(t("register.mismatch"));
			return;
		}

		try {
			const data = new FormData();

			Object.keys(formData).forEach((key) => {
				if (formData[key]) data.append(key, formData[key]);
			});

			data.append("is_seller", isSeller);

			await api.post("/users/register/", data, {
				headers: { "Content-Type": "multipart/form-data" },
			});

			setSuccess(t("register.success"));

			setTimeout(() => navigate("/login"), 3000);
		} catch (err) {
			setError(err.response?.data?.detail || t("register.failed"));
		}
	};

	return (
		<Row className="justify-content-center mt-4">
			<Col md={6}>
				<Card className="shadow-sm">
					<Card.Body>
						<Card.Title className="text-center mb-3 fw-semibold">
							{t("register.title")}
						</Card.Title>

						<p className="text-muted small text-center mb-3">
							{t("register.subtitle")}
						</p>

						{error && <Alert variant="danger">{error}</Alert>}
						{success && <Alert variant="success">{success}</Alert>}

						<Form onSubmit={handleSubmit} encType="multipart/form-data">
							<Row>
								<Col md={6}>
									<Form.Control
										className="mb-2"
										name="first_name"
										placeholder={t("register.first")}
										value={formData.first_name}
										onChange={handleChange}
										required
									/>
								</Col>

								<Col md={6}>
									<Form.Control
										className="mb-2"
										name="last_name"
										placeholder={t("register.last")}
										value={formData.last_name}
										onChange={handleChange}
										required
									/>
								</Col>
							</Row>

							<Form.Control
								className="mb-2"
								type="email"
								name="email"
								placeholder={t("register.email")}
								value={formData.email}
								onChange={handleChange}
								required
							/>

							<Form.Control
								className="mb-2"
								name="phone"
								placeholder={t("register.phone")}
								value={formData.phone}
								onChange={handleChange}
								required
							/>

							<div className="position-relative mb-2">
								<Form.Control
									type={showPass ? "text" : "password"}
									name="password"
									placeholder={t("register.password")}
									value={formData.password}
									onChange={handleChange}
									required
								/>
								<button
									type="button"
									onClick={() => setShowPass((s) => !s)}
									className="bg-transparent border-0"
									style={{
										position: "absolute",
										right: 10,
										top: "50%",
										transform: "translateY(-50%)",
										color: "#6b7280",
									}}
								>
									{showPass ? <FaEyeSlash /> : <FaEye />}
								</button>
							</div>
							<PasswordStrengthMeter password={formData.password} />
							<ul
								className="small mt-1 mb-2"
								style={{ paddingLeft: "18px", listStyle: "none" }}
							>
								<li style={{ color: rules.length ? "#16a34a" : "#6b7280" }}>
									• {t("register.rule_length")}
								</li>

								<li style={{ color: rules.mix ? "#16a34a" : "#6b7280" }}>
									• {t("register.rule_mix")}
								</li>
							</ul>

							<div className="position-relative mb-2">
								<Form.Control
									type={showConfirm ? "text" : "password"}
									name="confirm_password"
									placeholder={t("register.confirm")}
									value={formData.confirm_password}
									onChange={handleChange}
									required
								/>
								<button
									type="button"
									onClick={() => setShowConfirm((s) => !s)}
									className="bg-transparent border-0"
									style={{
										position: "absolute",
										right: 10,
										top: "50%",
										transform: "translateY(-50%)",
										color: "#6b7280",
									}}
								>
									{showConfirm ? <FaEyeSlash /> : <FaEye />}
								</button>
							</div>

							<Form.Group className="mb-3">
								<Form.Label className="small text-muted">
									{t("register.picture")}
								</Form.Label>
								<Form.Control
									type="file"
									accept="image/*"
									onChange={handleImageChange}
								/>
							</Form.Group>

							<Form.Check
								type="checkbox"
								label={t("register.seller")}
								className="mb-3"
								checked={isSeller}
								onChange={(e) => setIsSeller(e.target.checked)}
							/>

							<Button type="submit" className="w-100">
								{t("register.button")}
							</Button>
						</Form>

						<div className="text-center mt-3 small">
							{t("register.have_account")}{" "}
							<Link to="/login">{t("register.login")}</Link>
						</div>
					</Card.Body>
				</Card>
			</Col>
		</Row>
	);
}

export default Register;
