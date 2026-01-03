import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { Row, Col, Spinner, Alert, Badge, Button, Card } from "react-bootstrap";
import api from "../api/axios";
import ProductImageSlider from "../components/ProductImageSlider";
import ReviewList from "../components/ReviewList";
import RelatedProducts from "../components/RelatedProducts";
import AddReview from "../components/AddReview";
import { addToCart as addToLocalCart } from "../utils/cart";
import { AuthContext } from "../context/AuthContext";
import WishlistButton from "../components/WishlistButton";
import { useTranslation } from "react-i18next";
import { FaCheck, FaShoppingCart } from "react-icons/fa";

function ProductDetail() {
	const { id } = useParams();
	const { t } = useTranslation();

	const [product, setProduct] = useState(null);
	const [loading, setLoading] = useState(true);
	const [added, setAdded] = useState(false);

	const { user, cartCount, setCartCount } = useContext(AuthContext);

	const handleAddToCart = async () => {
		if (added) return;

		if (user) {
			await api.post("/cart/", { product_id: product.id });
			setCartCount(cartCount + 1);
		} else {
			addToLocalCart(product);
			setCartCount(cartCount + 1);
		}

		setAdded(true);
	};

	useEffect(() => {
		api
			.get(`/products/${id}/`)
			.then((res) => setProduct(res.data))
			.finally(() => setLoading(false));
	}, [id]);

	if (loading)
		return (
			<div className="text-center py-5">
				<Spinner animation="border" />
			</div>
		);

	if (!product)
		return <Alert variant="danger">{t("product_detail.not_found")}</Alert>;

	return (
		<>
			<Row className="gy-4">
				<Col md={5}>
					<Card className="shadow-sm">
						<Card.Body
							style={{
								height: 380,
								overflow: "hidden",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<ProductImageSlider images={product.images} />
						</Card.Body>
					</Card>
				</Col>

				<Col md={7}>
					<h3 className="fw-semibold">{product.title}</h3>

					<p className="mb-2">
						{t("product_detail.rating")}{" "}
						<Badge bg="warning" text="dark">
							{product.average_rating} ★
						</Badge>
					</p>

					<div className="mb-2">
						{product.discount > 0 ? (
							<>
								<del className="text-muted me-2">${product.price}</del>
								<br/>
								<span className="fw-bold text-danger" style={{fontSize: 30}}>${product.final_price}</span>
							</>
						) : (
							<span className="fw-bold">${product.price}</span>
						)}
					</div>

					<p className="text-muted">{product.description}</p>

					<div className="d-flex align-items-center gap-2 mt-3 flex-wrap">
						<Button
							variant={added ? "success" : "primary"}
							onClick={handleAddToCart}
							disabled={added}
							className="d-flex align-items-center gap-2"
						>
							{added ? (
								<>
									<FaCheck /> {t("product_detail.added")}
								</>
							) : (
								<>
									<FaShoppingCart /> {t("product_detail.add")}
								</>
							)}
						</Button>

						<WishlistButton productId={product.id} />
					</div>
				</Col>
			</Row>

			<hr className="my-4" />

			<ReviewList reviews={product.reviews} />

			<AddReview
				productId={product.id}
				onReviewAdded={() => {
					api.get(`/products/${id}/`).then((res) => setProduct(res.data));
				}}
			/>

			<RelatedProducts productId={product.id} />
		</>
	);
}

export default ProductDetail;
