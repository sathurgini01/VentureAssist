const mockArticles = [
  {
    id: 'growth-101',
    title: 'How to validate startup demand',
    excerpt: 'A mock guide to testing demand before you overbuild.',
    author: 'Ayesha Fernando',
    date: '2026-03-24',
    readTime: '6 min read',
    category: 'Growth',
    status: 'Published',
    views: '2340',
    content:
      'This mock article explains how founders can validate demand through interviews, small launches, and feedback loops.',
  },
  {
    id: 'fundraising-updates',
    title: 'Investor updates founders actually send',
    excerpt: 'Use this placeholder article to model fundraising communication.',
    author: 'Nadia Perera',
    date: '2026-03-20',
    readTime: '4 min read',
    category: 'Fundraising',
    status: 'Draft',
    views: '620',
    content:
      'This placeholder article outlines concise investor updates that communicate progress, blockers, and asks.',
  },
  {
    id: 'mentor-meetings',
    title: 'Preparing for high-value mentor sessions',
    excerpt: 'A mock article on how to make mentor calls more useful.',
    author: 'Liam Santos',
    date: '2026-03-18',
    readTime: '5 min read',
    category: 'Mentorship',
    status: 'Published',
    views: '1210',
    content:
      'This mock article covers preparation, note-taking, and action planning for mentor sessions.',
  },
]

export async function getArticles() {
  return Promise.resolve(mockArticles)
}

export async function getArticleById(articleId) {
  return Promise.resolve(
    mockArticles.find((article) => article.id === articleId) ?? mockArticles[0],
  )
}

const articleService = {
  getArticles,
  getArticleById,
}

export default articleService
