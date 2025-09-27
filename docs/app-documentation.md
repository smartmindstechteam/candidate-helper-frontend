# Somaliland Candidate Helper - Complete Application Documentation

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Core Modules](#core-modules)
5. [User Roles & Permissions](#user-roles--permissions)
6. [Database Design](#database-design)
7. [API Documentation](#api-documentation)
8. [Frontend Components](#frontend-components)
9. [Authentication & Security](#authentication--security)
10. [Deployment & Configuration](#deployment--configuration)
11. [Development Guide](#development-guide)
12. [Testing Strategy](#testing-strategy)
13. [Performance & Optimization](#performance--optimization)
14. [Future Enhancements](#future-enhancements)

---

## Overview

The **Somaliland Candidate Helper** is a comprehensive campaign management platform designed to empower democratic participation in Somaliland's electoral process. The application provides tools for managing supporters, operators, events, transportation, communication, and financial resources.

### Key Features
- **Supporter Management**: Registration, verification, and tracking of campaign supporters
- **Operator Management**: Field staff coordination with task assignment and GPS tracking
- **Event Management**: Planning and execution of rallies, fundraisers, and meetings
- **Transportation System**: Bus fleet management with route optimization
- **Communication Center**: Multi-channel messaging (SMS, WhatsApp, Email)
- **AI Chatbot**: Intelligent assistant for voter support and fraud detection
- **Fund Management**: Campaign finance tracking and resource allocation
- **Real-time Analytics**: Dashboard with insights and reporting

### Target Users
- **Administrators**: Campaign managers with full system access
- **Operators**: Field staff managing supporters and tasks
- **Supporters**: Citizens registering for campaign support

---

## Architecture

### System Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database     │
│   (Next.js)     │◄──►│   (Laravel)     │◄──►│   (PostgreSQL)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         │              │   External     │              │
         └──────────────►│   Services     │◄─────────────┘
                        │   (Maps, SMS,  │
                        │   WhatsApp)    │
                        └─────────────────┘
```

### Frontend Architecture
- **Framework**: Next.js 15 with React 19
- **Styling**: Tailwind CSS with Shadcn UI components
- **State Management**: Zustand for global state
- **Routing**: App Router with dynamic routes
- **Authentication**: Token-based with HTTP-only cookies

### Backend Architecture
- **Framework**: Laravel (PHP)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Laravel Sanctum
- **API**: RESTful with JSON responses
- **Caching**: Redis for performance optimization

---

## Technology Stack

### Frontend Technologies
```json
{
  "framework": "Next.js 15.5.3",
  "react": "19.1.0",
  "typescript": "^5",
  "styling": "Tailwind CSS 4",
  "ui_components": "Shadcn UI + Radix UI",
  "animations": "Framer Motion",
  "forms": "React Hook Form + Zod",
  "maps": "React Leaflet",
  "charts": "Recharts",
  "state_management": "Zustand",
  "theming": "next-themes"
}
```

### Backend Technologies
```json
{
  "framework": "Laravel",
  "database": "PostgreSQL",
  "orm": "Prisma",
  "authentication": "Laravel Sanctum",
  "caching": "Redis",
  "queue": "Laravel Queue",
  "storage": "Laravel Storage"
}
```

### Development Tools
```json
{
  "linting": "ESLint",
  "formatting": "Prettier",
  "testing": "Jest + React Testing Library",
  "type_checking": "TypeScript",
  "build_tool": "Turbopack"
}
```

---

## Core Modules

### 1. Supporter Management Module

**Purpose**: Register and manage campaign supporters with comprehensive tracking.

**Key Features**:
- Personal information collection
- Geolocation tracking
- Polling station assignment
- Photo verification
- Emergency contact management
- Status tracking (pending/approved/rejected)

**Components**:
- `SupporterRegistrationForm`: Multi-step registration process
- `SupporterDataTable`: Advanced data table with filtering
- `SupporterViewPage`: Detailed supporter profile
- `SupporterEditPage`: Profile editing interface

**API Endpoints**:
```
GET    /api/supporters          # List supporters with filters
POST   /api/supporters          # Create new supporter
GET    /api/supporters/{id}     # Get supporter details
PUT    /api/supporters/{id}     # Update supporter
DELETE /api/supporters/{id}     # Soft delete supporter
```

### 2. Operator Management Module

**Purpose**: Manage field operators with task assignment and activity tracking.

**Key Features**:
- Operator registration and approval workflow
- Task assignment and tracking
- GPS location monitoring
- Activity logging
- Action-based permissions
- Performance analytics

**Components**:
- `OperatorRegistrationForm`: Operator onboarding
- `OperatorDataTable`: Operator management interface
- `TaskAssignmentForm`: Task creation and assignment
- `OperatorDashboard`: Performance overview

**API Endpoints**:
```
GET    /api/operators           # List operators
POST   /api/operators           # Create operator
GET    /api/operators/{id}      # Get operator details
PUT    /api/operators/{id}      # Update operator
POST   /api/operators/{id}/tasks # Assign tasks
GET    /api/operators/{id}/activity # Get activity logs
```

### 3. Event Management Module

**Purpose**: Plan and manage campaign events with comprehensive logistics.

**Key Features**:
- Event creation and scheduling
- Venue management with geolocation
- Attendance tracking
- Budget management
- Risk assessment
- Media management

**Components**:
- `EventManagementForm`: Event creation and editing
- `EventsDataTable`: Event listing and management
- `EventCalendar`: Visual event scheduling
- `EventMap`: Venue location display

**API Endpoints**:
```
GET    /api/events              # List events
POST   /api/events              # Create event
GET    /api/events/{id}         # Get event details
PUT    /api/events/{id}        # Update event
DELETE /api/events/{id}        # Cancel event
POST   /api/events/{id}/attendance # Update attendance
```

### 4. Transportation Module

**Purpose**: Manage bus fleet and optimize transportation routes.

**Key Features**:
- Bus fleet management
- Driver assignment
- Route optimization using AI
- Schedule management
- Real-time tracking
- Cost analysis

**Components**:
- `BusDataTable`: Fleet management
- `DriverDataTable`: Driver management
- `BusRouteMap`: Interactive route visualization
- `ScheduleCalendar`: Trip scheduling

**API Endpoints**:
```
GET    /api/buses               # List buses
POST   /api/buses               # Add bus
GET    /api/routes              # List routes
POST   /api/routes              # Create route
GET    /api/schedules           # List schedules
POST   /api/schedules           # Create schedule
```

### 5. Communication Module

**Purpose**: Multi-channel communication with supporters and operators.

**Key Features**:
- SMS messaging
- WhatsApp integration
- Email campaigns
- Template management
- Delivery tracking
- Analytics

**Components**:
- `CommunicationMessageForm`: Message composition
- `TemplateManager`: Message templates
- `DeliveryTracker`: Message status tracking
- `AnalyticsDashboard`: Communication metrics

**API Endpoints**:
```
POST   /api/communication/sms   # Send SMS
POST   /api/communication/whatsapp # Send WhatsApp
POST   /api/communication/email  # Send email
GET    /api/communication/templates # List templates
POST   /api/communication/templates # Create template
```

### 6. AI Chatbot Module

**Purpose**: Intelligent assistant for voter support and fraud detection.

**Key Features**:
- Natural language processing
- Voter support automation
- Fraud detection
- Session management
- Analytics and reporting

**Components**:
- `ChatbotInterface`: Chat interface
- `SessionManager`: Chat session handling
- `AnalyticsDashboard`: Bot performance metrics

**API Endpoints**:
```
POST   /api/chatbot/session     # Create chat session
POST   /api/chatbot/message     # Send message
GET    /api/chatbot/analytics   # Get analytics
DELETE /api/chatbot/session/{id} # End session
```

### 7. Fund Management Module

**Purpose**: Track campaign finances and resource allocation.

**Key Features**:
- Budget tracking
- Expense management
- Fund allocation
- Financial reporting
- Audit trails

**Components**:
- `FundManagementForm`: Financial data entry
- `FundDataTable`: Financial overview
- `ExpenseTracker`: Expense logging
- `FinancialReports`: Financial analytics

**API Endpoints**:
```
GET    /api/funds               # List funds
POST   /api/funds               # Add fund
GET    /api/expenses            # List expenses
POST   /api/expenses            # Add expense
GET    /api/funds/reports       # Financial reports
```

---

## User Roles & Permissions

### Administrator
**Full system access with capabilities**:
- Manage all users (operators, supporters)
- Create and manage events
- Access all financial data
- System configuration
- Generate comprehensive reports
- Manage permissions and roles

### Operator
**Field operations with assigned permissions**:
- Manage assigned supporters
- Create and update events
- Access transportation tools
- Send communications
- Log activities and expenses
- View assigned tasks

### Supporter
**Limited access for self-service**:
- View own profile
- Update contact information
- View assigned polling station
- Access campaign information
- Receive communications

### Permission System
```typescript
interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
  action: string;
}

interface Role {
  id: string;
  name: string;
  permissions: Permission[];
}
```

---

## Database Design

### Core Entities

#### Users Table
```sql
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  firstname VARCHAR(255) NOT NULL,
  middlename VARCHAR(255),
  lastname VARCHAR(255) NOT NULL,
  fourthname VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  role VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);
```

#### Supporters Table
```sql
CREATE TABLE supporters (
  id BIGSERIAL PRIMARY KEY,
  firstname VARCHAR(255) NOT NULL,
  lastname VARCHAR(255) NOT NULL,
  birthdate DATE,
  gender VARCHAR(10),
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  latitude DECIMAL(10,7),
  longitude DECIMAL(10,7),
  voter_id VARCHAR(50),
  pollingstation_id BIGINT REFERENCES polling_stations(id),
  status VARCHAR(50) DEFAULT 'pending',
  created_by BIGINT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Events Table
```sql
CREATE TABLE events (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  description TEXT,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  venue VARCHAR(255) NOT NULL,
  address TEXT,
  latitude DECIMAL(10,7),
  longitude DECIMAL(10,7),
  max_capacity INTEGER,
  budget_amount DECIMAL(12,2),
  status VARCHAR(50) DEFAULT 'planned',
  created_by BIGINT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Relationships
- Users → Supporters (1:many)
- Users → Events (1:many)
- Users → Operators (1:many)
- Events → Supporters (many:many)
- Operators → Tasks (1:many)
- Supporters → PollingStations (many:1)

---

## API Documentation

### Authentication
All API endpoints require authentication via Bearer token.

```typescript
// Request headers
{
  "Authorization": "Bearer <token>",
  "Content-Type": "application/json"
}
```

### Response Format
```typescript
interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  errors?: string[];
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

### Error Handling
```typescript
interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}
```

### Rate Limiting
- 100 requests per minute per user
- 1000 requests per hour per user
- Burst limit: 20 requests per second

---

## Frontend Components

### Layout Components
- `AppSidebar`: Navigation sidebar with role-based menu
- `ThemeProvider`: Dark/light mode management
- `AnimatedBackground`: Dynamic background effects

### Form Components
- `AuthLoginForm`: User authentication
- `SupporterRegistrationForm`: Supporter onboarding
- `OperatorRegistrationForm`: Operator registration
- `EventManagementForm`: Event creation/editing
- `BusRegistrationForm`: Bus fleet management

### Data Display Components
- `DataTable`: Advanced table with sorting, filtering, pagination
- `SupporterDataTable`: Supporter-specific table
- `OperatorDataTable`: Operator management table
- `EventsDataTable`: Event listing table
- `FundDataTable`: Financial data table

### Map Components
- `SimpleMap`: Basic map display
- `BusRouteMap`: Interactive route visualization
- `EventMap`: Event location display

### UI Components (Shadcn UI)
- `Button`: Styled button component
- `Card`: Content container
- `Dialog`: Modal dialogs
- `Form`: Form components with validation
- `Input`: Input fields
- `Select`: Dropdown selections
- `Table`: Data tables
- `Tabs`: Tab navigation

---

## Authentication & Security

### Authentication Flow
1. User submits credentials
2. Backend validates credentials
3. JWT token generated and stored in HTTP-only cookie
4. Token included in subsequent requests
5. Token validated on each request

### Security Measures
- **Password Hashing**: bcrypt with salt rounds
- **HTTPS Only**: All communications encrypted
- **CORS Configuration**: Restricted origins
- **Rate Limiting**: Prevent abuse
- **Input Validation**: Zod schema validation
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Content sanitization

### Session Management
```typescript
interface Session {
  id: string;
  userId: number;
  role: string;
  expiresAt: Date;
  createdAt: Date;
}
```

---

## Deployment & Configuration

### Environment Variables
```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/candidate_helper"

# Authentication
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"

# External Services
GOOGLE_MAPS_API_KEY="your-google-maps-key"
TWILIO_ACCOUNT_SID="your-twilio-sid"
TWILIO_AUTH_TOKEN="your-twilio-token"
WHATSAPP_TOKEN="your-whatsapp-token"

# Redis
REDIS_URL="redis://localhost:6379"

# Email
MAIL_HOST="smtp.gmail.com"
MAIL_PORT=587
MAIL_USERNAME="your-email"
MAIL_PASSWORD="your-password"
```

### Docker Configuration
```dockerfile
# Frontend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Production Checklist
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] SSL certificates installed
- [ ] CDN configured for static assets
- [ ] Monitoring and logging setup
- [ ] Backup strategy implemented
- [ ] Security headers configured

---

## Development Guide

### Getting Started
```bash
# Clone repository
git clone <repository-url>
cd candidate-helper

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local

# Run development server
npm run dev
```

### Project Structure
```
src/
├── app/                    # Next.js app router
│   ├── admin/             # Admin dashboard pages
│   ├── operator/          # Operator interface pages
│   ├── supporter/         # Supporter portal pages
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Shadcn UI components
│   ├── forms/            # Form components
│   └── maps/             # Map components
├── lib/                   # Utility libraries
│   ├── api.ts            # API client
│   ├── utils.ts          # Utility functions
│   └── validations/       # Zod schemas
├── types/                 # TypeScript types
└── hooks/                 # Custom React hooks
```

### Code Standards
- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb configuration
- **Prettier**: Code formatting
- **Conventional Commits**: Commit message format
- **Component Structure**: Functional components with hooks
- **File Naming**: kebab-case for files, PascalCase for components

### Git Workflow
```bash
# Feature development
git checkout -b feature/feature-name
git add .
git commit -m "feat: add new feature"
git push origin feature/feature-name

# Create pull request
# After review and approval, merge to main
```

---

## Testing Strategy

### Unit Testing
```typescript
// Component testing example
import { render, screen } from '@testing-library/react';
import { SupporterForm } from '@/components/forms/supporter-registration-form';

describe('SupporterForm', () => {
  it('renders form fields correctly', () => {
    render(<SupporterForm />);
    expect(screen.getByLabelText('First Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
  });
});
```

### Integration Testing
```typescript
// API testing example
import { api } from '@/lib/api';

describe('Supporter API', () => {
  it('creates supporter successfully', async () => {
    const supporterData = {
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com'
    };
    
    const response = await api.supporters.create(supporterData);
    expect(response.success).toBe(true);
    expect(response.data.firstname).toBe('John');
  });
});
```

### E2E Testing
```typescript
// Playwright E2E test
import { test, expect } from '@playwright/test';

test('supporter registration flow', async ({ page }) => {
  await page.goto('/supporter/register');
  await page.fill('[data-testid="firstname"]', 'John');
  await page.fill('[data-testid="lastname"]', 'Doe');
  await page.click('[data-testid="submit"]');
  await expect(page).toHaveURL('/supporter/success');
});
```

### Testing Tools
- **Jest**: Unit and integration testing
- **React Testing Library**: Component testing
- **Playwright**: E2E testing
- **MSW**: API mocking
- **Testing Library**: User interaction testing

---

## Performance & Optimization

### Frontend Optimization
- **Code Splitting**: Dynamic imports for route-based splitting
- **Image Optimization**: Next.js Image component with WebP
- **Bundle Analysis**: Webpack bundle analyzer
- **Lazy Loading**: Component lazy loading
- **Caching**: Service worker for offline support

### Backend Optimization
- **Database Indexing**: Optimized queries with proper indexes
- **Query Optimization**: N+1 query prevention
- **Caching**: Redis for frequently accessed data
- **API Rate Limiting**: Prevent abuse
- **Connection Pooling**: Database connection optimization

### Monitoring
- **Performance Metrics**: Core Web Vitals tracking
- **Error Tracking**: Sentry integration
- **Analytics**: User behavior tracking
- **Uptime Monitoring**: Service availability tracking

---

## Future Enhancements

### Phase 2 Features
- **Mobile Applications**: React Native apps for operators and supporters
- **Offline Support**: PWA capabilities for field operations
- **Advanced Analytics**: Machine learning insights
- **Multi-language Support**: Somali and Arabic translations
- **Voice Integration**: Voice-to-text for accessibility

### Phase 3 Features
- **Blockchain Integration**: Transparent voting records
- **IoT Integration**: Smart polling station devices
- **Advanced AI**: Predictive analytics and fraud detection
- **Social Media Integration**: Campaign social media management
- **International Expansion**: Multi-country support

### Technical Improvements
- **Microservices Architecture**: Service decomposition
- **GraphQL API**: Flexible data fetching
- **Real-time Updates**: WebSocket integration
- **Advanced Security**: Multi-factor authentication
- **Scalability**: Horizontal scaling support

---

## Conclusion

The Somaliland Candidate Helper represents a comprehensive solution for modern campaign management, combining cutting-edge technology with user-friendly interfaces to empower democratic participation. The modular architecture ensures scalability and maintainability, while the robust security measures protect sensitive campaign data.

This documentation serves as a complete guide for developers, administrators, and stakeholders to understand, deploy, and maintain the application effectively.

---

**Document Version**: 1.0  
**Last Updated**: January 2025  
**Maintained By**: Somaliland Candidate Helper Development Team
