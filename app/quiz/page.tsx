import type { Metadata } from "next";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import QuizClient from "../../components/QuizClient";
import { getPerfumes } from "../../lib/queries";

export const metadata: Metadata = {
  title: "Quiz de Fragancias | Oud Del Sur",
  description: "Descubrí qué perfume árabe es ideal para vos con nuestro quiz personalizado.",
};

export default async function QuizPage() {
  const perfumes = await getPerfumes();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#1A1510] flex flex-col relative">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.07) 0%, transparent 70%)" }}
        />
        <QuizClient perfumes={perfumes} />
      </main>
      <Footer />
    </>
  );
}
