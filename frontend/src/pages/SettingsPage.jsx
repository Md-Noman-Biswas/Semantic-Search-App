import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

const SettingsPage = () => (
  <Card>
    <CardHeader><CardTitle>Settings</CardTitle></CardHeader>
    <CardContent className="text-sm text-muted-foreground">UI preferences and system settings can be managed here.</CardContent>
  </Card>
)

export default SettingsPage
