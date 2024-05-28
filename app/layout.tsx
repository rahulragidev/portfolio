import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Rahul Ragi's Portfolio",
	description:
		"Welcome to my portfolio! I am Rahul Ragi, a passionate Full Stack Developer with a robust background in creating dynamic and responsive web applications. With a keen interest in modern technologies and a commitment to continuous learning, I thrive on building innovative solutions that enhance user experiences and drive business growth.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={inter.className}>{children}</body>
		</html>
	);
}
