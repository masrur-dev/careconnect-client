import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ToastProvider from "@/components/ToastProvider";

export const metadata = {
  title: "CareConnect | Community Events",
  description:
    "Discover, create, and join social development events in your community.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <body className="flex min-h-screen flex-col bg-base-100 text-base-content">
        <ToastProvider>
          <Navbar />

          <main className="flex-1">
            {children}
          </main>

          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
