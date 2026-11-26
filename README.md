# ClinicFlow

Clinic queue, appointment scheduling, billing, and patient management system built with **React + Vite + Tailwind CSS** (frontend) and **Spring Boot + Spring Data JPA + MySQL** (backend).

---

## Prerequisites

- **Node.js** 20+ and **npm**
- **Java 21** (JDK 21)
- **MySQL 8+** (running locally on `localhost:3306`)

---

## Running the Frontend

```powershell
cd frontend\clinicflow
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

### Useful Frontend Scripts
- `npm run dev` — start the Vite dev server
- `npm run lint` — run ESLint
- `npm run build` — build for production

### Demo Accounts (Frontend)
- **Staff:** `staff@clinicflow.test` / `ClinicFlowDemo!2026`
- **Patient:** `patient@clinicflow.test` / `PatientDemo!2026` *(or create a new patient account via `/register`)*

---

## Running the Backend

Database credentials are **not** hardcoded in `application.properties` so each developer can use their own local MySQL password without committing secrets to Git.

The backend automatically creates the `clinicflow` database if it does not exist yet (`createDatabaseIfNotExist=true`).

### Option A: Environment Variables (PowerShell)
```powershell
cd backend\clinicflow
$env:DB_PASSWORD="your_mysql_password"
# Optional if your MySQL username is not "root":
# $env:DB_USERNAME="your_mysql_username"
.\mvnw.cmd spring-boot:run
```

### Option B: Local-Only Properties File (Recommended)
1. Create `backend/clinicflow/src/main/resources/application-local.properties` (already ignored by `.gitignore`):
   ```properties
   spring.datasource.username=root
   spring.datasource.password=your_mysql_password
   ```
2. Start the backend with the `local` profile:
   ```powershell
   cd backend\clinicflow
   .\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=local
   ```

The API server runs at `http://localhost:8080`.

---

## Project Structure

```text
clinicflow/
├── backend/clinicflow/    # Spring Boot 4 / Java 21 / MySQL backend
└── frontend/clinicflow/   # React 19 / Vite 8 / Tailwind CSS 4 frontend
```
