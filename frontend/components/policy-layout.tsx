"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

const links = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/refund-cancellation", label: "Refund & Cancellation" },
  { href: "/return-policy", label: "Return Policy" },
]

export default function PolicyLayout({ title, children }: { title: string; children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <section className="container mx-auto max-w-6xl px-4">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/privacy-policy">Policies</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-3">
          <nav aria-label="Legal navigation" className="rounded-lg border bg-card p-4">
            <ul className="space-y-2 text-sm">
              {links.map((l) => {
                const active = pathname === l.href
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className={`block rounded-md px-3 py-2 transition-colors ${
                        active ? "bg-primary/10 text-primary" : "hover:bg-muted"
                      }`}
                      aria-current={active ? "page" : undefined}
                    >
                      {l.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </aside>

        {/* Content */}
        <article className="lg:col-span-9">
          <header className="mb-3">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h1>
          </header>
          <div className="prose prose-neutral dark:prose-invert mt-6 max-w-none">
            {children}
          </div>
        </article>
      </div>
    </section>
  )
}
