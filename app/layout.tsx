import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingSocial from "@/components/FloatingSocial";
import { Providers } from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: 'Premium Used Cars in Chennai | Trusted Torque Cars Dealer',
  description: 'Buy certified pre-owned cars in Chennai at Torque. Trusted showroom in Kilpauk offering quality used cars, best prices & easy exchange.',
  keywords: "torque cars chennai, the torque chennai, torque pre owned cars chennai, torque used cars kilpauk chennai, best used car dealer chennai, trusted used car showroom chennai, certified pre owned cars chennai, second hand cars chennai, used cars showroom kilpauk, torque luxury cars reviews chennai".split(", "),
  openGraph: {
    title: "Torque Cars Chennai | Certified Pre-Owned Cars",
    description: "Explore premium used cars in Chennai at Torque. Trusted dealer in Kilpauk offering certified vehicles, best prices, and hassle-free buying.",
    type: "website",
  },
  twitter: {
    title: "Torque Cars Chennai | Best Used Car Dealer",
    description: "Find trusted pre-owned cars in Chennai at Torque. Quality vehicles, best deals & smooth buying experience in Kilpauk.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Google Tag Manager */}
        <script dangerouslySetInnerHTML={{ __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-5HJRK5WM');` }} />
        {/* End Google Tag Manager */}
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-zinc-950 text-white`}>
        {/* Google Tag Manager (noscript) */}
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5HJRK5WM" height="0" width="0" style={{display:'none',visibility:'hidden'}}></iframe></noscript>
        {/* End Google Tag Manager (noscript) */}
        <Providers>
          <Header />
          <FloatingSocial />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
