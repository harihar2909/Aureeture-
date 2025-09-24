"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Menu, X, ArrowRight } from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { CurvedNavShell } from "@/components/ui/curved-nav-shell"
import { usePathname } from "next/navigation"
import { SignInButton, useUser } from "@clerk/nextjs"

// Define navigation items in an array for easier mapping and maintenance
const navItems = [
  { href: "/", label: "Home" },
  { href: "/velocity-cohort", label: "Velocity Cohort" },
  { href: "/enterprise", label: "Enterprise" },
  { href: "/continue", label: "Continue" },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const { isSignedIn } = useUser()

  // Effect for mounting and scroll listener
  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])
  
  // Effect to close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }
  
  const NavLink = ({ href, label }: { href: string; label: string }) => {
    const isActive = pathname === href
    return (
      <li role="none">
        <Link
          href={href}
          onClick={() => setMobileMenuOpen(false)}
          className={
            "block lg:inline-block px-4 py-2 text-sm font-medium rounded-full transition-colors duration-300 " +
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background " +
            (isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary")
          }
          aria-current={isActive ? "page" : undefined}
          role="menuitem"
        >
          {label}
        </Link>
      </li>
    )
  }

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50"
        role="navigation"
        aria-label="Main navigation"
      >
        <CurvedNavShell className={`px-2 ${pathname === "/" ? "pt-3" : "pt-2"}`} transparent={!isScrolled && !mobileMenuOpen}>
          <div className="container mx-auto px-2 md:px-4">
            <div className="flex items-center justify-between h-16 md:h-20">
            
            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center gap-2 group"
              aria-label="Aureeture - Go to homepage"
            >
              <span className="relative h-12 md:h-14 w-auto">
                <Image
                  src="/brand/logo-dark.png"
                  alt="AureetureAI"
                  width={280}
                  height={64}
                  priority
                  className="hidden dark:block h-full w-auto"
                />
                <Image
                  src="/brand/logo-light.png"
                  alt="AureetureAI"
                  width={280}
                  height={64}
                  priority
                  className="block dark:hidden h-full w-auto"
                />
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6">
              <ul
                className={`flex items-center gap-2 rounded-full px-2 py-1 border 
                ${!isScrolled && !mobileMenuOpen
                  ? "bg-transparent border-transparent backdrop-blur-0 shadow-none"
                  : "bg-background/60 backdrop-blur-md border-border/50"}
                `}
                role="menubar"
                aria-label="Primary"
              >
                {navItems.map((item) => <NavLink key={item.href} {...item} />)}
              </ul>
              
              <div className="flex items-center gap-3">
                 <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleTheme}
                    className="rounded-full focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
                  >
                    {mounted && (theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />)}
                  </Button>
                  {/* Contact: smaller/lighter text-only (swapped with Continue) */}
                  <Link href="/contact" className="inline-block">
                    <span className="text-xs md:text-sm font-medium text-muted-foreground/70 px-2 select-none">
                      Contact
                    </span>
                  </Link>
                  {isSignedIn ? (
                    <Link href="/dashboard" className="inline-block">
                      <Button className="h-11 px-6 rounded-full shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-b from-white to-slate-50 text-slate-900 ring-1 ring-black/5 dark:ring-white/10">
                        Career Explorer
                        <ArrowRight className="size-4 ml-2" />
                      </Button>
                    </Link>
                  ) : (
                    <SignInButton mode="modal" forceRedirectUrl="/create-profile">
                      <Button className="h-11 px-6 rounded-full shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-b from-white to-slate-50 text-slate-900 ring-1 ring-black/5 dark:ring-white/10">
                        Career Explorer
                        <ArrowRight className="size-4 ml-2" />
                      </Button>
                    </SignInButton>
                  )}
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex items-center lg:hidden">
              <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="rounded-full mr-2 focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
                >
                  {mounted && (theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />)}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
                className="rounded-full focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
              </Button>
            </div>
          </div>
        </div>
      </CurvedNavShell>
    </nav>

    <AnimatePresence>
      {mobileMenuOpen && (
        <motion.div
          id="mobile-menu"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="lg:hidden fixed inset-x-0 top-20 z-[60] bg-background/95 backdrop-blur-xl border-t border-border/50 shadow-xl"
        >
          <div className="container px-4 pt-4 pb-6 flex flex-col gap-4 max-h-[calc(100vh-5rem)] overflow-auto">
            <ul className="flex flex-col gap-2">
              {navItems.map((item) => <NavLink key={item.href} {...item} />)}
            </ul>
            {/* Contact on mobile: smaller/lighter text-only (swapped with Continue) */}
            <Link href="/contact" className="w-full" onClick={() => setMobileMenuOpen(false)}>
              <div className="w-full text-center text-sm text-muted-foreground/70 py-2 select-none">
                Contact <ArrowRight className="inline-block align-middle size-4 ml-1" />
              </div>
            </Link>
            {isSignedIn ? (
              <Link href="/dashboard" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full h-12 rounded-full shadow-lg hover:shadow-xl bg-gradient-to-b from-white to-slate-50 text-slate-900 ring-1 ring-black/5 dark:ring-white/10">
                  Career Explorer
                  <ArrowRight className="size-4 ml-2" />
                </Button>
              </Link>
            ) : (
              <SignInButton mode="modal" forceRedirectUrl="/create-profile">
                <Button className="w-full h-12 rounded-full shadow-lg hover:shadow-xl bg-gradient-to-b from-white to-slate-50 text-slate-900 ring-1 ring-black/5 dark:ring-white/10" onClick={() => setMobileMenuOpen(false)}>
                  Career Explorer
                  <ArrowRight className="size-4 ml-2" />
                </Button>
              </SignInButton>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  )
}