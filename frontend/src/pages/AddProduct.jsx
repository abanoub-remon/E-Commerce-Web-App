import { useEffect, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useTranslation } from "react-i18next";

function AddProduct() {
	const navigate = useNavigate();
	const { t } = useTranslation();

	const [form, setForm] = useState({
		title: "",
		description: "",
		price: "",
		stock: "",
		category: "",
		brand: "",
		discount: 0,
	});

	const [categories, setCategories] = useState([]);
	const [brands, setBrands] = useState([]);
	const [tags, setTags] = useState([]);
	const [selectedTags, setSelectedTags] = useState([]);

	const [images, setImages] = useState([]);
	const [error, setError] = useState("");
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		api.get("/categories/").then((res) => {
			const data = res.data;
			setCategories(Array.isArray(data) ? data : data.results || []);
		});

		api.get("/brands/").then((res) => {
			const data = res.data;
			setBrands(Array.isArray(data) ? data : data.results || []);
		});

		api.get("/tags/").then((res) => {
			const data = res.data;
			setTags(Array.isArray(data) ? data : data.results || []);
		});
	}, []);

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setSubmitting(true);

		try {
			const res = await api.post("/products/", {
				...form,
				tags: selectedTags,
			});

			const productId = res.data.id;

			if (images.length) {
				const imgData = new FormData();
				images.forEach((img) => imgData.append("images", img));

				await api.post(`/products/${productId}/upload-images/`, imgData);
			}

			navigate("/seller/dashboard");
		} catch (err) {
			setError(err?.response?.data?.detail || t("add_product.error_generic"));
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<Card className="shadow-sm">
			<Card.Body>
				<Card.Title className="mb-3">{t("add_product.title")}</Card.Title>

				{error && <Alert variant="danger">{error}</Alert>}

				<Form onSubmit={handleSubmit}>
					<Form.Control
						className="mb-2"
						name="title"
						placeholder={t("add_product.fields.title")}
						onChange={handleChange}
						required
					/>

					<Form.Control
						as="textarea"
						rows={3}
						className="mb-2"
						name="description"
						placeholder={t("add_product.fields.description")}
						onChange={handleChange}
						required
					/>

					<Form.Control
						className="mb-2"
						name="price"
						type="number"
						placeholder={t("add_product.fields.price")}
						onChange={handleChange}
						required
					/>

					<Form.Control
						className="mb-2"
						name="stock"
						type="number"
						placeholder={t("add_product.fields.stock")}
						onChange={handleChange}
						required
					/>

					<Form.Select
						className="mb-2"
						name="category"
						onChange={handleChange}
						required
					>
						<option value="">{t("add_product.fields.category")}</option>
						{categories.map((c) => (
							<option key={c.id} value={c.id}>
								{c.name}
							</option>
						))}
					</Form.Select>

					<Form.Select className="mb-2" name="brand" onChange={handleChange}>
						<option value="">{t("add_product.fields.brand")}</option>
						{brands.map((b) => (
							<option key={b.id} value={b.id}>
								{b.name}
							</option>
						))}
					</Form.Select>

					<Form.Select
						multiple
						className="mb-2"
						onChange={(e) =>
							setSelectedTags([...e.target.selectedOptions].map((o) => o.value))
						}
					>
						{tags.map((t) => (
							<option key={t.id} value={t.id}>
								{t.name}
							</option>
						))}
					</Form.Select>

					<Form.Control
						className="mb-2"
						name="discount"
						type="number"
						placeholder={t("add_product.fields.discount")}
						onChange={handleChange}
					/>

					<Form.Control
						className="mb-3"
						type="file"
						multiple
						accept="image/*"
						onChange={(e) => setImages([...e.target.files])}
					/>

					<Button type="submit" disabled={submitting}>
						{submitting ? t("add_product.creating") : t("add_product.submit")}
					</Button>
				</Form>
			</Card.Body>
		</Card>
	);
}

export default AddProduct;
