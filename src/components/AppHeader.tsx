'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavbarButton,
} from '@/components/ui/resizable-navbar'

export default function AppHeader() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const items = [
    { name: 'Home', link: '/' },
    { name: 'How it works', link: '/#how-it-works' },
  ]

  // Hide header on dashboard and passion pages
  if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/passion')) {
    return null
  }

  return (
    <header className="w-full">
      <Navbar className="top-0">
        <NavBody>
          <Link href="/" className="relative z-20 mr-2 flex items-center space-x-2 px-2 py-1 text-sm font-medium text-black">
            <span className="text-xl font-bold text-gray-900">Pravay</span>
          </Link>
          <NavItems items={items} />
          <div className="relative z-20 hidden items-center gap-2 lg:flex">
            <NavbarButton href="/login" variant="dark">Sign in</NavbarButton>
 
          </div>
        </NavBody>

        <MobileNav>
          <MobileNavHeader>
            <Link href="/" className="relative z-20 mr-2 flex items-center space-x-2 px-2 py-1 text-sm font-medium text-black">
              <span className="text-lg font-bold text-gray-900">Pravay</span>
            </Link>
            <MobileNavToggle isOpen={isOpen} onClick={() => setIsOpen((v) => !v)} />
          </MobileNavHeader>
          <MobileNavMenu isOpen={isOpen} onClose={() => setIsOpen(false)}>
            <nav className="flex w-full flex-col gap-2">
              {items.map((item) => (
                <a key={item.link} href={item.link} onClick={() => setIsOpen(false)} className="px-2 py-2 text-neutral-700">
                  {item.name}
                </a>
              ))}
              <div className="mt-2 flex gap-2">
                <NavbarButton href="/login" as="a" variant="dark" className="flex-1">Sign in</NavbarButton>
              </div>
            </nav>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </header>
  )
}


