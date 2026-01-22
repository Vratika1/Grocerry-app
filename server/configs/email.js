import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Template directory path
const TEMPLATES_DIR = path.join(__dirname, '../templates/emails');

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.hostinger.com',
  port: process.env.SMTP_PORT || 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Load and process HTML template
const loadTemplate = (templateName, variables = {}) => {
  const templatePath = path.join(TEMPLATES_DIR, `${templateName}.html`);
  let html = fs.readFileSync(templatePath, 'utf8');
  
  // Replace all {{variable}} placeholders
  Object.keys(variables).forEach(key => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    html = html.replace(regex, variables[key] ?? '');
  });
  
  return html;
};

// Send email helper function
export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const mailOptions = {
      from: `"GreenCart" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''), // Fallback plain text
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email sending failed:', error.message);
    return { success: false, error: error.message };
  }
};

// ============ EMAIL FUNCTIONS ============

// Welcome email on signup
export const sendWelcomeEmail = async (user) => {
  const html = loadTemplate('welcome', {
    userName: user.name,
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173'
  });

  return sendEmail({
    to: user.email,
    subject: '🎉 Welcome to GreenCart!',
    html,
  });
};

// Order confirmation email
export const sendOrderConfirmationEmail = async (user, order, items) => {
  // Generate items HTML rows
  const itemsHtml = items
    .map(item => `
      <tr>
        <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; font-size: 15px; color: #4b5563;">${item.name}</td>
        <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; font-size: 15px; color: #4b5563; text-align: center;">${item.quantity}</td>
        <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; font-size: 15px; color: #4b5563; text-align: right; font-weight: 500;">₹${item.price}</td>
      </tr>
    `)
    .join('');

  const html = loadTemplate('order-confirmation', {
    userName: user.name,
    orderId: order._id.toString(),
    paymentType: order.paymentType,
    paymentStatus: order.isPaid ? '✅ Paid' : '⏳ Pending',
    statusClass: order.isPaid ? '' : 'pending',
    orderDate: new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    itemsHtml: itemsHtml,
    totalAmount: order.amount,
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173'
  });

  return sendEmail({
    to: user.email,
    subject: `✅ Order Confirmed - #${order._id.toString().slice(-8).toUpperCase()}`,
    html,
  });
};

// Payment success email
export const sendPaymentSuccessEmail = async (user, order) => {
  const html = loadTemplate('payment-success', {
    userName: user.name,
    amount: order.amount,
    orderId: order._id.toString(),
    paymentDate: new Date().toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173'
  });

  return sendEmail({
    to: user.email,
    subject: `💳 Payment Received - ₹${order.amount}`,
    html,
  });
};

// Price drop notification email
export const sendPriceDropEmail = async (user, product, oldPrice, newPrice) => {
  const savings = oldPrice - newPrice;
  
  const html = loadTemplate('price-drop', {
    userName: user.name,
    productName: product.name,
    productImage: product.image[0] || '',
    oldPrice: oldPrice,
    newPrice: newPrice,
    savings: savings,
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173'
  });

  return sendEmail({
    to: user.email,
    subject: `🔥 Price Drop Alert! ${product.name} is now ₹${newPrice}`,
    html,
  });
};

export default transporter;
