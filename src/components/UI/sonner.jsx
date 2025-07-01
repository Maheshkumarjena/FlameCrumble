"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: `
            group toast
            bg-background
            text-foreground
            border-border
            shadow-lg
          `,
          description: "text-muted-foreground",
          actionButton: `
            bg-[--brand] hover:bg-[--brand-hover]
            text-[--brand-foreground]
          `,
          cancelButton: `
            bg-muted hover:bg-muted/80
            text-muted-foreground
          `,
        },
        style: {
          '--brand': 'var(--primary)',
          '--brand-hover': 'var(--primary-hover)',
          '--brand-foreground': 'var(--primary-foreground)',
          '--normal-bg': 'var(--background)',
          '--normal-text': 'var(--foreground)',
          '--normal-border': 'var(--border)',
        }
      }}
      {...props}
    />
  )
}

export { Toaster }