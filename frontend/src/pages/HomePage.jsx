import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

const HomePage = () => (
  <section className="space-y-6">
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="text-2xl">Semantic Search Platform</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-muted-foreground">
        <p>Manage documents, users, and role-based workflows from a modern dashboard.</p>
        <Link to="/dashboard"><Button>Go to Dashboard</Button></Link>
      </CardContent>
    </Card>
  </section>
)

export default HomePage
