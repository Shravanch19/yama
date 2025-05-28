import "./globals.css";

export const metadata = {
  title: "Yama",
  description: "Self-contol and self-improvement personal app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
