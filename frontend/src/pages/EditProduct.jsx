import { useEffect, useState } from "react";
import { Form, Button, Card, Alert, Row, Col, Badge } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useTranslation } from "react-i18next";
import { FaTrash, FaUpload } from "react-icons/fa";

function EditProduct() {
	const { t } = useTranslation();
	const { id } = useParams();
	const navigate = useNavigate();

	const [form, setForm] = useState(null);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const [images, setImages] = useState([]);
	const [newImages, setNewImages] = useState([]);

	useEffect(() => {
		api
			.get(`/products/${id}/`)
			.then((res) => {
				setForm(res.data);
				setImages(res.data.images || []);
			})
			.catch(() => setError(t("edit_product.load_failed")));
	}, [id, t]);

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleDeleteImage = async (imageId) => {
		if (!window.confirm(t("edit_product.confirm_delete_image"))) return;

		try {
			await api.delete(`/products/images/${imageId}/`);
			setImages((prev) => prev.filter((img) => img.id !== imageId));
		} catch {
			setError(t("edit_product.delete_failed"));
		}
	};

	const handleUploadImages = async () => {
		if (!newImages.length) return;

		const data = new FormData();
		newImages.forEach((img) => data.append("images", img));

		try {
			await api.post(`/products/${id}/upload-images/`, data);

			const refreshed = await api.get(`/products/${id}/`);
			setImages(refreshed.data.images || []);
			setNewImages([]);
			setSuccess(t("edit_product.upload_success"));
		} catch {
			setError(t("edit_product.upload_failed"));
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setSuccess("");

		try {
			await api.put(`/products/${id}/`, {
				title: form.title,
				description: form.description,
				price: form.price,
				stock: form.stock,
				discount: form.discount,
			});

			setSuccess(t("edit_product.update_success"));
			setTimeout(() => navigate("/seller/dashboard"), 800);
		} catch {
			setError(t("edit_product.update_failed"));
		}
	};

	if (!form) return null;

	return (
		<Card className="shadow-sm">
			<Card.Body>
				<Card.Title>{t("edit_product.title")}</Card.Title>

				{error && <Alert variant="danger">{error}</Alert>}
				{success && <Alert variant="success">{success}</Alert>}

				<Form onSubmit={handleSubmit}>
					<Form.Group className="mb-2">
						<Form.Label>{t("edit_product.fields.title")}</Form.Label>
						<Form.Control
							name="title"
							value={form.title}
							onChange={handleChange}
							required
						/>
					</Form.Group>

					<Form.Group className="mb-2">
						<Form.Label>{t("edit_product.fields.description")}</Form.Label>
						<Form.Control
							as="textarea"
							rows={3}
							name="description"
							value={form.description}
							onChange={handleChange}
							required
						/>
					</Form.Group>

					<Row>
						<Col md={4}>
							<Form.Group className="mb-2">
								<Form.Label>{t("edit_product.fields.price")}</Form.Label>
								<Form.Control
									name="price"
									type="number"
									value={form.price}
									onChange={handleChange}
									required
								/>
							</Form.Group>
						</Col>

						<Col md={4}>
							<Form.Group className="mb-2">
								<Form.Label>{t("edit_product.fields.stock")}</Form.Label>
								<Form.Control
									name="stock"
									type="number"
									value={form.stock}
									onChange={handleChange}
									required
								/>
							</Form.Group>
						</Col>

						<Col md={4}>
							<Form.Group className="mb-3">
								<Form.Label>{t("edit_product.fields.discount")}</Form.Label>
								<Form.Control
									name="discount"
									type="number"
									value={form.discount}
									onChange={handleChange}
								/>
							</Form.Group>
						</Col>
					</Row>

					<h6 className="mt-2">{t("edit_product.images_title")}</h6>

					<Row className="mb-3">
						{images.map((img) => (
							<Col md={3} sm={4} xs={6} key={img.id} className="mb-3 text-center">
								<div className="border rounded p-1">
									<img
										src={img.image}
										alt=""
										className="img-fluid rounded"
										style={{ height: 120, width: "100%", objectFit: "cover" }}
									/>
									<Button
										size="sm"
										variant="outline-danger"
										className="mt-2"
										onClick={() => handleDeleteImage(img.id)}
									>
										<FaTrash className="me-1" />
										{t("edit_product.delete_image")}
									</Button>
								</div>
							</Col>
						))}

						{!images.length && (
							<p className="text-muted small">{t("edit_product.no_images")}</p>
						)}
					</Row>

					<Form.Group className="mb-3">
						<Form.Label>{t("edit_product.upload_new")}</Form.Label>
						<Form.Control
							type="file"
							multiple
							accept="image/*"
							onChange={(e) => setNewImages([...e.target.files])}
						/>
						{newImages.length > 0 && (
							<Badge bg="secondary" className="mt-2">
								{newImages.length} {t("edit_product.files_selected")}
							</Badge>
						)}
					</Form.Group>

					<div className="d-flex justify-content-between mb-3 flex-wrap gap-2">
						<Button variant="secondary" size="sm" onClick={handleUploadImages}>
							<FaUpload className="me-1" />
							{t("edit_product.upload_btn")}
						</Button>

						<Button type="submit">{t("edit_product.save")}</Button>
					</div>
				</Form>
			</Card.Body>
		</Card>
	);
}

export default EditProduct;
