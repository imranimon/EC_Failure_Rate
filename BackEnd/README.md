# Backend Setup Instructions

## Setting Up the Project

### 1. Create a Virtual Environment

- Navigate to the `BackEnd` folder:
  ```
  cd BackEnd
  ```
- Create a virtual environment:
  ```
  python -m venv venv
  ```
- Activate the virtual environment:
  - On Windows:
    ```
    venv\Scripts\activate
    ```
  - On macOS/Linux:
    ```
    source venv/bin/activate
    ```

### 2. Install Required Packages

- Install all required dependencies:
  ```
  pip install -r requirements.txt
  ```

---

## Configure Environment Variables

### 1. Create a `.env` File

- Inside the `BackEnd/BackEnd` folder, create a file named `.env`
- Add the following keys and values to the `.env` file:
  ```
  SECRET_KEY=
  DEBUG=
  DB_NAME=
  DB_USER=
  DB_PASSWORD=
  DB_HOST=
  DB_PORT=
  ```

---

## Setting Up the Database

### 1. Create a Database

- Ensure your database server (e.g., MySQL) is running.
- Create a database (`e.g.,ec_failure_rate)` For MySQL:
  ```
  CREATE DATABASE ec_failure_rate;
  ```

### 2. Apply Migrations

- Run the following commands to set up the database schema:
  ```
  python manage.py makemigrations
  python manage.py migrate
  ```
- This will create the necessary tables, including the ones for the API models.

---

## Essential Commands

### 1. Run the Development Server

- Start the Django development server:
  ```
  python manage.py runserver
  ```
- The server will be accessible at [http://127.0.0.1:8000/]().

### 2. Make Migrations

- Detect changes in models:
  ```
  python manage.py makemigrations
  ```

### 3. Apply Migrations

- Apply the changes to the database:
  ```
  python manage.py migrate
  ```

---

## Create a Superuser

To access the Django admin interface at `/admin`:

### 1. Create a Superuser

- Run the following command:
  ```
  python manage.py createsuperuser
  ```
- Follow the prompts to set up a username, email, and password.

### 2. Access the Admin Interface

- Navigate to [http://127.0.0.1:8000/admin/]().
- Log in using the superuser credentials you just created.

---

## Summary of Commands

| Command                            | Description                                       |
| ---------------------------------- | ------------------------------------------------- |
| `python manage.py runserver`       | Starts the development server                     |
| `python manage.py makemigrations`  | Detects changes in the models                     |
| `python manage.py migrate`         | Applies migrations to the database                |
| `python manage.py createsuperuser` | Creates a superuser for accessing the admin panel |

---

Follow these instructions to set up and run the backend successfully. If you encounter issues, ensure all dependencies are installed and that the `.env` file is correctly configured.
