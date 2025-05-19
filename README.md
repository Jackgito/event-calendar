
# Event Calendar App

## Project Overview

The **Event Calendar App** is a web-based platform where users can view and sign up for events, while administrators can create and manage events. The app features role-based access, where admins have the ability to create events, and users can sign up for events that are not full.

## Tech Stack

- **Frontend**: React
- **Backend**: Spring Boot
- **Database**: PostgreSQL (AWS RDS)
- **Authentication**: Spring Security (JWT-based)
- **Deployment**: AWS (Elastic Beanstalk, S3, CloudFront)

---

## Roadmap

### Phase 1: Minimum Viable Product (MVP)

The goal of the MVP is to create a simple version of the Event Calendar App that allows:
1. **Admin**: To create events with basic details.
2. **User**: To sign up for events if they are not full.

**Key Features in MVP**:
- **Admin**:
  - Create events with:
    - Name
    - Description
    - Date
    - Maximum participants
- **User**:
  - View available events
  - Sign up for events (only if there are available slots)
  
---

### Phase 2: User Role & Permissions

After the MVP is ready, implement user roles and permissions:
- **Admin**:
  - Create, edit, and delete events.
  - View all user signups for each event.
- **User**:
  - View events they’ve signed up for.
  - View and browse upcoming events.

**Key Features**:
- Admins can manage event creation and participant capacity.
- Users can sign up for events, with the backend ensuring that the event doesn't exceed its maximum number of participants.

---

### Phase 3: UI Enhancements & User Experience

Once the core functionality is in place, enhance the frontend to provide a better user experience:
- Implement a **calendar view** to display events in a more visual format.
- Add **error handling** (e.g., notify users if they try to sign up for a full event).
- Design a **responsive interface** for mobile and tablet users.

---

### Phase 4: Notifications & Email Integration

After the application is stable, add notifications and email functionality:
- Send email confirmations to users after they sign up for an event.
- Admins should receive email alerts when an event is nearing full capacity.

---

### Phase 5: Admin Dashboard and Analytics

Add an **Admin Dashboard** for more advanced event management:
- View a list of all users who have signed up for each event.
- Track statistics, such as the number of events created and total signups.

---

### Phase 6: Deployment and Scaling

Prepare the app for production and ensure it can scale:
- **Containerization**: Use Docker to containerize both frontend and backend.
- **CI/CD**: Set up a continuous integration/continuous deployment pipeline (using GitHub Actions, Jenkins, etc.).
- **Monitoring**: Set up AWS CloudWatch for logging and performance monitoring.

---

## Getting Started

### Prerequisites

Make sure you have the following installed:
- **Java 11+** (for Spring Boot)
- **Node.js and npm** (for React)
- **Docker** (optional but recommended for containerization)

### Backend Setup (Spring Boot)

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/event-calendar-app.git
   cd event-calendar-app/backend
   ```

2. Set up **application.properties** or use environment variables for sensitive information (like database credentials and JWT secrets).

3. Build and run the backend:
   ```bash
   ./mvnw spring-boot:run
   ```

4. The backend should now be running at `http://localhost:8080`.

### Frontend Setup (React)

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the frontend locally:
   ```bash
   npm start
   ```

4. The frontend should now be running at `http://localhost:3000`.

---

## API Endpoints

### Auth
- `POST /auth/register` → Register a new user (admin or user)
- `POST /auth/login` → Log in and receive JWT

### Users
- `GET /users/me` → Get current user profile

### Events
- `GET /events` → Get a list of available events
- `POST /events` (admin only) → Create a new event
- `PUT /events/{id}` (admin only) → Update an event
- `DELETE /events/{id}` (admin only) → Delete an event

### Signups
- `POST /signups/{eventId}` → User signs up for an event
- `GET /signups/mine` → Get list of events the user has signed up for
- `GET /signups/event/{eventId}` (admin only) → Get list of users signed up for an event

---

## Deployment

1. **Dockerize the App** (optional but recommended for easy deployment):
   - Create a `Dockerfile` for both the frontend and backend.
   
2. **AWS Setup**:
   - Use **AWS Elastic Beanstalk** for deploying the Spring Boot backend.
   - Host the React app on **AWS S3** and configure **CloudFront** for content delivery.
   - Use **AWS RDS** for PostgreSQL.

3. **CI/CD**:
   - Set up a CI/CD pipeline using **GitHub Actions** or **GitLab CI/CD** for automated testing and deployment.

---

## License

This project is licensed under the MIT License – see the [LICENSE](LICENSE) file for details.
