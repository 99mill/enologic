import Link from 'next/link'

export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Winery Management Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/viticulture/vendors" className="p-4 bg-white shadow rounded-lg hover:shadow-md transition-shadow">
          Viticulture Vendors
        </Link>
        <Link href="/winemaking/inventory" className="p-4 bg-white shadow rounded-lg hover:shadow-md transition-shadow">
          Winemaking Inventory
        </Link>
        <Link href="/quality-control/data-entry" className="p-4 bg-white shadow rounded-lg hover:shadow-md transition-shadow">
          Quality Control Data Entry
        </Link>
        <Link href="/cellar-operations/jobs" className="p-4 bg-white shadow rounded-lg hover:shadow-md transition-shadow">
          Cellar Operations Jobs
        </Link>
      </div>
    </div>
  )
}

