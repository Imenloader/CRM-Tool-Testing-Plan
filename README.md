# WhatsApp CRM Pro 🚀
### Data Science Ready Lead Management

WhatsApp CRM Pro is a professional, web-based tool designed to bridge the gap between WhatsApp sales and Meta (Facebook) Ads optimization. It allows businesses to track leads, capture high-value conversion data, and "train" the Meta algorithm using Offline Conversion API-ready exports.

## ✨ Key Features

- **Professional Dashboard**: Real-time analytics including Conversion Rate (CR%) and Average Lead Value (ALV).
- **Advanced Lead Capture**: Track Lead Name, Email, Phone, Status, and specific Sale Dates.
- **Systeme.io Integration**: Bulk import leads directly from your Systeme.io funnel exports.
- **Data Science Ready**: Automatically normalizes phone numbers (E.164) and emails for maximum Match Rates on Meta.
- **Meta Offline Conversions Export**: One-click generation of CSV files formatted perfectly for the Meta Events Manager.
- **Privacy First**: All data is stored locally in your browser (`localStorage`).

## 🛠️ Tech Stack

- **React 19** (Vite)
- **Tailwind CSS v4**
- **Lucide React** (Icons)

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Dev Server**:
   ```bash
   npm run dev
   ```

3. **Import Leads**: Click "Import Systeme.io" and upload your contact export.
4. **Track Sales**: Update statuses to "Purchased" and enter the sale value.
5. **Optimize Ads**: Click "Export to Meta" and upload the file to your Events Manager.

## 📈 Data Science Workflow

1. **Capture**: Funnel leads enter the CRM via Import.
2. **Close**: Conversations happen on WhatsApp; sales are recorded in the CRM.
3. **Clean**: The tool automatically formats data (20+ phone code, lowercase emails).
4. **Train**: Exported data is fed back to Meta to optimize for "Purchased" users instead of just clicks.

---
Built with ❤️ for professional marketers.
