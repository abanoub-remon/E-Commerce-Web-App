import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import api from "../api/axios";
import { useTranslation } from "react-i18next";

function ProductFilters({ filters = {}, setFilters }) {
	const { t } = useTranslation();

	const [categories, setCategories] = useState([]);
	const [brands, setBrands] = useState([]);
	const [tags, setTags] = useState([]);

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
		setFilters({
			...filters,
			[e.target.name]: e.target.value,
		});
	};

	return (
		<>
			<h5 className="mb-3">{t("filters.title")}</h5>

			<Form.Control
				type="text"
				placeholder={t("filters.search")}
				name="search"
				className="mb-3"
				value={filters.search || ""}
				onChange={handleChange}
			/>

			<Form.Select
				name="category"
				className="mb-3"
				onChange={handleChange}
				value={filters.category || ""}
			>
				<option value="">{t("filters.all_categories")}</option>
				{categories.map((cat) => (
					<option key={cat.id} value={cat.id}>
						{cat.name}
					</option>
				))}
			</Form.Select>

			<Form.Select
				name="brand"
				className="mb-3"
				onChange={handleChange}
				value={filters.brand || ""}
			>
				<option value="">{t("filters.all_brands")}</option>
				{brands.map((brand) => (
					<option key={brand.id} value={brand.id}>
						{brand.name}
					</option>
				))}
			</Form.Select>

			<Form.Select name="tag" onChange={handleChange} value={filters.tag || ""}>
				<option value="">{t("filters.all_tags")}</option>
				{tags.map((tag) => (
					<option key={tag.id} value={tag.id}>
						{tag.name}
					</option>
				))}
			</Form.Select>
		</>
	);
}

export default ProductFilters;
