import { useEffect, useState } from "react";
import { Table, Button, Form, Image } from "react-bootstrap";
import api from "../api/axios";
import { useTranslation } from "react-i18next";

function AdminCategories() {
	const { t } = useTranslation();

	const [categories, setCategories] = useState([]);
	const [name, setName] = useState("");
	const [editingId, setEditingId] = useState(null);
	const [image, setImage] = useState(null);

	const load = () => {
		api.get("/admin/categories/").then((res) => setCategories(res.data));
	};

	const startEdit = (cat) => {
		setEditingId(cat.id);
		setName(cat.name);
	};

	useEffect(() => {
		load();
	}, []);

	const submit = (e) => {
		e.preventDefault();

		const data = new FormData();
		data.append("name", name);
		if (image) data.append("image", image);

		const request = editingId
			? api.put(`/admin/categories/${editingId}/update/`, data)
			: api.post("/admin/categories/", data);

		request.then(() => {
			setName("");
			setImage(null);
			setEditingId(null);
			load();
		});
	};

	const remove = (id) => {
		if (!window.confirm(t("categories.confirm_delete"))) return;
		api.delete(`/admin/categories/${id}/`).then(load);
	};

	return (
		<>
			<h3 className="mb-4">{t("categories.manage")}</h3>

			<Form onSubmit={submit} className="mb-4">
				<Form.Control
					placeholder={t("categories.form.name")}
					value={name}
					onChange={(e) => setName(e.target.value)}
					required
					className="mb-2"
				/>

				<Form.Control
					type="file"
					accept="image/*"
					onChange={(e) => setImage(e.target.files[0])}
					className="mb-2"
				/>

				<Button type="submit">
					{editingId ? t("categories.update") : t("categories.save")}
				</Button>

				{editingId && (
					<Button
						variant="secondary"
						className="ms-2"
						onClick={() => {
							setEditingId(null);
							setName("");
							setImage(null);
						}}
					>
						{t("categories.cancel")}
					</Button>
				)}
			</Form>

			<Table bordered hover responsive>
				<thead>
					<tr>
						<th>{t("categories.table.image")}</th>
						<th>{t("categories.table.name")}</th>
						<th>{t("categories.table.actions")}</th>
					</tr>
				</thead>

				<tbody>
					{categories.map((c) => (
						<tr key={c.id}>
							<td>
								{c.image && (
									<Image
										src={c.image}
										rounded
										width={60}
										height={40}
										style={{ objectFit: "cover" }}
									/>
								)}
							</td>

							<td>{c.name}</td>

							<td>
								<Button
									size="sm"
									className="me-2"
									variant="secondary"
									onClick={() => startEdit(c)}
								>
									{t("categories.edit")}
								</Button>

								<Button size="sm" variant="danger" onClick={() => remove(c.id)}>
									{t("categories.delete")}
								</Button>
							</td>
						</tr>
					))}
				</tbody>
			</Table>
		</>
	);
}

export default AdminCategories;
