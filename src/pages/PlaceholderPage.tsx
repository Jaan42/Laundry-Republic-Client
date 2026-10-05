import { useParams } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'
import PageHeader from '../components/layout/PageHeader'
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
    <PageContainer>
      <PageHeader title={title} description={description} />
      <Card className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
          Page placeholder
        </p>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          This route is connected to the shared application layout. Its feature content belongs
          to a later commit.
        </p>
        {id && (
          <p className="mt-4 rounded-lg bg-blue-50 px-3 py-2 text-sm text-slate-600">
            Route parameter: <span className="font-semibold text-slate-800">{id}</span>
          </p>
        )}
      </Card>
    </PageContainer>
  )
}

export default PlaceholderPage
