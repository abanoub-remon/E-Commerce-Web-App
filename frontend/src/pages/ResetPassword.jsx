import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Alert, Card } from "react-bootstrap";
import api from "../api/axios";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { useTranslation } from "react-i18next";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function ResetPassword() {
	const { t } = useTranslation();
	const { token } = useParams();
	const navigate = useNavigate();

	const [password, setPassword] = useState("");
	const [confirm, setConfirm] = useState("");
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");

	const [showPass, setShowPass] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);

	const rules = {
		length: password.length >= 8,
		upper: /[A-Z]/.test(password),
		lower: /[a-z]/.test(password),
		digit: /[0-9]/.test(password),
		symbol: /[^A-Za-z0-9]/.test(password),
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setMessage("");

		if (password !== confirm) {
			setError(t("reset.mismatch"));
			return;
		}

		try {
			const res = await api.post(`/users/reset-pass/${token}/`, {
				password,
				confirm_password: confirm,
			});

			setMessage(res.data.message || t("reset.success"));
			setTimeout(() => navigate("/login"), 1800);
		} catch (err) {
			setError(err.response?.data?.detail || t("reset.failed"));
		}
	};

	const renderField = (value, setValue, show, setShow, placeholder) => (
		<div className="position-relative mb-2">
			<Form.Control
				type={show ? "text" : "password"}
				placeholder={placeholder}
				value={value}
				onChange={(e) => setValue(e.target.value)}
				required
			/>

			<button
				type="button"
				onClick={() => setShow((s) => !s)}
				style={{
					position: "absolute",
					right: 10,
					top: "50%",
					transform: "translateY(-50%)",
					border: "none",
					background: "transparent",
					color: "#6b7280",
					cursor: "pointer",
					padding: 0,
				}}
				tabIndex={-1}
				aria-label="toggle password visibility"
			>
				{show ? <FaEyeSlash /> : <FaEye />}
			</button>
		</div>
	);

	return (
		<Card className="mt-5 mx-auto" style={{ maxWidth: 420 }}>
			<Card.Body>
				<Card.Title className="mb-2">{t("reset.title")}</Card.Title>

				<p className="text-muted small mb-3">{t("reset.info")}</p>

				{error && <Alert variant="danger">{error}</Alert>}
				{message && <Alert variant="success">{message}</Alert>}

				<Form onSubmit={handleSubmit}>
					{renderField(password, setPassword, showPass, setShowPass, t("reset.new"))}

					<PasswordStrengthMeter password={password} />

					<ul
						className="small mt-2 mb-3"
						style={{ listStyle: "none", paddingLeft: 0 }}
					>
						<li style={{ color: rules.length ? "#16a34a" : "#6b7280" }}>
							• {t("reset.rules.length")}
						</li>
						<li style={{ color: rules.upper ? "#16a34a" : "#6b7280" }}>
							• {t("reset.rules.upper")}
						</li>
						<li style={{ color: rules.lower ? "#16a34a" : "#6b7280" }}>
							• {t("reset.rules.lower")}
						</li>
						<li style={{ color: rules.digit ? "#16a34a" : "#6b7280" }}>
							• {t("reset.rules.digit")}
						</li>
						<li style={{ color: rules.symbol ? "#16a34a" : "#6b7280" }}>
							• {t("reset.rules.symbol")}
						</li>
					</ul>

					{renderField(
						confirm,
						setConfirm,
						showConfirm,
						setShowConfirm,
						t("reset.confirm")
					)}

					<Button type="submit" className="w-100 mt-2">
						{t("reset.submit")}
					</Button>
				</Form>
			</Card.Body>
		</Card>
	);
}

export default ResetPassword;
