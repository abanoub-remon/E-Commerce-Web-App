import { useContext, useEffect, useState } from "react";
import { Card, Form, Button, Alert, Row, Col, Image } from "react-bootstrap";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaUserCircle } from "react-icons/fa";

function Profile() {
	const { t } = useTranslation();
	const { user, setUser } = useContext(AuthContext);

	const [formData, setFormData] = useState({
		first_name: "",
		last_name: "",
		phone: "",
		address: "",
		city: "",
		country: "",
		birthdate: "",
		email: "",
		profile_image: null,
	});

	const [preview, setPreview] = useState(null);
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");

	// Load profile
	useEffect(() => {
		api
			.get("/users/profile/")
			.then((res) => {
				setFormData({ ...res.data, profile_image: null });
				setPreview(res.data.profile_image || null);
			})
			.catch(() => setError(t("profile.load_failed")));
	}, []);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (!file) return;

		setFormData({ ...formData, profile_image: file });
		setPreview(URL.createObjectURL(file));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setMessage("");

		try {
			const data = new FormData();

			Object.entries({
				first_name: formData.first_name,
				last_name: formData.last_name,
				phone: formData.phone,
				address: formData.address,
				city: formData.city,
				country: formData.country,
				birthdate: formData.birthdate,
			}).forEach(([k, v]) => data.append(k, v || ""));

			if (formData.profile_image instanceof File) {
				data.append("profile_image", formData.profile_image);
			}

			const res = await api.put("/users/profile/", data, {
				headers: { "Content-Type": "multipart/form-data" },
			});

			setUser(res.data);
			setMessage(t("profile.updated"));
		} catch {
			setError(t("profile.update_failed"));
		}
	};

	return (
		<Row className="justify-content-center mt-4">
			<Col md={8}>
				<Card className="shadow-sm">
					<Card.Body>
						<Card.Title className="mb-4 fw-semibold">{t("profile.title")}</Card.Title>

						{message && <Alert variant="success">{message}</Alert>}
						{error && <Alert variant="danger">{error}</Alert>}

						<Form onSubmit={handleSubmit} encType="multipart/form-data">
							<div className="text-center mb-4">
								{preview ? (
									<Image
										src={preview}
										roundedCircle
										width={120}
										height={120}
										style={{ objectFit: "cover" }}
									/>
								) : (
									<FaUserCircle size={120} color="#cbd5e1" />
								)}

								<div className="mt-2">
									<Form.Label className="small text-muted mb-1">
										{t("profile.picture")}
									</Form.Label>
									<Form.Control
										type="file"
										accept="image/*"
										onChange={handleImageChange}
									/>
								</div>
							</div>

							<Row>
								<Col md={6}>
									<Form.Group className="mb-2">
										<Form.Control
											name="first_name"
											placeholder={t("profile.first_name")}
											value={formData.first_name || ""}
											onChange={handleChange}
										/>
									</Form.Group>
								</Col>

								<Col md={6}>
									<Form.Group className="mb-2">
										<Form.Control
											name="last_name"
											placeholder={t("profile.last_name")}
											value={formData.last_name || ""}
											onChange={handleChange}
										/>
									</Form.Group>
								</Col>
							</Row>

							<Form.Group className="mb-2">
								<Form.Control
									name="phone"
									placeholder={t("profile.phone")}
									value={formData.phone || ""}
									onChange={handleChange}
								/>
							</Form.Group>

							<Form.Group className="mb-2">
								<Form.Control
									name="address"
									placeholder={t("profile.address")}
									value={formData.address || ""}
									onChange={handleChange}
								/>
							</Form.Group>

							<Row>
								<Col md={6}>
									<Form.Group className="mb-2">
										<Form.Control
											name="city"
											placeholder={t("profile.city")}
											value={formData.city || ""}
											onChange={handleChange}
										/>
									</Form.Group>
								</Col>

								<Col md={6}>
									<Form.Group className="mb-2">
										<Form.Control
											name="country"
											placeholder={t("profile.country")}
											value={formData.country || ""}
											onChange={handleChange}
										/>
									</Form.Group>
								</Col>
							</Row>

							<Form.Group className="mb-2">
								<Form.Control
									type="date"
									name="birthdate"
									value={formData.birthdate || ""}
									onChange={handleChange}
								/>
							</Form.Group>

							<Form.Group className="mb-3">
								<Form.Control
									value={formData.email || ""}
									disabled
									className="bg-light"
								/>
							</Form.Group>

							<Button type="submit" className="w-100">
								{t("profile.save")}
							</Button>
						</Form>
					</Card.Body>
				</Card>

				<Card className="mt-4 shadow-sm">
					<Card.Body>
						<Card.Title className="fw-semibold">{t("profile.security")}</Card.Title>

						<p className="text-muted small mb-3">{t("profile.security_text")}</p>

						<Link to="/change-password">
							<Button variant="outline-danger">{t("profile.change_password")}</Button>
						</Link>
					</Card.Body>
				</Card>
			</Col>
		</Row>
	);
}

export default Profile;
