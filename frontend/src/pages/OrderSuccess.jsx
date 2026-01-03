import { useEffect, useState } from "react";
import { Button, Card, Container, Row, Col, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";

function OrderSuccess() {
	const { t } = useTranslation();

	const [recommended, setRecommended] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		api
			.get("/products/best-sellers/")
			.then((res) => setRecommended(res.data || []))
			.finally(() => setLoading(false));
	}, []);

	return (
		<>
			<div className="d-flex justify-content-center mt-5 mb-4">
				<Card className="shadow-sm text-center" style={{ maxWidth: 460 }}>
					<Card.Body className="p-4">
						<FaCheckCircle size={60} color="#16a34a" className="mb-3" />

						<h4 className="fw-semibold mb-2">{t("order_success.title")}</h4>

						<p className="text-muted mb-4">{t("order_success.message")}</p>

						<Button as={Link} to="/" className="w-100">
							{t("order_success.continue")}
						</Button>
					</Card.Body>
				</Card>
			</div>

			<Container className="mb-5">
				<h5 className="fw-semibold mb-3">{t("order_success.recommended")}</h5>

				{loading ? (
					<div className="text-center py-4">
						<Spinner animation="border" />
					</div>
				) : (
					<Row>
						{recommended.slice(0, 4).map((product) => (
							<Col key={product.id} md={3} sm={6} className="mb-4">
								<ProductCard product={product} />
							</Col>
						))}
					</Row>
				)}
			</Container>
		</>
	);
}

export default OrderSuccess;
