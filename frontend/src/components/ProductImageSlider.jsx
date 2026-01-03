import { useState } from "react";
import { Carousel, Alert } from "react-bootstrap";
import { useTranslation } from "react-i18next";

function ProductImageSlider({ images = [] }) {
	const { t } = useTranslation();
	const [index, setIndex] = useState(0);

	if (!images || !images.length) {
		return (
			<Alert variant="light" className="text-center py-4">
				{t("product.no_images")}
			</Alert>
		);
	}

	return (
		<div>
			<div
				style={{
					borderRadius: 10,
					overflow: "hidden",
					background: "#f7f7f7",
				}}
			>
				<Carousel interval={null} activeIndex={index} onSelect={(i) => setIndex(i)}>
					{images.map((img, i) => (
						<Carousel.Item key={img.id || i}>
							<div
								style={{
									height: 460,
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									background: "#ffffff",
								}}
							>
								<img
									src={img.image}
									alt={`${t("product.image")} ${i + 1}`}
									style={{
										maxWidth: "100%",
										maxHeight: "100%",
										objectFit: "contain",
									}}
								/>
							</div>
						</Carousel.Item>
					))}
				</Carousel>
			</div>
		</div>
	);
}

export default ProductImageSlider;
