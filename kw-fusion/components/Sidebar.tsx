'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { BarChart, Globe, ChevronRight, ChevronLeft, Sun, Moon, Search, FlaskConical, ChevronDown, Network, FileText } from 'lucide-react'
import { useTheme } from "next-themes"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

const menuItems = [
  { name: 'Analytics', icon: BarChart, href: '/analytics' },
  { name: 'Domains', icon: Globe, href: '/domains' },
]

const labItems = [
  { name: 'Related Keywords', icon: Search, href: '/' },
  { name: 'Keyword Clusters', icon: Network, href: '/labs/keyword-clusters' },
  { name: 'Content Ideas', icon: FileText, href: '/labs/content-ideas' },
]

export function Sidebar() {
  const [expanded, setExpanded] = useState(true)
  const [labsExpanded, setLabsExpanded] = useState(false)
  const pathname = usePathname()
  const { setTheme, theme } = useTheme()

  return (
    <aside className={`bg-background border-r border-border transition-all duration-300 ${expanded ? 'w-64' : 'w-20'}`}>
      <div className="flex flex-col h-full p-4">
        <div className="flex justify-between items-center mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <ChevronLeft /> : <ChevronRight />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? <Moon className="h-[1.2rem] w-[1.2rem]" /> : <Sun className="h-[1.2rem] w-[1.2rem]" />}
          </Button>
        </div>
        <nav className="space-y-2">
          <Collapsible
            open={labsExpanded}
            onOpenChange={setLabsExpanded}
            className="space-y-2"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className={`w-full justify-start ${expanded ? '' : 'justify-center'}`}
                onClick={() => setLabsExpanded(!labsExpanded)}
              >
                <FlaskConical className="h-5 w-5 mr-2" />
                {expanded && (
                  <>
                    <span className="flex-1 text-left">Labs</span>
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${labsExpanded ? 'rotate-180' : ''}`} />
                  </>
                )}
              </Button>
            </CollapsibleTrigger>
            {expanded && (
              <CollapsibleContent className="space-y-2">
                {labItems.map((item) => (
                  <Link key={item.name} href={item.href}>
                    <Button
                      variant={pathname === item.href ? 'secondary' : 'ghost'}
                      className="w-full justify-start pl-9"
                    >
                      <item.icon className="h-5 w-5 mr-2" />
                      <span>{item.name}</span>
                    </Button>
                  </Link>
                ))}
              </CollapsibleContent>
            )}
          </Collapsible>
          {menuItems.map((item) => (
            <Link key={item.name} href={item.href}>
              <Button
                variant={pathname === item.href ? 'secondary' : 'ghost'}
                className={`w-full justify-start ${expanded ? '' : 'justify-center'}`}
              >
                <item.icon className="h-5 w-5 mr-2" />
                {expanded && <span>{item.name}</span>}
              </Button>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  )
}

