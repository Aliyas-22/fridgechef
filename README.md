# 🥗 FridgeChef

**Cook with what you already have.**

FridgeChef is an AI-powered recipe generator built with Next.js. Tell it what ingredients you have in your fridge, and it instantly generates 3 personalized recipes using Google Gemini AI — complete with instructions, cook time, difficulty, tips, and more. Save your favourites and come back anytime.

---
<img width="1920" height="1022" alt="Screenshot (1725)" src="https://github.com/user-attachments/assets/27e68f37-6ecd-46f1-88c1-aaf2540aa336" />
<img width="1549" height="389" alt="Screenshot (1726)" src="https://github.com/user-attachments/assets/24d15e1a-9cc9-4734-9273-73b13054d346" />

## ✨ Features

- 🤖 **AI Recipe Generation** — Powered by Google Gemini AI; generates 3 tailored recipes from your listed ingredients
- 🧑‍🍳 **Rich Recipe Details** — Each recipe includes title, description, ingredients, step-by-step instructions, cook time, servings, difficulty, cuisine type, and cooking tips
- 💾 **Save Recipes** — Authenticated users can save recipes to their personal dashboard
- 🔐 **Authentication** — Secure sign up / login with NextAuth.js and bcrypt-hashed passwords
- 📱 **Mobile-first UI** — Clean, responsive design with smooth animations via Framer Motion
- 🆓 **Free to use** — No credit card required

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| AI | Google Gemini AI (`@google/generative-ai`) |
| Auth | NextAuth.js v4 |
| Database | MongoDB with Mongoose |
| Styling | Tailwind CSS v4 |
| UI Components | Radix UI (Dialog, Dropdown, Toast) |
| Animations | Framer Motion |
| Icons | Lucide React |
| Notifications | React Hot Toast |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB database (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- A [Google AI Studio](https://aistudio.google.com/) API key

### 1. Clone the repository

```bash
git clone https://github.com/Aliyas-22/fridgechef.git
cd fridgechef
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_random_secret_string
NEXTAUTH_URL=http://localhost:3000
GEMINI_API_KEY=your_google_gemini_api_key
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/          # API routes (auth, recipes, generate)
│   ├── auth/         # Login & Register pages
│   ├── dashboard/    # User dashboard (saved recipes)
│   ├── layout.tsx    # Root layout
│   └── page.tsx      # Landing page
├── components/       # Reusable UI components
├── lib/              # Utility functions (db connection, etc.)
├── models/
│   ├── User.ts       # Mongoose User model
│   └── Recipe.ts     # Mongoose Recipe model
├── types/            # TypeScript type definitions
└── middleware.ts     # Route protection (NextAuth)
```

---

## 🔒 Authentication

- Users register with name, email, and password
- Passwords are hashed with **bcryptjs**
- Sessions managed by **NextAuth.js**
- The `/dashboard` route is protected by middleware — unauthenticated users are redirected to `/auth/login`

---

## 🧠 How It Works

1. **Add ingredients** — Type whatever you have in your fridge or pantry
2. **AI generates recipes** — Gemini AI creates 3 unique recipes tailored to your ingredients
3. **Pick and cook** — Browse the recipes, view full details, and save favourites to your dashboard

---

## 📦 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## Screenshotsss

<img width="1920" height="968" alt="Screenshot (1749)" src="https://github.com/user-attachments/assets/17296575-c9c0-4dae-a64b-091a455324a4" />
<img width="1920" height="957" alt="Screenshot (1748)" src="https://github.com/user-attachments/assets/7201f80c-cb1b-4032-b898-a0e9a6585c9c" />
<img width="1920" height="1022" alt="Screenshot (1725)" src="https://github.com/user-attachments/assets/a832a414-b705-466a-904e-6cb5b0df054d" />

<img width="1920" height="982" alt="Screenshot (1752)" src="https://github.com/user-attachments/assets/a6af5d26-12fa-473f-bf4f-95afef214bd2" />




---

> Built with ❤️ by [Aliyas-22](https://github.com/Aliyas-22)
