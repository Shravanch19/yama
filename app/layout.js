import "./globals.css";
import Footer from "@/components/homepage/footer";
import Intro from "@/components/homepage/intro"
import Features from "@/components/homepage/features"

export const metadata = {
  title: "Yama",
  description: "Self-contol and self-improvement personal app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-b from-gray-950 via-gray-900 to-black px-6 py-12">
        <Intro />
        <Features />
        {children}
        <Footer />
      </body>
    </html>
  );
}
