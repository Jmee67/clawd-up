import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-[#10B981] mb-4">404</h1>
        <p className="text-xl text-[#666] mb-8">Page not found</p>
        <Link
          href="/"
          className="bg-[#10B981] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#059669] transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
