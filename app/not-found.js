import Link from 'next/link'

export default function NotFound() {
  return (    <div className="min-h-screen flex items-center justify-center bg-gray-800">
      <div className="max-w-xl p-8 text-center border border-gray-700 rounded-xl bg-gray-800 shadow-xl">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-pink-300 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-cyan-300 mb-2">Page Not Found</h2>
          <p className="text-gray-300">Oops! The page you are looking for does not exist.</p>
        </div>
        <Link 
          href="/"
          className="inline-block px-6 py-3 text-base font-medium text-gray-800 bg-cyan-300 rounded-lg hover:bg-cyan-400 transition-colors duration-200"
        >
          Return Home
        </Link>
      </div>
    </div>
  )
}
