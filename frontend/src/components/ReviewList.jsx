import { Card, Badge } from "react-bootstrap";
import { useTranslation } from "react-i18next";

function ReviewList({ reviews = [] }) {
	const { t } = useTranslation();

	return (
		<>
			<h5 className="mb-3">{t("reviews.title")}</h5>

			{reviews.length === 0 && <p className="text-muted">{t("reviews.none")}</p>}

			{reviews.map((review) => (
				<Card key={review.id} className="mb-2 shadow-sm">
					<Card.Body>
						<div className="d-flex justify-content-between align-items-center">
							<strong>{review.user}</strong>

							<Badge bg="warning" text="dark">
								{review.rating} ★
							</Badge>
						</div>

						<p className="mb-0 mt-2">{review.comment}</p>
					</Card.Body>
				</Card>
			))}
		</>
	);
}

export default ReviewList;
