const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const Groq = require('groq-sdk');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// Middleware
app.use(cors());
app.use(express.json());

// Create email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Generate email endpoint
app.post('/generate-email', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a professional email writer. Generate a well-structured email with a clear subject line and professional body content. Format your response as JSON with "subject" and "body" fields.'
        },
        {
          role: 'user',
          content: `Write an email based on this prompt: ${prompt}`
        }
      ],
      model: 'mixtral-8x7b-32768',
      temperature: 0.7,
      max_tokens: 1000
    });

    const generatedContent = completion.choices[0]?.message?.content;
    
    // Try to parse as JSON, fallback to plain text
    let emailContent;
    try {
      emailContent = JSON.parse(generatedContent);
    } catch {
      // If not JSON, create structure from plain text
      const lines = generatedContent.split('\n');
      emailContent = {
        subject: lines[0] || 'Generated Email',
        body: generatedContent
      };
    }

    res.json(emailContent);
  } catch (error) {
    console.error('Error generating email:', error);
    res.status(500).json({ error: 'Failed to generate email' });
  }
});

// Send email endpoint
app.post('/send-email', async (req, res) => {
  try {
    const { recipients, subject, body } = req.body;

    if (!recipients || !subject || !body) {
      return res.status(400).json({ error: 'Recipients, subject, and body are required' });
    }

    // Parse recipients (comma-separated)
    const recipientList = recipients.split(',').map(email => email.trim());

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipientList,
      subject: subject,
      html: body.replace(/\n/g, '<br>')
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});