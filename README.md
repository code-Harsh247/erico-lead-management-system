# LeadFlow - Lead Management System

A modern React-based lead management system built with Vite, TailwindCSS, and a beautiful glassmorphism design.

## Features

- 🔐 Secure authentication system with JWT
- 🎨 Beautiful glassmorphism UI design
- 📱 Responsive design for all devices
- ⚡ Fast development with Vite
- 🎯 Modern React with hooks
- 🛡️ Type-safe API service layer

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- Backend API server running on port 3001

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd erico-lead-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env file with your configuration
   # VITE_API_BASE_URL=http://localhost:3001
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Make sure your backend API is running on port 3001**

## Project Structure

```
src/
├── components/
│   └── auth/
│       └── AuthSystem.jsx    # Authentication component
├── services/
│   └── apiService.js         # Central API service
├── App.jsx                   # Main application component
├── main.jsx                  # Application entry point
└── index.css                 # Global styles
```

## API Service

The application uses a centralized API service located in `src/services/apiService.js` that:

- Handles all HTTP requests to the backend
- Automatically includes the base URL from environment variables
- Provides convenient methods for different HTTP verbs
- Includes proper error handling and credentials management
- Exports specific API modules for different features (auth, leads, users)

### Usage Example

```javascript
import { authApi, leadsApi } from './services/apiService';

// Authentication
await authApi.login(credentials);
await authApi.logout();

// Leads management
const leads = await leadsApi.getAll();
await leadsApi.create(leadData);
```

## Environment Variables

- `VITE_API_BASE_URL`: Base URL for the backend API (default: http://localhost:3001)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Technology Stack

- **React** - UI library
- **Vite** - Build tool and development server
- **TailwindCSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Modern JavaScript** - ES6+ features

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
