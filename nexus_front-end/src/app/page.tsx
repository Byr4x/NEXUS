import Link from 'next/link'

export default function Home() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Welcome to the Admin Dashboard</h2>
      <p>Select a section to manage:</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/pot/users" className="p-4 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors">
          Manage Users
        </Link>
        <Link href="/products" className="p-4 bg-green-100 rounded-lg hover:bg-green-200 transition-colors">
          Manage Products
        </Link>
        <Link href="/orders" className="p-4 bg-yellow-100 rounded-lg hover:bg-yellow-200 transition-colors">
          Manage Orders
        </Link>
      </div>
    </div>
  )
}