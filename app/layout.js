import "./globals.css";
import localFont from "next/font/local";
import AmbientAudio from "./components/AmbientAudio";

const rubikItalic = localFont({
  src: "./fonts/Rubik-Italic-VariableFont_wght.ttf",
  variable: "--font-rubik",
  weight: "100 900",
  style: "italic",
  display: "swap",
});

export const metadata = {
  title: "The World is Calling – Travel With Us",
  description:
    "Budget-friendly flights to bucket-list experiences. We craft tailor-made itineraries and lifelong travel memories.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr">
      <body className={`${rubikItalic.variable} font-sans antialiased`}>
        {children}
        <AmbientAudio />
      </body>
    </html>
  );
}
