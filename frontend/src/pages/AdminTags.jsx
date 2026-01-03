import { useEffect, useState } from "react";
import { Table, Button, Form, Badge } from "react-bootstrap";
import api from "../api/axios";
import { useTranslation } from "react-i18next";

function AdminTags() {
	const { t } = useTranslation();

	const [tags, setTags] = useState([]);
	const [name, setName] = useState("");

	const load = () => {
		api.get("/admin/tags/").then((res) => setTags(res.data));
	};

	useEffect(() => {
		load();
	}, []);

	const submit = (e) => {
		e.preventDefault();

		api.post("/admin/tags/", { name }).then(() => {
			setName("");
			load();
		});
	};

	const remove = (id) => {
		if (!window.confirm(t("tags.confirm_delete"))) return;
		api.delete(`/admin/tags/${id}/`).then(load);
	};

	return (
		<>
			<h3 className="mb-4">{t("tags.manage")}</h3>

			<Form onSubmit={submit} className="mb-4 d-flex gap-2 flex-wrap">
				<Form.Control
					placeholder={t("tags.form.name")}
					value={name}
					onChange={(e) => setName(e.target.value)}
					required
					style={{ maxWidth: 320 }}
				/>

				<Button type="submit">{t("tags.add")}</Button>
			</Form>

			<Table bordered hover responsive className="align-middle">
				<thead>
					<tr>
						<th>{t("tags.table.name")}</th>
						<th className="text-center">{t("tags.table.actions")}</th>
					</tr>
				</thead>

				<tbody>
					{tags.map((tag) => (
						<tr key={tag.id}>
							<td>
								<Badge bg="light" text="dark">
									{tag.name}
								</Badge>
							</td>

							<td className="text-center">
								<Button size="sm" variant="danger" onClick={() => remove(tag.id)}>
									{t("tags.delete")}
								</Button>
							</td>
						</tr>
					))}
				</tbody>
			</Table>
		</>
	);
}

export default AdminTags;
