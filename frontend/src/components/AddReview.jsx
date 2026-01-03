import { useState } from "react";
import { Form, Button, Alert, Card } from "react-bootstrap";
import api from "../api/axios";
import { useTranslation } from "react-i18next";

function AddReview({ productId, onReviewAdded }) {
	const { t } = useTranslation();

	const [rating, setRating] = useState(5);
	const [comment, setComment] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setSuccess("");
		setLoading(true);

		try {
			await api.post(`/products/${productId}/reviews/`, {
				rating,
				comment,
			});

			setComment("");
			setRating(5);
			setSuccess(t("reviews.success"));
			onReviewAdded();
		} catch (err) {
			setError(err.response?.data?.detail || t("reviews.error"));
		} finally {
			setLoading(false);
		}
	};

	return (
		<Card className="border-0 shadow-sm mt-3">
			<Card.Body>
				<h5 className="mb-3">{t("reviews.add_title")}</h5>

				{error && <Alert variant="danger">{error}</Alert>}
				{success && <Alert variant="success">{success}</Alert>}

				<Form onSubmit={handleSubmit}>
					{/* Stars */}
					<div className="mb-3 d-flex align-items-center gap-2">
						{[1, 2, 3, 4, 5].map((star) => (
							<span
								key={star}
								style={{
									cursor: "pointer",
									fontSize: 22,
									color: star <= rating ? "#fbbf24" : "#d1d5db",
									transition: "0.15s",
								}}
								onClick={() => setRating(star)}
							>
								★
							</span>
						))}
						<span className="text-muted small">({rating}/5)</span>
					</div>

					<Form.Control
						as="textarea"
						rows={3}
						placeholder={t("reviews.placeholder")}
						className="mb-3"
						value={comment}
						onChange={(e) => setComment(e.target.value)}
					/>

					<Button type="submit" size="sm" disabled={loading}>
						{loading ? t("reviews.submitting") : t("reviews.submit")}
					</Button>
				</Form>
			</Card.Body>
		</Card>
	);
}

export default AddReview;
