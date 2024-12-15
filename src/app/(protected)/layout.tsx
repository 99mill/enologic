'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AppSidebar } from "@/components/app/sidebar"
import { Header } from "@/components/app/header"
import { Footer } from "@/components/app/footer"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { supabase } from '@/utils/supabase'

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user && process.env.NODE_ENV !== 'development') {
        router.push('/auth')
      }
    }
    checkUser()
  }, [router])

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

