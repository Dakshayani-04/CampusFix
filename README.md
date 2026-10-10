# CampusFix

CampusFix is a campus issue reporter built for students and administrators. Students can report problems such as broken fans, water outages, Wi-Fi failures, and damaged furniture. Administrators can update issue status so everyone can track progress.

## Features

- Student registration and login
- Secure JWT authentication
- SQLite database with seeded sample data
- Browse all campus issues
- Filter issues by status
- Pull to refresh
- Report an issue with title, description, category, location, and optional photo
- View issue details and reporter information
- View and delete your own issues
- Admin status updates: Pending, In Progress, and Resolved
- Secure token storage with Expo Secure Store
- Android and iOS-friendly React Native navigation with icons

## Tech Stack

- Mobile: React Native, Expo SDK 57, JavaScript, React Navigation, Axios
- Backend: Node.js, Express, JWT, bcryptjs, CORS
- Database: SQLite with better-sqlite3
- Mobile storage: expo-secure-store

## Project Structure

```text
campusfix/
  backend/
    server.js
    db.js
    seed.js
    routes/
    middleware/
    .env.example
  mobile/
    App.js
    app.json
    src/
      api/
      components/
      context/
      screens/
  README.md
```

## Requirements

- Node.js 20 or newer
- npm
- Expo Go SDK 57 on a physical phone, or an Android emulator
- Android Studio only if using an Android emulator

## Run the Backend

Open Terminal 1:

```powershell
cd "C:\Android app\campusfix\backend"
npm install
Copy-Item .env.example .env
npm run seed
npm start
```

The backend runs on port `5000`:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/api/health
```

Keep this terminal running.

## Run the Mobile App

Open Terminal 2:

```powershell
cd "C:\Android app\campusfix\mobile"
npm install
npx expo start --clear
```

Scan the QR code using Expo Go.

### Physical Android or iPhone

The phone and laptop must be connected to the same Wi-Fi network. The current API URL is configured in `mobile/src/api/config.js`:

```javascript
export const API_BASE_URL = "http://192.168.29.133:5000/api";
```

If your laptop receives a different Wi-Fi IP address, update that file with the new address. You can find the address on Windows with:

```powershell
ipconfig
```

For a physical phone, do not use `localhost` or `10.0.2.2`.

### Android Emulator

For an Android emulator, use:

```javascript
export const API_BASE_URL = "http://10.0.2.2:5000/api";
```

Then restart Expo:

```powershell
npx expo start --clear
```

## Test Accounts

Student:

```text
Email: student@campus.com
Password: student123
```

Admin:

```text
Email: admin@campus.com
Password: admin123
```

The admin account can change an issue status. Students can delete only their own issues.

## API Endpoints

| Method | Endpoint                 | Authentication | Purpose                              |
| ------ | ------------------------ | -------------- | ------------------------------------ |
| POST   | `/api/auth/register`     | No             | Register a student                   |
| POST   | `/api/auth/login`        | No             | Log in and receive a JWT             |
| GET    | `/api/issues`            | No             | List all issues; supports `?status=` |
| GET    | `/api/issues/:id`        | No             | Get issue details                    |
| POST   | `/api/issues`            | JWT            | Create an issue                      |
| GET    | `/api/issues/mine`       | JWT            | List the current user's issues       |
| PUT    | `/api/issues/:id/status` | Admin JWT      | Update issue status                  |
| DELETE | `/api/issues/:id`        | Owner JWT      | Delete an owned issue                |
| GET    | `/api/health`            | No             | Check API availability               |

## Test Checklist

1. Register a new student account.
2. Log in as a student.
3. View the All Issues list.
4. Test each status filter.
5. Open an issue's details.
6. Create a new report.
7. Attach an optional photo.
8. Confirm the report appears in My Issues.
9. Delete the report.
10. Log out.
11. Log in as the admin.
12. Change an issue from Pending to In Progress.
13. Change it from In Progress to Resolved.
14. Confirm the status badge changes color.
15. Log out.

## Security Notes

- Never commit `backend/.env`.
- Never commit `backend/campusfix.db` if you do not want local test data shared.
- Use a long random value for `JWT_SECRET` outside local development.
- The project stores the optional image URI for this demo. A production app should upload images to a dedicated storage service.

## GitHub

Repository:

https://github.com/Dakshayani-04/CampusFix
