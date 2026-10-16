import Link from "next/link";

export default function NotFound() {
  return (
    <div className="px-4 py-24 text-center">
      <h1 className="text-xl font-semibold">We couldn’t find that page</h1>
      <Link href="/" className="mt-4 inline-block underline">
        Back to shop
      </Link>
    </div>
  );
}
