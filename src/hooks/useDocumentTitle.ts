import { useEffect } from 'react'

function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = `${title} | Laundry Republic`
  }, [title])
}

export default useDocumentTitle
