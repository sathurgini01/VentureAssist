import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAppContext } from '../../../context/AppContext'
import { ErrorState, LoadingState } from '../../../components/common/AsyncState'
import { ActionButton, ActionLink, BusinessPageHeader, SectionCard, SwotQuadrant } from '../components/BusinessComponents'
import { generateIdeaSwot, getIdeaById, getIdeaSwot } from '../services/businessService'

function BusinessSwotPage() {
  const { id } = useParams()
  const { addToast } = useAppContext()
  const [idea, setIdea] = useState(null)
  const [swot, setSwot] = useState(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadSwotPage() {
      try {
        setLoading(true)
        setError('')
        const [ideaData, swotData] = await Promise.all([getIdeaById(id), getIdeaSwot(id).catch(() => null)])

        if (isMounted) {
          setIdea(ideaData)
          setSwot(swotData)
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadSwotPage()

    return () => {
      isMounted = false
    }
  }, [id])

  async function handleGenerate() {
    try {
      setGenerating(true)
      const generatedSwot = await generateIdeaSwot(id)
      setSwot(generatedSwot)
      addToast(swot ? 'SWOT regenerated successfully.' : 'SWOT generated successfully.', 'success')
    } catch (generateError) {
      addToast(generateError.message, 'error')
    } finally {
      setGenerating(false)
    }
  }

  if (loading) {
    return <LoadingState title="Loading SWOT workspace" description="Preparing the idea details and latest SWOT analysis." />
  }

  if (error || !idea) {
    return <ErrorState title="SWOT page unavailable" message={error || 'This idea could not be loaded.'} />
  }

  return (
    <div className="space-y-6">
      <BusinessPageHeader
        eyebrow="SWOT analysis"
        title={`Strategic view for ${idea.title}`}
        description="Generate an AI-assisted SWOT to clarify what to protect, improve, pursue, and watch closely as this idea develops."
        variant="ideas"
        actions={
          <>
            <ActionButton onClick={handleGenerate} disabled={generating}>
              {generating ? 'Generating...' : swot ? 'Regenerate SWOT' : 'Generate SWOT'}
            </ActionButton>
            <ActionLink to={`/business/ideas/${id}`} variant="bannerSecondary">
              Back to idea
            </ActionLink>
          </>
        }
      />

      <SectionCard title="SWOT quadrants" subtitle="Each quadrant highlights a different lens for evaluating the idea.">
        <div className="grid gap-4 lg:grid-cols-2">
          <SwotQuadrant title="Strength" tone="Strengths" items={swot?.strengths} />
          <SwotQuadrant title="Weakness" tone="Weaknesses" items={swot?.weaknesses} />
          <SwotQuadrant title="Opportunity" tone="Opportunities" items={swot?.opportunities} />
          <SwotQuadrant title="Threat" tone="Threats" items={swot?.threats} />
        </div>
      </SectionCard>
    </div>
  )
}

export default BusinessSwotPage
