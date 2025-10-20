# Landmark App

🚀 **Live Demo**: [View Live Demo](https://landmark-app.vercel.app/)

A modern web application for discovering, sharing, and rating landmarks around the world. Built with Vue 3 and Firebase, featuring interactive maps, photo uploads, and user authentication.

## Task

📋 **Task Description**: [View Task Requirements](https://docs.google.com/document/d/1nCHuBjLxwJvzXHCDFUMZMPh5VyTI4bJj0waSy1RntHk/edit?tab=t.0#heading=h.5dt3hghpa22f)

## How to run the app

### Prerequisites:

- Node.js >=20.19.0 or >=22.12.0

### Setup and Development Flow:

1. **Install dependencies:**

   ```bash
   npm install
   ```
2. **Create `.env` file in the root directory and specify Firebase environment variables:**
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

3. **Prepare Husky for git hooks:**

   ```bash
   npm run prepare
   ```

4. **Start the development server:**

   ```bash
   npm run dev
   ```
5. **Build the application:**

   ```bash
   npm run build
   ```

6. **Preview the built application locally using Vite:**

   ```bash
   npm run preview
   ```

## Database snapshot

The application uses Firebase Firestore for data storage with the following structure:

### Collections:

```
landmarks/{landmarkId}
```

### Document Structure:

```typescript
{
  id: string;                    // Document ID
  title: string;                 // Landmark title
  description: string;           // Landmark description
  location: {                    // Geographic coordinates
    lat: number;
    lng: number;
  };
  createdBy: string;             // User ID who created the landmark
  photos: Photo[];               // Array of uploaded photos
  rating: number;                // Calculated average rating (1-5)
  visits: number;                // Number of users who rated
  userRatings: {                 // Individual user ratings
    [userId: string]: 1 | 2 | 3 | 4 | 5;
  };
}
```

### Database Features:

- **User Authentication**: Firebase Authentication with email/password
- **Data Fetching**: Request-based via TanStack Query (no live listeners by default)
- **File Storage**: Firebase Storage for landmark photos
- **Geographic Queries**: Client-side filtering by map bounds
- **Rating System**: Transactional rating updates with automatic calculation
- **Security**: Data is scoped to authenticated users only
- **Pagination**: Efficient data loading with cursor-based pagination

### Core Technologies:

- **Vue 3** - Progressive JavaScript framework with Composition API
- **Vue Router** - Official router for Vue.js SPA navigation
- **Pinia** - Modern state management for Vue applications
- **Vite** - Fast build tool and development server
- **TypeScript** - Type-safe JavaScript development
- **TanStack Query (Vue Query)** - Data fetching, caching, background updates
- **Firebase** - Backend-as-a-Service platform
- **Firestore** - NoSQL document database
- **Firebase Storage** - File storage service
- **Firebase Authentication** - User authentication service

### UI & Styling:

- **Tailwind CSS** - Utility-first CSS framework
- **Reka UI** - Accessible Vue component library
- **Lucide Vue Next** - Beautiful & consistent icon toolkit
- **Vue Virtual Scroller** - Efficient virtual scrolling for large lists
- **Class Variance Authority** - Component variant management

### Forms & Validation:

- **VeeValidate** - Form validation library
- **Zod** - TypeScript-first schema validation
- **@vee-validate/zod** - Integration between VeeValidate and Zod

### State Management & Data Fetching:

- **@tanstack/vue-query** - Powerful data synchronization for Vue
- **@vueuse/core** - Collection of Vue composition utilities
- **Vue Sonner** - Toast notification system

### Maps & Geolocation:

- **Leaflet** - Open-source JavaScript library for mobile-friendly interactive maps
- **OpenStreetMap** - Free map tiles

### Code Quality and Development Tools:

- **ESLint** - JavaScript linting utility with Vue support
- **Prettier** - Code formatter
- **Husky** - Git hooks made easy
- **Lint-staged** - Run linters on staged files
- **Vue DevTools** - Browser extension for Vue.js debugging
- **TypeScript** - Static type checking

### Commands

| Command              | Description                                  |
| -------------------- | -------------------------------------------- |
| `npm install`        | Installs dependencies                        |
| `npm run dev`        | Starts local dev server                      |
| `npm run build`      | Builds the project                           |
| `npm run preview`    | Starts local server to serve dist folder     |
| `npm run type-check` | Runs TypeScript type checking                |
| `npm run lint`       | Runs JavaScript and Vue linting using ESLint |
| `npm run lint:fix`   | Fixes linting errors automatically           |
| `npm run format`     | Formats the codebase using Prettier          |
| `npm run prepare`    | Prepares Husky git hooks                     |

## Project Structure

```
src/
├── api/                        # Firebase API configuration and methods
├── assets/                     # Static assets (CSS, fonts, images)
├── components/                 # Vue components organized by feature
│   ├── landmark/              # Landmark-specific components
│   └── shared/                # Reusable shared components
│       ├── layout/            # Layout components
│       └── ui/                # UI component library
├── composables/               # Vue composition functions
├── config/                    # Application configuration
├── layouts/                   # Layout components
├── lib/                       # Utility libraries and helpers
├── router/                    # Vue Router configuration
├── schemas/                   # Zod validation schemas
├── services/                  # Business logic and API services
├── stores/                    # Pinia state management
├── types/                     # TypeScript type definitions
├── views/                     # Page components (routes)
├── App.vue                    # Root Vue component
└── main.ts                    # Application entry point
```

### Architecture Highlights:

- **Component-based**: Modular Vue components with clear separation of concerns
- **Composition API**: Modern Vue 3 composition API for better code organization
- **State Management**: Centralized state with Pinia for landmarks and authentication
- **Data Fetching**: TanStack Query for powerful data synchronization, caching, and background updates
- **Performance Optimization**: Throttling and debouncing for efficient user interactions and API calls
- **Service Layer**: Dedicated services for API interactions and business logic
- **Composable Functions**: Reusable composition functions for common operations
- **Type Safety**: Full TypeScript integration with strict type checking
- **Form Validation**: Robust form validation with Zod schemas
- **Virtual Scrolling**: Efficient rendering of large landmark lists
- **Map Integration**: Interactive maps with Leaflet and OpenStreetMap
- **File Upload**: Secure file upload with Firebase Storage
- **Real-time Updates**: Live data synchronization with Firestore
