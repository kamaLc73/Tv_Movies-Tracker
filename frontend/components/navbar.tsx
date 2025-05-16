"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Search, PlusCircle, Home, Film } from "lucide-react"

export function Navbar() {
  const pathname = usePathname()

  const navItems = [
    {
      label: "Home",
      href: "/",
      icon: <Home className="h-4 w-4 mr-2" />,
    },
    {
      label: "Series",
      href: "/series",
      icon: <Film className="h-4 w-4 mr-2" />,
    },
    {
      label: "Search",
      href: "/search",
      icon: <Search className="h-4 w-4 mr-2" />,
    },
  ]

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold mr-8">
            TV Tracker
          </Link>
          <nav className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  pathname === item.href ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <Button asChild variant="outline" size="sm">
            <Link href="/series/add">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Series
            </Link>
          </Button>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
