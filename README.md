# GOVERN·AI – AI Governance Audit Readiness Scorecard

A modern, offline-first React application designed to help organisations assess their AI governance maturity against key global regulations including the **EU AI Act**, **India DPDP Act 2023**, and the **RBI IT Governance Framework**.

## Features

- **Comprehensive Assessment**: 32 questions covering 7 critical governance domains (AI Inventory, Data Governance, Human Oversight, etc.).
- **Dynamic Risk Scoring**: Real-time scoring out of 200 points, weighted by regulatory criticality.
- **Risk Gap Identification**: Automatically highlights the top high-risk compliance gaps and provides actionable remediation guidance.
- **Visual Results**: Beautiful, animated score gauge and per-domain breakdown bars.
- **Board-Ready PDF Reports**: Generates a professional 5-page PDF report entirely client-side using native jsPDF drawing APIs (no server required, ensuring complete data privacy).

## Tech Stack

- **Frontend**: React (Create React App), Custom Hooks
- **Styling**: Tailwind CSS v3 (Custom dark mode aesthetic)
- **PDF Generation**: `jspdf` (100% client-side, programmatic rendering)
- **Data**: Static JSON question bank

## Getting Started

First, install the dependencies:
```bash
npm install
```

Then, run the development server:
```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Privacy & Security

This application is designed as a **self-assessment tool**. All data processing, score calculation, and PDF report generation happens entirely within the user's browser. No assessment data is ever sent to an external server.
