"use client"

import * as React from "react"
import { Grape, Wine, ClipboardCheck, Warehouse, Users, FileText, Mountain, Boxes, FlaskConical, ClipboardList, Truck, Beer, Settings, HelpCircle, ChevronRight, ChevronLeft, LogOut, LayoutGrid } from 'lucide-react'
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar"

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
  submenu?: NavItem[]
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutGrid,
  },
  {
    title: "Viticulture",
    href: "/viticulture",
    icon: Grape,
    submenu: [
      { title: "Vendors", href: "/viticulture/vendors", icon: Users },
      { title: "Contracts", href: "/viticulture/contracts", icon: FileText },
      { title: "Vineyards", href: "/viticulture/vineyards", icon: Mountain },
    ],
  },
  {
    title: "Winemaking",
    href: "/winemaking",
    icon: Wine,
    submenu: [
      { title: "Inventory", href: "/winemaking/inventory", icon: Boxes },
      { title: "Contracts", href: "/winemaking/contracts", icon: FileText },
      { title: "Blends", href: "/winemaking/blends", icon: FlaskConical },
    ],
  },
  {
    title: "Quality Control",
    href: "/quality-control",
    icon: ClipboardCheck,
    submenu: [
      { title: "Data Entry", href: "/quality-control/data-entry", icon: ClipboardList },
    ],
  },
  {
    title: "Cellar Operations",
    href: "/cellar-operations",
    icon: Warehouse,
    submenu: [
      { title: "Jobs", href: "/cellar-operations/jobs", icon: ClipboardList },
      { title: "Shipping", href: "/cellar-operations/shipping", icon: Truck },
      { title: "Bottling", href: "/cellar-operations/bottling", icon: Beer },
    ],
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const [openMenus, setOpenMenus] = React.useState<string[]>([])
  const pathname = usePathname()

  const toggleMenu = (title: string) => {
    setOpenMenus(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  const isMenuOpen = (title: string) => openMenus.includes(title)

  return (
    <Sidebar collapsed={isCollapsed} {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <LayoutGrid className="h-6 w-6" />
          {!isCollapsed && <span className="font-bold">Winery Management</span>}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="flex-1 px-3">
          <div className="space-y-2 py-4">
            {navItems.map((item) => (
              <div key={item.title}>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => toggleMenu(item.title)}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {!isCollapsed && (
                    <>
                      <span>{item.title}</span>
                      {item.submenu && (
                        <ChevronRight className={`ml-auto h-4 w-4 transition-transform duration-200 ${isMenuOpen(item.title) ? 'rotate-90' : ''}`} />
                      )}
                    </>
                  )}
                </Button>
                {!isCollapsed && isMenuOpen(item.title) && item.submenu && (
                  <div className="ml-4 mt-2 space-y-2">
                    {item.submenu.map((subItem) => (
                      <Button
                        key={subItem.title}
                        asChild
                        variant="ghost"
                        className={`w-full justify-start ${
                          pathname === subItem.href ? "bg-muted" : ""
                        }`}
                      >
                        <Link href={subItem.href}>
                          <subItem.icon className="mr-2 h-4 w-4" />
                          <span>{subItem.title}</span>
                        </Link>
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter>
        <div className="space-y-2 px-3 py-2">
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="mr-2 h-4 w-4" />
            {!isCollapsed && <span>Settings</span>}
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <HelpCircle className="mr-2 h-4 w-4" />
            {!isCollapsed && <span>Help</span>}
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <LogOut className="mr-2 h-4 w-4" />
            {!isCollapsed && <span>Logout</span>}
          </Button>
        </div>
      </SidebarFooter>
      <SidebarRail>
      </SidebarRail>
    </Sidebar>
  )
}

