import { useContext } from "react";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import { FaHeart } from "react-icons/fa";
import { useTranslation } from "react-i18next";

function WishlistButton({ productId }) {
	const { t } = useTranslation();
	const { user, wishlistIds, setWishlistIds } = useContext(AuthContext);

	if (!user) return null;

	const inWishlist = wishlistIds.has(productId);

	const toggle = async () => {
		if (inWishlist) {
			await api.delete(`/wishlist/${productId}/`);
			setWishlistIds((prev) => {
				const n = new Set(prev);
				n.delete(productId);
				return n;
			});
		} else {
			await api.post("/wishlist/", { product_id: productId });
			setWishlistIds((prev) => new Set(prev).add(productId));
		}
	};

	return (
		<OverlayTrigger
			placement="top"
			overlay={
				<Tooltip>{inWishlist ? t("wishlist.remove") : t("wishlist.add")}</Tooltip>
			}
		>
			<Button
				variant="link"
				onClick={toggle}
				aria-label={inWishlist ? t("wishlist.remove") : t("wishlist.add")}
				style={{
					fontSize: "20px",
					textDecoration: "none",
					padding: 0,
					lineHeight: 1,
				}}
			>
				<FaHeart color={inWishlist ? "#dc2626" : "#9ca3af"} />
			</Button>
		</OverlayTrigger>
	);
}

export default WishlistButton;
