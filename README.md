
# MindSpace 🌿

MindSpace is a mental wellness journal application that helps users record their daily thoughts, track moods, and understand their emotional patterns through visual insights.

## ✨ Features

- 📝 Write and save journal entries
- 😊 Track daily moods and mood scores
- 📔 View and delete journal entries
- 📊 Visualize mood distribution and weekly mood trends
- 🗄️ Store journal entries in MongoDB
- 🐳 Run the application using Docker

## 🛠️ Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS
- **Charts:** Recharts
- **Backend:** Next.js API Routes
- **Database:** MongoDB Atlas
- **Containerization:** Docker

## 🚀 Run Locally

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd MindSpace
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
MONGODB_URI=your_mongodb_connection_string
```

Replace the placeholder with your own MongoDB connection string.

### 4. Start the development server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## 🐳 Run with Docker

Build the Docker image:

```bash
docker build -t mindspace .
```

Run the container:

```bash
docker run -d --name mindspace-app -p 3000:3000 --env-file .env.local mindspace
```

Open http://localhost:3000.

## 🔐 Security

- Never commit `.env.local` or database credentials.
- Configure your own MongoDB connection string before running the app.

## 📌 Project Status

Core journaling, MongoDB integration, mood insights, and Docker containerization are implemented.

## 👨‍💻 Author

Himanshu Rajak
