import { ReactNode } from 'react'

interface AppPageLayoutProps {
  readonly children: ReactNode
  readonly title?: string
  readonly subtitle?: string
  readonly icon?: ReactNode
  readonly hideHeader?: boolean
}

/**
 * AppPageLayout - Shared layout component for all app pages
 * 
 * Provides consistent outer container sizing and page header styling
 * based on the Achievements page design.
 */
export function AppPageLayout({ 
  children, 
  title, 
  subtitle, 
  icon,
  hideHeader = false 
}: AppPageLayoutProps) {
  return (
    <main className="w-full flex-1 bg-gray-50">
      <div className="w-full max-w-[1600px] mx-auto px-8 lg:px-12 xl:px-16 py-8 pb-24 md:pb-8">
        {!hideHeader && (title || subtitle) && (
          <div className="mb-6 sm:mb-8">
            {title && (
              <div className="flex items-center gap-3 mb-2">
                {icon}
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h1>
              </div>
            )}
            {subtitle && (
              <p className="text-sm sm:text-base text-gray-600">{subtitle}</p>
            )}
          </div>
        )}
        {children}
      </div>
    </main>
  )
}
