import "./globals.css";

export const metadata = {
  title: "GoVigi Produce Ordering",
  description: "Retailer web portal for produce ordering",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
