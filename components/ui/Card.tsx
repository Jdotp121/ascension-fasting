import React from 'react'

interface CardProps {
  readonly children: React.ReactNode
  readonly className?: string
  readonly onClick?: () => void
}

export function Card({ children, className = '', onClick }: CardProps) {
  const baseClassName = `bg-white rounded-lg shadow-md p-6 ${onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''} ${className}`

  if (onClick) {
    return (
      <button
        type="button"
        className={`${baseClassName} w-full text-left`}
        onClick={onClick}
      >
        {children}
      </button>
    )
  }

  return (
    <div className={baseClassName}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '' }: { readonly children: React.ReactNode; readonly className?: string }) {
  return <div className={`mb-4 ${className}`}>{children}</div>
}

export function CardTitle({ children, className = '' }: { readonly children: React.ReactNode; readonly className?: string }) {
  return <h3 className={`text-xl font-semibold text-gray-900 ${className}`}>{children}</h3>
}

export function CardContent({ children, className = '' }: { readonly children: React.ReactNode; readonly className?: string }) {
  return <div className={className}>{children}</div>
}
