# Zora JDM - Frontend

A modern React-based frontend application for buying, selling, and managing Japanese Domestic Market (JDM) cars. Built with TypeScript, Vite, and Tailwind CSS.

## Features

- **Browse Cars**: Search and filter through JDM car listings
- **User Authentication**: Secure login and registration system
- **Favorites**: Save your favorite cars for later viewing
- **Sell Cars**: Upload and list your own cars with images
- **User Profile**: Manage your account and listed vehicles
- **Responsive Design**: Fully responsive UI that works on all devices
- **Image Upload**: Efficient car image uploading and management
- **Performance Optimized**: Optimized images and lazy loading

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Lightning fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Vitest** - Unit testing framework
- **Axios** - HTTP client for API calls

## Prerequisites

- Node.js 16.x or higher
- npm or yarn package manager

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```env
VITE_API_URL=http://localhost:5000
```

### 3. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build
- `npm run test` - Run unit tests
- `npm run test:ui` - Run tests with UI

## Project Structure

```
src/
├── components/        # Reusable React components
├── pages/            # Page components
├── api/              # API client configuration
├── hooks/            # Custom React hooks
├── utils/            # Utility functions
├── config/           # Configuration files
└── index.css         # Global styles
```

## Key Components

- **CarModal** - Modal for displaying car details
- **ImageUpload** - Component for uploading car images
- **SearchHero** - Hero section with search functionality
- **CollectionGrid** - Grid display for car listings
- **ProtectedRoute** - Route protection for authenticated users
- **Navbar** - Navigation component

## Related Documentation

- [Backend Documentation](../zora-jdm%20Backend/README.md)
- [Development Checklist](../DEVELOPMENT_CHECKLIST.md)
- [Testing Guide](../TESTING_GUIDE.md)

## License

All rights reserved. © 2024
