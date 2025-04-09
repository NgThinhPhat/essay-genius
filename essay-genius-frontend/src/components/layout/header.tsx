"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { User, Sun, Moon } from "lucide-react" // Import the icons you want to use

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Function to toggle the theme between light and dark
  const toggleTheme = () => {
    const htmlElement = document.documentElement
    if (htmlElement.classList.contains("dark")) {
      htmlElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    } else {
      htmlElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    }
  }

  // Check if the theme is saved in localStorage and apply it
  useState(() => {
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme) {
      document.documentElement.classList.add(savedTheme)
    }
  },)

  // Check the current theme to determine which icon to display
  const isDarkMode = document.documentElement.classList.contains("dark")

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-bold text-xl">IELTS Essays Genius</span>
        </Link>

        <div className="flex items-center space-x-4">
          <Link href="/scored-essays" className="text-sm font-medium">
            Scored Essays
          </Link>

          <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/sign-in">Sign In</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/sign-up">Sign Up</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/profile">Profile</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="hidden md:flex">
          <button
            id="theme-toggle"
            onClick={toggleTheme} // Add the click handler
            className="px-4 py-2 bg-gray-200 dark:bg-gray-800 text-black dark:text-white rounded flex items-center justify-center"
          >
            {/* Toggle between Sun and Moon based on the current theme */}
            {isDarkMode ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle Theme</span>
          </button>
        </div>
      </div>
    </header>
  )
}

