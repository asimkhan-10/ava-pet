# AVA - Dog Owners Social Platform

AVA is a comprehensive web application designed specifically for dog owners to connect, track, and share updates about their pets. The platform allows users to find nearby dogs, report missing dogs, manage their dog profiles, and create or attend dog-related events.

## 🚀 Features

### App Features:

- **Authentication:** Secure Register, Login, OTP Verification, and Password Reset.
- **Dog Feed:** Browse through updates from other users and dogs.
- **Nearby Dogs:** Find and connect with other dogs in your area using an interactive map interface.
- **My Dogs Management:** Add and manage your own dog profiles with details and photos.
- **Missing Dog Reports:** Quickly alert the community if a dog goes missing.
- **Events:** Create and discover dog-related events, and mark yourself as "Interested".
- **Notifications:** Keep up-to-date with new missing reports, event updates, and nearby activities.
- **Profile Management:** Update user profile and change password.
  
**Home**
  ![Screenshot](https://github.com/asimkhan-10/ava-pet/blob/main/home.jpeg)

  **Nearby Page**
    ![Screenshot](https://github.com/asimkhan-10/ava-pet/blob/main/nearby%20(2).png)

## 🛠️ Tech Stack

### Frontend (Client-side)

- **Framework:** React 19 (via Vite)
- **Styling:** Tailwind CSS (v4)
- **Routing:** React Router DOM
- **Maps:** Leaflet & React-Leaflet
- **Icons:** Lucide React
- **Requests:** Axios

### Backend (Server-side)

- **Framework:** Laravel 12
- **Language:** PHP 8.2+
- **Authentication:** Laravel Sanctum
- **Database:**  MySQL

  ### 1. Setting Up the Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install PHP dependencies:
   ```bash
   composer install
   ```
3. Set up your `.env` file constraint:
   ```bash
   cp .env.example .env
   ```
4. Generate an application key:
   ```bash
   php artisan key:generate
   ```
5. Run database migrations:
   ```bash
   php artisan migrate
   ```
   _(Note: By default Laravel will use SQLite and create the `database.sqlite` file if configured)_
6. Start the local API server:
   ```bash
   php artisan serve
   ```
   _The backend will now be available on `http://localhost:8000`_

### 2. Setting Up the Frontend

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install NPM dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   _The frontend will now be available on `http://localhost:5173`_
