const mockTemplates = [
  {
    id: 'tpl-1',
    name: 'Instagram Product Launch',
    category: 'Social Media',
    format: 'Carousel',
    platform: 'Instagram',
    headline: 'Build launch momentum before day one',
    body: 'Use this template to sequence launch messaging across social posts.',
    cta: 'Join the waitlist',
  },
  {
    id: 'tpl-2',
    name: 'Welcome Drip Sequence',
    category: 'Email',
    format: '5-step Email',
    platform: 'Email',
    headline: 'Welcome new founders with clarity',
    body: 'Mock onboarding email sequence for founder activation.',
    cta: 'Complete your profile',
  },
  {
    id: 'tpl-3',
    name: 'Founder Story Blog',
    category: 'Content',
    format: 'Article',
    platform: 'LinkedIn',
    headline: 'Tell the founder story with credibility',
    body: 'Template for long-form founder narrative content.',
    cta: 'Read the story',
  },
  {
    id: 'tpl-4',
    name: 'Mentor Spotlight Post',
    category: 'Social Media',
    format: 'Single Image',
    platform: 'Instagram',
    headline: 'Meet the mentor behind the guidance',
    body: 'Highlight a mentor and their area of expertise.',
    cta: 'Book a session',
  },
]

export async function getTemplates() {
  return Promise.resolve(mockTemplates)
}

const templateService = {
  getTemplates,
}

export default templateService
