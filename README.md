# Crackle - Movie Discovery Platform

A modern, feature-rich movie discovery platform built with Next.js 15, TypeScript, and Tailwind CSS. Experience seamless movie browsing with real-time search, advanced filtering, and personalized watchlists.

## Features

### Authentication & User Management

- 🔐 Secure email & password authentication
- 🔑 Password reset functionality with email verification
- 👤 User profile management
- 🚫 Protected routes and unauthorized access handling

### Movie Discovery

- Browse popular, trending, and top-rated movies
- Advanced filtering by rating and genres
- Infinite scroll and pagination support
- Movie details with trailers and recommendations
- User watchlist and watch history
- Movie ratings and reviews

### UI/UX

- Responsive design for all devices
- Dark mode support
- Loading states and skeleton screens
- Smooth animations with Framer Motion
- Toast notifications and alerts
- Cookie consent management

### Technical Features

- Server-side rendering with Next.js 13
- TypeScript for type safety
- Prisma ORM with PostgreSQL
- TanStack Query for data fetching
- Zustand for state management
- Secure API routes with rate limiting
- Image optimization and lazy loading

## 🚀 Getting Started

### Prerequisites

- Node.js 16.x or later
- PostgreSQL database
- TMDB API key

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/crackle.git
   cd crackle
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Set up environment variables:
   Create a \`.env\` file in the root directory with the following variables:
   \`\`\`env
   TMDB_API_KEY=your_tmdb_api_key
   DATABASE_URL=your_postgresql_connection_string
   JWT_SECRET=your_jwt_secret
   GMAIL_USER=your_gmail_address
   GMAIL_APP_PASSWORD=your_gmail_app_password
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   \`\`\`

4. Initialize the database:
   \`\`\`bash
   npx prisma generate
   npx prisma db push
   \`\`\`

5. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

\`\`\`
src/
├── app/ # Next.js 13 app directory
├── components/ # Reusable React components
├── contexts/ # React contexts
├── hooks/ # Custom React hooks
├── lib/ # Utility libraries
├── types/ # TypeScript type definitions
└── utils/ # Helper functions
\`\`\`

## 🔒 Authentication Flow

1. User signs up with email/password
2. System sends verification OTP via email
3. User verifies email with OTP
4. JWT token issued upon successful verification
5. Token stored in HTTP-only cookie
6. Protected routes/APIs check token validity

## 🎨 Styling

- Tailwind CSS for utility-first styling
- Custom animations with Framer Motion
- Responsive design breakpoints:
  - sm: 640px
  - md: 768px
  - lg: 1024px
  - xl: 1280px
  - 2xl: 1536px

## 🔄 State Management

- React Query for server state
- Zustand for client state
- Context API for auth state
- Local storage for preferences

## 📱 Responsive Design

- Mobile-first approach
- Fluid typography
- Adaptive layouts
- Touch-friendly interactions

## 🔐 Security

- Password hashing with bcrypt
- JWT for authentication
- HTTP-only cookies
- CORS protection
- Rate limiting
- Input validation
- XSS protection

## ⚡ Performance

- Image optimization
- Code splitting
- Route prefetching
- Caching strategies
- Lazy loading
- Debounced search
- Infinite scroll

## 🧪 Error Handling

- Global error boundary
- API error handling
- Loading states
- Retry mechanisms
- User feedback

## 📦 Dependencies

### Core

- next: ^13.x
- react: ^18.x
- typescript: ^5.x
- @prisma/client: ^6.0.1
- @tanstack/react-query: ^5.0.0

### UI/UX

- tailwindcss: ^3.4.16
- framer-motion: latest
- react-icons: latest

### Authentication

- bcryptjs: ^2.4.3
- jsonwebtoken: ^9.0.2
- next-auth: ^4.24.10

### Data Fetching

- axios: latest
- js-cookie: ^3.0.5

### State Management

- zustand: ^5.0.2

### Development

- prisma: ^6.0.1
- postcss: ^8.4.49
- autoprefixer: ^10.4.20
- eslint: ^8.x

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is licensed under the MIT License.
