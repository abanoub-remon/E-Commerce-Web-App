# E-Commerce Project

This project is a full e-commerce web application built with:

- Django REST Framework (Backend)
- React & React-Bootstrap (Frontend)

## How to run

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

### frontend
cd frontend
npm install
npm start
