import { useState, useEffect } from "react";
import { Form, Button, Alert, Card } from "react-bootstrap";
import api from "../api/axios";
import { useTranslation } from "react-i18next";

function ForgotPassword() {
	const { t } = useTranslation();

	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");

	const [cooldown, setCooldown] = useState(0);

	useEffect(() => {
		if (!cooldown) return;
		const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
		return () => clearInterval(timer);
	}, [cooldown]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setMessage("");
		setError("");

		try {
			const res = await api.post("/users/forgot-password/", { email });
			setMessage(res.data.message || t("forgot.success"));
			setCooldown(60);
		} catch (err) {
			setError(err.response?.data?.detail || t("forgot.failed"));
			setCooldown(60);
		}
	};

	return (
		<Card className="mt-5 mx-auto" style={{ maxWidth: 420 }}>
			<Card.Body>
				<Card.Title className="mb-2">{t("forgot.title")}</Card.Title>

				<p className="text-muted small mb-3">{t("forgot.info")}</p>

				{message && <Alert variant="success">{message}</Alert>}
				{error && <Alert variant="danger">{error}</Alert>}

				<Form onSubmit={handleSubmit}>
					<Form.Control
						type="email"
						placeholder={t("forgot.email")}
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="mb-3"
						required
					/>

					<Button type="submit" className="w-100" disabled={cooldown > 0}>
						{cooldown > 0 ? t("forgot.resend_in", { s: cooldown }) : t("forgot.send")}
					</Button>
				</Form>
			</Card.Body>
		</Card>
	);
}

export default ForgotPassword;
