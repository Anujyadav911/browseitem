# CodeVector Backend Task

A high-performance backend built to serve and paginate through ~200,000 products quickly and reliably.

## Features

- **Fast Cursor-Based Pagination:** Uses Keyset Pagination instead of standard `OFFSET/LIMIT`. This guarantees that if products are added or updated concurrently, users never see duplicates or miss items while paginating.
- **High-Performance Indexing:** Uses compound PostgreSQL indexes (`category`, `updated_at`, `id`) to fetch pages via *Index Scans* in sub-milliseconds rather than scanning the table.
- **Fast Seeding Script:** Generates and inserts 200,000 rows in seconds using bulk insert batching.
- **Opaque Cursors:** Base64-encoded cursors abstract sorting logic away from the frontend.
- **Serverless PostgreSQL Driver:** Connects over WebSockets (Port 443) to easily bypass strict corporate/school firewalls that block standard Postgres connections (Port 5432).

## Tech Stack

- **Backend:** Node.js, Express, TypeScript
- **Validation:** Zod
- **Database:** PostgreSQL (Neon Serverless Driver)
- **Frontend UI:** Vanilla JS + Tailwind CSS (served statically)

---

## 🚀 How to Run Locally

### 1. Prerequisites
You need a PostgreSQL database. If you don't have one installed locally, create a free one on [Neon.tech](https://neon.tech) and copy the connection string.

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Environment Variables
Copy the example environment file and add your PostgreSQL connection string:
```bash
cp .env.example .env
```
Update `.env`:
```env
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
```

### 4. Start the Server (Auto-Initializes Database)
Start the server. On the first boot, it will automatically create the `products` table and the necessary compound indexes.
```bash
npm run start
```
*The server is now running on `http://localhost:3000`.*

### 5. Seed the Database (Run in a new terminal)
Populate the database with 200,000 products:
```bash
npm run seed
```

### 6. View the App
Open `http://localhost:3000` in your browser to test the paginated UI.

---

## ☁️ How to Deploy (Render)

1. Fork or push this repository to GitHub.
2. Go to [Render](https://render.com), select **New + -> Web Service**, and connect the repository.
3. Set the **Build Command** to: `npm install && npx tsc`
4. Set the **Start Command** to: `npm run start`
5. In **Environment Variables**, add your `DATABASE_URL`.
6. Once deployed, if your database is empty, you can seed it by running `npm run seed` in Render's web shell.
