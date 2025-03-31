import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

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
            {children}
            <footer className="py-4 text-center bg-white border-t mt-8">
              <p className="text-sm text-gray-600">
                hópverkefni2 Arnór Gunnarsson, Vilmundur Máni og Thor Sanchez
              </p>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
