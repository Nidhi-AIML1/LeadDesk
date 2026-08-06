# LeadDesk Mini

LeadDesk Mini is a full-stack lead-capture application. Visitors submit a lead from the public page and authenticated administrators search, manage, and update lead statuses from `/admin`.

## Features

- Public lead form with client- and server-side validation.
- MongoDB persistence for leads and administrator accounts.
- JWT-protected admin API routes.
- Admin login, lead search, status updates (`New`, `Contacted`, `Closed`), and deletion.
- Deployment-ready Vercel configuration for the client and Render Blueprint for the API.

## Tech stack

- Client: React, Vite, Tailwind CSS, Axios
- API: Node.js, Express, Mongoose
- Database: MongoDB Community locally or MongoDB Atlas in production
- Authentication: bcrypt password hashing and signed JWT bearer tokens with a seven-day expiry

## Data model

### User

| Field | Purpose |
| --- | --- |
| `name` | Administrator display name |
| `email` | Unique, normalized login email |
| `password` | bcrypt-hashed password; never returned by the API |
| `createdAt`, `updatedAt` | Audit timestamps |

### Lead

| Field | Purpose |
| --- | --- |
| `name`, `email`, `budget`, `message` | Required public lead details |
| `phone`, `company`, `service` | Optional context |
| `status` | `New`, `Contacted`, or `Closed` |
| `createdAt`, `updatedAt` | Audit timestamps |

## Run locally

Prerequisites: Node.js 20+ and MongoDB Community Server running locally.

```powershell
cd server
Copy-Item .env.example .env
npm install
npm run dev
```

In a second terminal:

```powershell
cd client
Copy-Item .env.example .env
npm install
npm run dev
```

Open `http://127.0.0.1:5173`.

## Create the first administrator

There is intentionally no public administrator-registration screen. Create the first account through Postman:

```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Admin",
  "email": "admin@example.com",
  "password": "Use-a-password-of-at-least-8-characters"
}
```

Use those credentials at `http://127.0.0.1:5173/login`.

## API

| Method | Route | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/leads` | Public | Create a lead |
| `POST` | `/api/auth/register` | Bootstrap | Create an administrator |
| `POST` | `/api/auth/login` | Public | Receive a JWT |
| `GET` | `/api/leads?search=` | JWT required | List/search leads |
| `PUT` | `/api/leads/:id` | JWT required | Change lead status |
| `DELETE` | `/api/leads/:id` | JWT required | Delete a lead |

## Deploy

1. Create a MongoDB Atlas database and database user, or use another managed MongoDB provider.
2. Deploy `server` to Render using `server/render.yaml`. Set `MONGO_URI` and `CLIENT_URL` in Render.
3. Deploy `client` to Vercel. Its `vercel.json` proxies production `/api` requests to the Render service; update that Render hostname there if you deploy a differently named backend.
4. Update Render `CLIENT_URL` with the Vercel site URL, redeploy the API, then test in a private/incognito browser window.

## Submission checklist

- [ ] Put this project in a public GitHub repository.
- [ ] Add the deployed landing-page URL and `/admin` URL here.
- [ ] Create a test administrator account and share its credentials only with evaluators.
- [ ] Record a Loom showing: lead submission → admin login → search → status change.
- [ ] Test the deployed flow in an incognito browser.
