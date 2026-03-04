import { Camera, Trash2, UserCircle2 } from 'lucide-react'
import { useRef } from 'react'
import { Button } from '../components/ui/button'
import { useAuth } from '../context/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

const ProfilePage = () => {
  const { user, profileImage, updateProfileImage } = useAuth()
  const fileInputRef = useRef(null)

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return

    const reader = new FileReader()
    reader.onload = () => updateProfileImage(reader.result)
    reader.readAsDataURL(file)
  }

  return (
    <Card className="border-border/80">
      <CardHeader>
        <CardTitle className="text-slate-900 dark:text-slate-100">Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 text-sm text-slate-700 dark:text-slate-200">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          {profileImage ? (
            <img src={profileImage} alt="Profile" className="h-24 w-24 rounded-full border border-border object-cover" />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full border border-border bg-slate-100 dark:bg-slate-800">
              <UserCircle2 className="h-14 w-14 text-muted-foreground" />
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
              <Camera className="mr-2 h-4 w-4" /> Upload Photo
            </Button>
            {profileImage && (
              <Button type="button" variant="ghost" onClick={() => updateProfileImage(null)}>
                <Trash2 className="mr-2 h-4 w-4" /> Remove
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <p><span className="font-medium">Name:</span> {user?.name}</p>
          <p><span className="font-medium">Email:</span> {user?.email}</p>
          <p><span className="font-medium">Role:</span> {user?.role}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProfilePage
