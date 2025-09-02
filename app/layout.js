import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/Theme-provider";
import ConvexClientProvider from "./ConvexClientProvider";
import Header from "../components/customs/Header";
import { Toaster } from "sonner";


const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Regular, Medium, Semi-Bold, Bold
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "LucidAI - AI-Powered Code Generation",
  description: "Create stunning web applications with AI-powered code generation. Build, deploy, and iterate faster with LucidAI's intelligent development platform.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                document.documentElement.classList.add('dark');
                document.documentElement.style.colorScheme = 'dark';
              } catch (e) {}
            `,
          }}
        /> 
      </head>
      <body
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased font-sans`}
      >
        <ConvexClientProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            <div className="min-h-screen w-full relative">
              {/* Header on every page */}
              <Header />
              
              {/* Page content */}
              <main>
                {children}
                <Toaster />
              </main>
            </div>
          </ThemeProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
