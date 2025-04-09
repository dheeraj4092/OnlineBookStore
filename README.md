# StoryBook Emporium

An online bookstore for customized and regular books, built with modern web technologies.

## Project Overview

StoryBook Emporium is a full-featured e-commerce platform that allows customers to browse and purchase customized books, regular books, and posters. The platform includes a customer-facing website.

## Features

- **Customer Features**:
  - Browse products by category
  - View product details
  - Add items to cart
  - Secure checkout process
  - Order history
  - User authentication

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **UI Components**: shadcn-ui, Tailwind CSS
- **State Management**: Zustand
- **Backend**: Supabase (Authentication & Database)
- **Deployment**: Vercel/Netlify (recommended)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/storybook-emporium.git
   cd storybook-emporium
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your-supabase-project-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. Start the development server:
   ```sh
   npm run dev
   ```

## Project Structure

This project is a customer-facing e-commerce website:
- Located in the root directory
- Accessible at http://localhost:8080

## Authentication System

This project includes a complete authentication system built with Supabase:

- **Sign Up**: Users can create new accounts with email and password
- **Sign In**: Users can sign in with their email and password
- **Password Reset**: Users can request a password reset link
- **Profile Management**: Users can update their profile information
- **Protected Routes**: Certain pages are only accessible to authenticated users
- **Order History**: Authenticated users can view their order history

To set up the authentication system:

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from the project settings
3. Add these credentials to your `.env` file
4. Enable Email authentication in the Supabase Authentication settings

## Admin Dashboard

The admin dashboard is a separate project that provides administrative functionality for managing products, orders, and users. It can be found at:

[https://github.com/yourusername/storybook-emporium-admin](https://github.com/yourusername/storybook-emporium-admin)

## Deployment

### Deploying to Vercel

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Configure environment variables in Vercel
4. Deploy

### Deploying to Netlify

1. Push your code to GitHub
2. Connect your GitHub repository to Netlify
3. Configure environment variables in Netlify
4. Deploy

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any questions or suggestions, please open an issue in the GitHub repository.
