import { useAuth } from '../context/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

const ProfilePage = () => {
  const { user } = useAuth()
  return (
    <Card>
      <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
      <CardContent className="space-y-1 text-sm">
        <p><span className="font-medium">Name:</span> {user?.name}</p>
        <p><span className="font-medium">Email:</span> {user?.email}</p>
        <p><span className="font-medium">Role:</span> {user?.role}</p>
      </CardContent>
    </Card>
  )
}

export default ProfilePage
