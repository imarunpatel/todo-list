import Board from "@/components/Board";
import Header from "@/components/Header";
import Image from "next/image";

export default function Home() {
  const error = console.error;
  console.error = (...args: any) => {
    if (/defaultProps/.test(args[0])) return;
    error(...args);
  };
  return (
    <main className="bg-gray-400 min-h-screen">
      <Header />
      <Board />
    </main>
  );
}
