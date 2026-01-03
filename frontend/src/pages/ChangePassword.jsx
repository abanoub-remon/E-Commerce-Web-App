import { useState } from "react";
import { Form, Button, Alert, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import api from "../api/axios";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { useTranslation } from "react-i18next";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function ChangePassword() {
	const { t } = useTranslation();

	const [oldPassword, setOldPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirm, setConfirm] = useState("");

	const [showOld, setShowOld] = useState(false);
	const [showNew, setShowNew] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);

	const [message, setMessage] = useState("");
	const [error, setError] = useState("");

	const rules = {
		length: newPassword.length >= 8,
		upper: /[A-Z]/.test(newPassword),
		lower: /[a-z]/.test(newPassword),
		digit: /[0-9]/.test(newPassword),
		symbol: /[^A-Za-z0-9]/.test(newPassword),
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setMessage("");

		if (newPassword !== confirm) {
			setError(t("change_password.mismatch"));
			return;
		}

		try {
			const res = await api.post("/users/change-password/", {
				old_password: oldPassword,
				new_password: newPassword,
				confirm_password: confirm,
			});

			setMessage(res.data.message || t("change_password.success"));
			setOldPassword("");
			setNewPassword("");
			setConfirm("");
		} catch (err) {
			setError(err.response?.data?.detail || t("change_password.failed"));
		}
	};

	const renderPasswordField = (value, setValue, show, setShow, placeholder) => (
		<div className="position-relative mb-2">
			<Form.Control
				type={show ? "text" : "password"}
				value={value}
				placeholder={placeholder}
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
					padding: 0,
					cursor: "pointer",
				}}
				tabIndex={-1}
				aria-label="toggle password visibility"
			>
				{show ? <FaEyeSlash /> : <FaEye />}
			</button>
		</div>
	);

	return (
		<Card className="mt-5 mx-auto" style={{ maxWidth: 450 }}>
			<Card.Body>
				<Card.Title>{t("change_password.title")}</Card.Title>

				{error && <Alert variant="danger">{error}</Alert>}
				{message && <Alert variant="success">{message}</Alert>}

				<Form onSubmit={handleSubmit}>
					{renderPasswordField(
						oldPassword,
						setOldPassword,
						showOld,
						setShowOld,
						t("change_password.old")
					)}

					<div className="text-end mt-1 mb-2">
						<Link to="/forgot-password" className="small">
							{t("change_password.forgot")}
						</Link>
					</div>

					{renderPasswordField(
						newPassword,
						setNewPassword,
						showNew,
						setShowNew,
						t("change_password.new")
					)}

					<PasswordStrengthMeter password={newPassword} />

					<ul
						className="small mt-2 mb-3"
						style={{ listStyle: "none", paddingLeft: 0 }}
					>
						<li style={{ color: rules.length ? "#16a34a" : "#6b7280" }}>
							• {t("change_password.rules.length")}
						</li>
						<li style={{ color: rules.upper ? "#16a34a" : "#6b7280" }}>
							• {t("change_password.rules.upper")}
						</li>
						<li style={{ color: rules.lower ? "#16a34a" : "#6b7280" }}>
							• {t("change_password.rules.lower")}
						</li>
						<li style={{ color: rules.digit ? "#16a34a" : "#6b7280" }}>
							• {t("change_password.rules.digit")}
						</li>
						<li style={{ color: rules.symbol ? "#16a34a" : "#6b7280" }}>
							• {t("change_password.rules.symbol")}
						</li>
					</ul>

					{renderPasswordField(
						confirm,
						setConfirm,
						showConfirm,
						setShowConfirm,
						t("change_password.confirm")
					)}

					<Button type="submit" className="w-100 mt-2">
						{t("change_password.submit")}
					</Button>
				</Form>
			</Card.Body>
		</Card>
	);
}

export default ChangePassword;
