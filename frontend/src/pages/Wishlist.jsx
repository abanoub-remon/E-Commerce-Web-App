import { useEffect, useState } from "react";
import { Row, Col, Card, Button, Alert } from "react-bootstrap";
import api from "../api/axios";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Wishlist() {
	const { t } = useTranslation();
	const [items, setItems] = useState([]);

	const load = () => {
		api.get("/wishlist/").then((res) => setItems(res.data));
	};

	useEffect(() => {
		load();
	}, []);

	const remove = (productId) => {
		api.delete(`/wishlist/${productId}/`).then(load);
	};

	return (
		<>
			<h3 className="mb-4 fw-semibold">{t("wishlist.title")}</h3>

			{!items.length && (
				<Alert variant="light" className="text-center shadow-sm border-0 mb-4">
					<h6 className="mb-1">{t("wishlist.empty_title")}</h6>
					<p className="text-muted mb-0">{t("wishlist.empty_text")}</p>
				</Alert>
			)}

			<Row>
				{items.map((i) => (
					<Col md={3} key={i.id} className="mb-3">
						<Card className="h-100 shadow-sm wishlist-card">
							{i.product.images?.[0] && (
								<Card.Img
									src={i.product.images[0].image}
									style={{ height: 180, objectFit: "cover" }}
								/>
							)}

							<Card.Body>
								<Card.Title className="fw-semibold mb-2 text-truncate">
									{i.product.title}
								</Card.Title>

								{i.product.discount > 0 ? (
									<>
										<span className="text-muted text-decoration-line-through me-2">
											${i.product.price}
										</span>
										<span className="fw-bold text-danger">${i.product.final_price}</span>
									</>
								) : (
									<span className="fw-bold">${i.product.price}</span>
								)}

								<div className="mt-3 d-flex flex-column gap-2">
									<Button
										as={Link}
										to={`/products/${i.product.id}`}
										variant="outline-primary"
										size="sm"
									>
										{t("wishlist.view")}
									</Button>

									<Button
										variant="outline-danger"
										size="sm"
										onClick={() => remove(i.product.id)}
									>
										{t("wishlist.remove")}
									</Button>
								</div>
							</Card.Body>
						</Card>
					</Col>
				))}
			</Row>

			<style>{`
        .wishlist-card {
          transition: all .18s ease;
          border: 0;
        }
        .wishlist-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 14px 28px rgba(0,0,0,.08);
        }
      `}</style>
		</>
	);
}

export default Wishlist;
