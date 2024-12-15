import { AppSidebar } from "@/components/app/sidebar"
import { Header } from "@/components/app/header"
import { Footer } from "@/components/app/footer"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
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

