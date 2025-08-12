# 📧 AI Email Sender (Full Stack Application)

This project is a full-stack web application that allows users to **generate AI-based emails** and send them to one or more recipients. The app integrates with the **Groq API** for email generation and uses **Nodemailer** to send emails via Gmail SMTP.

---

## 🚀 Features

- ✅ Input prompt to generate emails using **AI (Groq API)**
- ✅ Editable email content before sending
- ✅ Multiple recipients support (comma-separated)
- ✅ Email sending via **Nodemailer** (Gmail SMTP)
- ✅ Full-stack architecture with **React + Node.js + Express**

---

## 🛠️ Tech Stack

| Layer     | Technology             |
|-----------|------------------------|
| Frontend  | React.js               |
| Backend   | Node.js, Express       |
| AI API    | Groq (LLM)             |
| Email     | Nodemailer + Gmail SMTP|
| Styling   | CSS (or Tailwind)      |

---

## 📦 Project Structure

```
AI-Email-Sender/
├── client/                 # React Frontend
│   └── src/
│       └── components/     # UI Components
│       └── App.js
│       └── index.js
│
├── server/                 # Node.js Backend
│   ├── routes/
│   │   └── emailRoutes.js
│   ├── controllers/
│   │   └── emailController.js
│   ├── utils/
│   │   └── groqClient.js   # Groq API integration
│   └── server.js
│
├── .env                    # Environment Variables
├── README.md               # Project README
```

---

## ⚙️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/ai-email-sender.git
cd ai-email-sender
```

---

### 2. Setup Environment Variables

Create a `.env` file in the `/server` directory with the following:

```env
********************************************************
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

> ⚠️ Use Gmail App Password (not your login password) for `EMAIL_PASS`.

---

### 3. Install Dependencies

#### Backend:
```bash
cd server
npm install
```

#### Frontend:
```bash
cd ../client
npm install
```

---

### 4. Run the Application

#### Start Backend:
```bash
cd server
node server.js
```

#### Start Frontend:
```bash
cd ../client
npm start
```

---

## 🌐 Application Flow

1. User enters:
   - List of recipient emails
   - Prompt for email content

2. On clicking **Generate Email**:
   - Prompt is sent to Groq API
   - AI generates email content

3. User edits if needed and clicks **Send Email**:
   - Email is sent to all listed recipients via Nodemailer

---

## 🧠 AI Model Info (Groq)

- Model: `mixtral-8x7b-32768` or `llama3-70b-8192`
- Docs: [https://console.groq.com/docs/quickstart](https://console.groq.com/docs/quickstart)

---

## 📧 Email Sending Info

- Library: [Nodemailer](https://nodemailer.com/about/)
- Transport: Gmail SMTP
- Auth: Gmail App Password (2FA recommended)

---

## 📌 Notes

- Make sure to **run the tracking script** during development if submitting as an assignment.
- Edit UI and styles as needed.
- This project was built as part of an **Internshala assignment** with a 1-hour time constraint.

---

## 🙌 Acknowledgements

- [Groq API](https://console.groq.com/)
- [Nodemailer](https://nodemailer.com/)
- [React](https://reactjs.org/)
- [Express](https://expressjs.com/)
