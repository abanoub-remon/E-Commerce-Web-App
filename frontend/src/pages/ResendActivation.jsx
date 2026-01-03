import { useState, useEffect } from "react";
import { Form, Button, Alert, Card } from "react-bootstrap";
import api from "../api/axios";
import { useTranslation } from "react-i18next";

function ResendActivation() {
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
			const res = await api.post("/users/resend-activation/", { email });
			setMessage(res.data.message || t("resend.success"));
			setCooldown(60);
		} catch (err) {
			setError(err.response?.data?.detail || t("resend.failed"));
			setCooldown(60);
		}
	};

	return (
		<Card className="mt-5 mx-auto shadow-sm" style={{ maxWidth: 420 }}>
			<Card.Body>
				<Card.Title className="mb-3 fw-semibold">{t("resend.title")}</Card.Title>

				<p className="text-muted small mb-3">{t("resend.subtitle")}</p>

				{message && <Alert variant="success">{message}</Alert>}
				{error && <Alert variant="danger">{error}</Alert>}

				<Form onSubmit={handleSubmit}>
					<Form.Control
						type="email"
						placeholder={t("resend.email")}
						value={email}
						required
						onChange={(e) => setEmail(e.target.value)}
						className="mb-3"
					/>

					<Button className="w-100" type="submit" disabled={cooldown > 0}>
						{cooldown > 0
							? t("resend.resend_in", { s: cooldown })
							: t("resend.button")}
					</Button>
				</Form>
			</Card.Body>
		</Card>
	);
}

export default ResendActivation;
