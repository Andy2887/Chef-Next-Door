# Chef Next Door

A modern, full-stack personal cookbook web application for organizing, sharing, and managing your favorite recipes.

## 🛠️ Tech Stack

| Category | Technology | Purpose |
| --- | --- | --- |
| **Frontend** | Next.js 14+ (App Router) | React framework with SSR and routing |
| **Language** | TypeScript | Type safety and developer experience |
| **Backend** | Supabase | Authentication, database, and file storage |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **UI Components** | Radix UI | Accessible, unstyled React primitives |
| **Deployment** | Vercel | Hosting and continuous deployment |

## 📁 Project Structure

```
chef-next-door/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   ├── recipes/           # Recipe management pages
│   ├── settings/          # User settings
│   └── layout.tsx         # Root layout
├── components/            # Reusable React components
│   └── ui/               # Atomic UI components (Button, Input, etc.)
├── lib/                  # Utility functions and configurations
├── public/               # Static assets
├── supabase/            # Database migrations and config
├── utils/supabase/      # Supabase client helpers
└── types/               # TypeScript type definitions
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- A [Supabase](https://supabase.com/) account and project

### Installation

1. **Clone the repository**
  
  ```bash
  git clone https://github.com/yourusername/chef-next-door.git
  cd chef-next-door
  ```
  
2. **Install dependencies**
  
  ```bash
  npm install
  ```
  
3. **Configure environment variables**
  
  ```bash
  cp .env.example .env.local
  ```
  
  Update `.env.local` with your Supabase credentials:
  
  ```env
  NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
  ```
  
4. **Set up the database**
  
  ```bash
  npx supabase db reset
  ```
  
5. **Start the development server**
  
  ```bash
  npm run dev
  ```
  
6. **Open your browser**
  
  Navigate to [http://localhost:3000](http://localhost:3000) to see the application.
  

## 🗄️ Database Setup

### Supabase Configuration

1. Create a new project at [supabase.com](https://supabase.com/)
2. Navigate to **Settings > API** to get your project URL and API keys
3. Enable Authentication providers in **Authentication > Providers**
4. Run the provided migrations to set up your database schema

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to a Git repository
2. Import your project on [Vercel](https://vercel.com/)
3. Add your environment variables in the Vercel dashboard
4. Deploy automatically on every push to main branch

### Other Platforms

This Next.js application can be deployed on any platform that supports Node.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📝 TODO

- Users need to be able to crop the images they upload
- On the root page, the author of recipes is not showing up
- Users should not be able to access the register page if they already login
- Comments function
- "My recipes" section
- Change Password function
- Delete account function
- Redesign the upload profile image button

## 🔗 Resources

### Supabase Auth
- [Building a simple To-Do app with Supabase & Next.js](https://medium.com/@nbryleibanez/building-a-simple-to-do-app-with-supabase-next-js-2984ce16926a)
- [Supabase Auth Server-Side: Creating a Client (Middleware)](https://supabase.com/docs/guides/auth/server-side/nextjs)

### Supabase Storage
- [Supabase Storage File Upload](https://supabase.com/docs/guides/storage/uploads/standard-uploads)
- [Supabase Storage Retrieve File Public Url](https://supabase.com/docs/reference/javascript/storage-from-getpublicurl)
