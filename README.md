# LucidAI - AI-Powered Code Generation Platform

An intelligent web development platform that leverages AI to generate, preview, and deploy stunning web applications with minimal effort.

## 🚀 Features

- **AI-Powered Code Generation**: Generate complete React applications from natural language descriptions
- **Live Code Preview**: See your generated code in action with integrated Sandpack
- **Real-time Collaboration**: Work with AI to iterate and improve your applications
- **Modern UI Components**: Beautiful, responsive components built with Tailwind CSS
- **Authentication**: Secure Google OAuth integration
- **Token System**: Manage usage with built-in token economy
- **Workspace Management**: Organize and manage multiple projects

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Convex (Serverless Database)
- **AI**: Google Generative AI (Gemini)
- **Authentication**: Google OAuth
- **UI Components**: Radix UI, Lucide Icons
- **Code Editor**: CodeSandbox Sandpack

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/RaghavCLI/LucidAI.git
   cd LucidAI
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file with:

   ```env
   NEXT_PUBLIC_GOOGLE_AUTH_KEY=your_google_oauth_client_id
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
   NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url
   ```

4. **Set up Convex**

   ```bash
   npx convex dev
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000)**

## 🎯 Usage

1. **Sign in** with your Google account
2. **Describe your app** in natural language
3. **Generate code** with AI assistance
4. **Preview and edit** in the live code editor
5. **Deploy** your application

## 📁 Project Structure

```
lucidai/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── layout.js          # Root layout
│   └── page.js            # Home page
├── components/            # React components
│   ├── customs/          # Custom components
│   └── ui/               # UI components
├── convex/               # Convex backend
│   ├── schema.js         # Database schema
│   └── users.js          # User mutations/queries
├── context/              # React context providers
├── hooks/                # Custom React hooks
└── lib/                  # Utility functions
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org)
- Powered by [Google Generative AI](https://ai.google.dev)
- Database by [Convex](https://convex.dev)
- UI components from [Radix UI](https://radix-ui.com)

---

**Made with ❤️ by [RaghavCLI](https://github.com/RaghavCLI)**
