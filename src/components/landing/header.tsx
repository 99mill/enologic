import Link from 'next/link'
import { Button } from "@/components/ui/button"

export function LandingHeader() {
  return (
    <header className="h-[60px] px-4 flex justify-between items-center bg-white">
      <h1 className="text-2xl font-bold text-gray-800">Enologic</h1>
      <nav>
        <Button asChild variant="ghost">
          <Link href="/auth">Login / Sign Up</Link>
        </Button>
      </nav>
    </header>
  )
}

