import type { HTMLAttributes } from 'react'

type PageContainerProps = HTMLAttributes<HTMLElement>

function PageContainer({ className = '', ...props }: PageContainerProps) {
  return (
    <main
      className={`mx-auto min-h-screen w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 ${className}`}
      {...props}
    />
  )
}

export default PageContainer
