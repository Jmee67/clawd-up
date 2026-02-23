"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-[#111] mb-4">Something went wrong</h1>
        <p className="text-[#666] mb-8">{error.message || "An unexpected error occurred."}</p>
        <button
          onClick={reset}
          className="bg-[#10B981] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#059669] transition-colors cursor-pointer"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
