import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";
import Navbar from '@/components/Navbar';


export const metadata = {
  title: "Finance Manager",
  description: "Manage your personal finances",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50">
          <Navbar />
            {children}
            
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
