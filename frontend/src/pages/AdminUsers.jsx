import { useEffect, useState } from "react";
import { Table, Button, Badge } from "react-bootstrap";
import api from "../api/axios";
import { useTranslation } from "react-i18next";

function AdminUsers() {
	const { t } = useTranslation();
	const [users, setUsers] = useState([]);

	const loadUsers = () => {
		api.get("users/admin/users/").then((res) => setUsers(res.data));
	};

	useEffect(() => {
		loadUsers();
	}, []);

	const toggle = (id, field, value) => {
		api.put(`users/admin/users/${id}/toggle/`, { field, value }).then(loadUsers);
	};

	return (
		<>
			<h3 className="mb-4">{t("admin_users.manage")}</h3>

			<Table bordered hover responsive className="align-middle">
				<thead>
					<tr>
						<th>{t("admin_users.email")}</th>
						<th>{t("admin_users.status")}</th>
						<th>{t("admin_users.role")}</th>
						<th>{t("admin_users.actions")}</th>
					</tr>
				</thead>

				<tbody>
					{users.map((u) => (
						<tr key={u.id}>
							<td className="fw-semibold">{u.email}</td>

							<td>
								{u.is_active ? (
									<Badge bg="success">{t("admin_users.active")}</Badge>
								) : (
									<Badge bg="danger">{t("admin_users.disabled")}</Badge>
								)}
							</td>

							<td>
								{u.is_staff ? (
									<Badge bg="dark">{t("admin_users.admin")}</Badge>
								) : u.is_seller ? (
									<Badge bg="info">{t("admin_users.seller")}</Badge>
								) : (
									<Badge bg="secondary">{t("admin_users.user")}</Badge>
								)}
							</td>

							<td className="d-flex gap-2">
								<Button
									size="sm"
									variant={u.is_active ? "secondary" : "success"}
									onClick={() => toggle(u.id, "is_active", !u.is_active)}
								>
									{u.is_active ? t("admin_users.deactivate") : t("admin_users.activate")}
								</Button>

								{!u.is_staff && (
									<Button
										size="sm"
										variant={u.is_seller ? "secondary" : "primary"}
										onClick={() => toggle(u.id, "is_seller", !u.is_seller)}
									>
										{u.is_seller
											? t("admin_users.remove_seller")
											: t("admin_users.make_seller")}
									</Button>
								)}
							</td>
						</tr>
					))}
				</tbody>
			</Table>
		</>
	);
}

export default AdminUsers;
