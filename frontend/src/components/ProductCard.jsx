import { Card, Badge, OverlayTrigger, Tooltip, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import WishlistButton from "./WishlistButton";
import { useTranslation } from "react-i18next";

function ProductCard({ product, onAddToCart }) {
	const { t } = useTranslation();

	const image =
		product.images && product.images.length > 0
			? product.images[0].image
			: "https://via.placeholder.com/300";

	const hasDiscount = product.discount > 0;

	return (
		<Card className="h-100 shadow-sm">
			<Card.Img
				variant="top"
				src={image}
				alt={product.title}
				style={{ objectFit: "cover", height: 220 }}
			/>

			<Card.Body className="d-flex flex-column">
				<div className="d-flex justify-content-between align-items-start mb-2">
					<Card.Title className="h6 mb-0">{product.title}</Card.Title>

					{hasDiscount && (
						<Badge bg="danger" pill>
							-{product.discount}%
						</Badge>
					)}
				</div>

				<div className="mb-3">
					{hasDiscount ? (
						<>
							<span className="text-muted text-decoration-line-through me-2">
								${product.price}
							</span>
							<span className="fw-bold text-danger">${product.final_price}</span>
						</>
					) : (
						<span className="fw-bold">${product.price}</span>
					)}
				</div>

				<div className="mt-auto d-flex justify-content-between align-items-center">

					<div className="d-flex align-items-center gap-3">

						<OverlayTrigger
							placement="top"
							overlay={<Tooltip>{t("product.wishlist")}</Tooltip>}
						>
							<span className="d-flex align-items-center">
								<WishlistButton productId={product.id} />
							</span>
						</OverlayTrigger>
					</div>

					<Link to={`/products/${product.id}`}>
						<Button variant="outline-primary" size="sm">
							{t("product.view_details")}
						</Button>
					</Link>
				</div>
			</Card.Body>
		</Card>
	);
}

export default ProductCard;
