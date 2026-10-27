

My Lead Management application built using Laravel 12, Inertia.js, React, TypeScript, and MySQL.

## Features

- Authentication using Laravel's React starter kit
- Create, read, update, and delete leads
- pagination
- Search leads by name or email
- Filter by lead status
- Sort by creation date in ascending or descending order
- Server-side form validation with UI error messages
- Enum-based lead statuses
- Authentication-protected lead routes
- Confirmation before deleting a lead
- Session-based filters without placing filter values in the URL

## Technology Stack

- PHP 8.2+
- Laravel 12
- React
- TypeScript
- Inertia.js
- MySQL
- Vite
- Node.js and npm

## Installation

1. Clone or extract the repository.

git clone <repository-url>
cd <project folder>

2. Install PHP dependencies:

  
   composer install


3. Create your environment file:

  
   cp .env.example .env

   php artisan key:generate
  

4. Configure the database credentials in `.env`.


5. Create the MySQL database and run migrations:

  
   php artisan migrate


6. Install frontend dependencies:

   npm install


7. Build the frontend:

  
   npm run build


8. Start the Laravel development server:

   
   php artisan serve
   

9. In a separate terminal, run the frontend development server if needed:

   
   npm run dev
   

10. Open http://127.0.0.1:8000 and login account with (din"t setup the register button on login page)

Email: admin@example.com
pass: Admin@12345.

## Database

The `leads` table contains:

- id
- name
- email (unique)
- phone
- status (New, Contacted, Converted)
- created_at
- updated_at

## Validation

Laravel Form Requests validate lead creation and updates. Validation errors are displayed through Inertia's `useForm` helper.

## Time Taken

[4 hours and 40 minutes]

## Notes

The project uses standard Laravel web routes and Inertia page responses. It does not require separate API endpoints for lead listing or CRUD operations.
