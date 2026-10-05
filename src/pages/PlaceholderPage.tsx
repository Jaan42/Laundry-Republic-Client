import { Link, useParams } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'
import Card from '../components/ui/Card'
import useDocumentTitle from '../hooks/useDocumentTitle'

interface PlaceholderPageProps {
  title: string
  description: string
}

function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  const { id } = useParams()

  useDocumentTitle(title)

  return (
    <PageContainer className="flex items-center justify-center">
      <div className="w-full max-w-2xl">
        <Link
          to="/"
          className="mb-5 inline-flex text-sm font-semibold text-blue-700 hover:text-blue-800"
        >
          Laundry Republic
        </Link>
        <Card>
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Frontend foundation
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {title}
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-600">{description}</p>
          {id && (
            <p className="mt-3 text-sm text-slate-500">
              Route parameter: <span className="font-medium text-slate-700">{id}</span>
            </p>
          )}
          <p className="mt-6 border-t border-slate-100 pt-4 text-sm text-slate-500">
            This placeholder confirms that the route is connected. The finished page belongs
            to a later commit.
          </p>
        </Card>
      </div>
    </PageContainer>
  )
}

export default PlaceholderPage
