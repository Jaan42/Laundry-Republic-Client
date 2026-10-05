import type { HTMLAttributes } from 'react'

type CardProps = HTMLAttributes<HTMLDivElement>

function Card({ className = '', ...props }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-blue-100 bg-white p-6 shadow-sm ${className}`}
      {...props}
    />
  )
}

export default Card
