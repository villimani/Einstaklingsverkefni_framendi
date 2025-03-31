import Link from 'next/link';

export default function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <h1 className="text-6xl font-bold text-red-500 mb-4">401</h1>
      <h2 className="text-2xl font-medium text-gray-600 mb-6">Unauthorized</h2>
      <p className="text-gray-500 mb-8 text-center max-w-md">
        you dont have access
      </p>
      <Link 
        href="/"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Back to main page
      </Link>
    </div>
  );
}