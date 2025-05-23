# UserVerse-Dynamic-WebApp
# UserVerse - User Management Platform

## Project Description
UserVerse is a modern, responsive web application that we developed to provide a comprehensive user management platform. The application offers an intuitive interface for managing users and posts, with different access levels for administrators and standard users.

## Key Features
**Authentication System**
- Secure login and registration system
- Role-based access control (Admin and Standard User roles)
- Persistent authentication using local storage

**Dashboard**
- Overview of key metrics (users, posts, account type)
- Recent activity tracking
- Role-specific content and permissions

**User Management**
- Browse and search user listings
- Detailed user profiles with location mapping
- User activity tracking (posts and comments)

**Content Management**
- Create, view, and manage posts
- Comment system for user engagement
- Content filtering and organization

**Analytics & Reporting (Admin Only)**
- Visual data representations using charts
- User activity metrics
- Platform statistics and summaries

**Interactive Map Integration**
- MapTiler-powered location visualization
- Address search functionality
- Interactive maps for user locations

**Responsive Design**
- Mobile-friendly interface
- Collapsible sidebar for space optimization
- Consistent UI across device sizes

## Technical Stack
- **Frontend Framework**: React with TypeScript
- **UI Components**: Shadcn UI (built on Radix UI primitives)
- **Styling**: Tailwind CSS for utility-first styling
- **Routing**: React Router for seamless navigation
- **State Management**: React Query for server-state management
- **Form Handling**: React Hook Form with validation
- **Data Visualization**: Recharts for analytics
- **Maps**: MapLibre GL for map rendering with MapTiler integration
- **Build Tool**: Vite for fast development and optimized production builds

## Setup and Installation Instructions

### Prerequisites
- Node.js (v16 or later)
- npm 
- Git (for version control)

### Installation Steps

1. **Navigate to the project directory**
   ```bash
   cd userverse
   ```
   
   *Alternative: If setting up on a new machine or for collaboration:*
   ```bash
   git clone <repository-url>
   cd userverse
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   The application uses MapTiler for map functionality. While a default API key is provided for demonstration purposes, it's recommended to get your own key for production use:
   - Create an account at MapTiler
   - Generate an API key from your dashboard
   - When prompted in the application, enter your MapTiler API key

4. **Start the development server**
   ```bash
   npm run dev
   ```
## Demo Accounts
For testing purposes, you can use these pre-configured accounts:

**Administrator:**
- Email: admin@admin.com
- Password: admin123

**Standard User:**
- Email: Sincere@april.biz
- Password: Bret
(Note: This uses the JSON Placeholder API user data)

## Project Structure
- `src/components/`: Reusable UI components
- `src/components/ui/`: Shadcn UI components
- `src/hooks/`: Custom React hooks including authentication
- `src/lib/`: Utility functions and API services
- `src/pages/`: Application page components
- `src/App.tsx`: Main application component with routing
- `src/main.tsx`: Application entry point

## Data Source
This application connects to JSONPlaceholder as a backend API for demonstration purposes. 

## Team Contribution 
- Rhia Mae Gojar - managed authentication system, admin and user dashboard, and deployment
- Morly Granado - handled the backend APIs 
- Reden Gabitan - focused on the frontend design and UI/UX
- Ericwin Gonzales - focused on the frontend design and UI/UX.

## Deployement
Finally, the live version of UserVerse is deployed here:
https://userverse-eta.vercel.app/
