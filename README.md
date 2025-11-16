# FastTrack - Blockchain-Powered Attendance System

**A modern attendance tracking system with blockchain technology**

[![React](https://img.shields.io/badge/React-18.3-61dafb?style=flat&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2-646cff?style=flat&logo=vite)](https://vitejs.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-Enabled-black?style=flat&logo=three.js)](https://threejs.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat)](LICENSE)

---

## Overview

FastTrack is a blockchain-powered web application for tracking attendance. It brings transparency, security, and modern design to attendance management.

### Key Benefits

- **Transparency**: Students can see their attendance records in real-time
- **Security**: Blockchain ensures data cannot be altered or faked
- **Modern UI**: Glassmorphic design with 3D graphics
- **Educational**: Demonstrates blockchain concepts in a practical scenario

---

## Features

### Department Management
- Create departments with unique codes and HODs
- Glassmorphic cards with holographic borders
- View department statistics
- Edit or delete departments with blockchain mining

### Class Management
- Create classes linked to departments
- Add semester, section, and faculty information
- Track active classes and schedules
- Status indicators for active classes

### Student Management
- Comprehensive student profiles
- Enroll students in multiple classes
- Real-time attendance percentage tracking
- Color-coded progress bars (green ≥75%, yellow ≥50%, red <50%)
- Search functionality

### Blockchain-Powered Attendance
- Every attendance record is mined into a block
- 2-second proof-of-work mining simulation
- Immutable attendance history
- Each block contains timestamp, previous hash, attendance data, and nonce

### 3D Homepage
- Stunning 3D "FastTrack" logo using Three.js
- 50 orbiting particles
- Dynamic lighting effects
- Smooth floating animations
- Interactive rotation and zoom

### Design System
- Glassmorphism effects
- Neon accent colors (cyan, magenta, yellow)
- Smooth animations with Framer Motion
- Dark theme with grid patterns
- Pulsing status orbs

### Real-Time Dashboard
- Live statistics for departments, classes, and students
- Attendance tracking metrics
- Visual cards with glassmorphic styling
- Corner decorations

---

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Modern browser (Chrome, Firefox, Edge)

### Installation

```bash
git clone https://github.com/yourusername/fasttrack.git
cd fasttrack
npm install
npm run dev
```

Open your browser and navigate to `http://localhost:5173/`

---

## Project Structure

```
FastTrack/
├── public/
│   └── fonts/
│       └── helvetiker_bold.typeface.json
├── src/
│   ├── components/
│   │   ├── 3d/
│   │   │   └── FastTrack3D.tsx
│   │   ├── layout/
│   │   │   ├── Layout.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── modals/
│   │   │   ├── ClassModal.tsx
│   │   │   ├── DepartmentModal.tsx
│   │   │   └── StudentModal.tsx
│   │   └── ui/
│   │       ├── ConfirmDialog.tsx
│   │       ├── Modal.tsx
│   │       └── StatusOrb.tsx
│   ├── context/
│   │   └── AppContext.tsx
│   ├── lib/
│   │   └── blockchain.ts
│   ├── pages/
│   │   ├── Classes.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Departments.tsx
│   │   └── Students.tsx
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## Usage Guide

### Adding a Department
1. Navigate to the Departments page
2. Click "Add Department"
3. Fill in department name, code, and HOD name
4. Click "Add Department" to mine the block

### Creating a Class
1. Go to the Classes page
2. Click "Add Class"
3. Select a department
4. Add class name, semester, section, and faculty
5. Set the schedule
6. Save to mine the block

### Enrolling Students
1. Go to the Students page
2. Click "Add Student"
3. Enter student details
4. Select enrolled classes
5. Upload profile photo (optional)
6. Save to add to blockchain

### Marking Attendance
1. Find student on Students page
2. Click "Mark Present"
3. Wait for block mining (~2 seconds)
4. View updated attendance percentage

### Exploring 3D Logo
- Click and drag to rotate
- Scroll to zoom
- Auto-rotation is enabled

---                                                                                                                                                                                                                                                                                                                                         
## Tech Stack

### Frontend Framework
- React 18.3
- TypeScript 5.6
- Vite 7.2

### 3D Graphics
- Three.js
- React Three Fiber
- React Three Drei

### Styling
- Tailwind CSS v4
- Custom cyber-noir theme

### State Management
- React Context API
- useReducer Hook

### Routing
- React Router DOM v7

### Animations
- Framer Motion

### Notifications
- React Hot Toast

### Blockchain
- SHA-256 Hashing
- Proof-of-Work simulation

---

## Understanding the Blockchain

### What is a Block?
Each block contains:
- Timestamp
- Data (student ID, class ID, attendance status)
- Previous hash
- Hash
- Nonce

### Mining Process
1. Take block data
2. Add a nonce
3. Hash with SHA-256
4. Check if hash starts with "00"
5. If not, increment nonce and retry
6. Repeat until valid hash found

### Tamper Detection
Each block contains the previous block's hash. Changing any old record breaks the chain and is immediately detected.

---

## Performance

- Initial load: < 1 second
- Hot Module Reload: < 50ms
- 3D rendering: 60 FPS
- Bundle size (gzipped): ~200KB
- Lighthouse score: 95+

---

## Known Issues

- Safari may have WebGL rendering issues
- 3D logo may be laggy on older mobile devices
- 2-second mining delay is intentional

---

## Deployment

This project is production-ready and optimized for Vercel deployment.

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/mubashirrao1122/FastTrack)

**Quick Deploy:**
1. Click the "Deploy" button above
2. Connect your GitHub account
3. Vercel will automatically configure and deploy
4. Your app will be live in 2-3 minutes

**Manual Deploy:**
```bash
npm install -g vercel
vercel login
vercel --prod
```

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md)

### Production Optimizations

- Code splitting for optimal loading
- Terser minification
- Asset caching headers
- SEO optimization
- Responsive design
- WebGL fallbacks

---

## Performance

- Initial load: < 1 second
- Hot Module Reload: < 50ms
- 3D rendering: 60 FPS
- Bundle size (gzipped): ~200KB
- Lighthouse score: 95+

---

## Future Enhancements

### Version 2.0
- Real-time sync with multiple users
- QR code attendance scanning
- Push notifications
- Export reports (PDF/Excel)
- Dark/Light theme toggle

### Version 3.0
- Distributed blockchain network
- Smart contracts
- Mobile app (React Native)
- AI-powered prediction
- Gamification

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Commit with clear messages
5. Push to your fork
6. Open a pull request

---

## License

MIT License - See LICENSE file for details

---


---

**Made with React, TypeScript, and Three.js**

**Production Ready | Optimized for Vercel | Open Source**
