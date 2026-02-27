import { useEffect, useState } from 'react'
import api from '../api/client'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'

const emptyForm = { name: '', email: '', password: '', role: 'user' }

const UserManagementPage = () => {
  const [users, setUsers] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)

  const loadUsers = async () => {
    setLoading(true)
    const { data } = await api.get('/api/users')
    setUsers(data)
    setLoading(false)
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const createUser = async (event) => {
    event.preventDefault()
    await api.post('/api/users', form)
    setForm(emptyForm)
    await loadUsers()
  }

  const changeRole = async (userId, role) => {
    await api.put(`/api/users/${userId}`, { role })
    await loadUsers()
  }

  return (
    <section className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Create User</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={createUser} className="grid gap-3 md:grid-cols-2">
            <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <Input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            <select className="rounded-md border border-border bg-white px-3 py-2 text-sm" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <Button type="submit" className="md:col-span-2 md:w-fit">Create User</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Users</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-600">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={3} className="px-4 py-6 text-center text-muted-foreground">Loading users...</td></tr>
                ) : users.map((user) => (
                  <tr key={user.id} className="border-t border-border">
                    <td className="px-4 py-3">{user.name}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3">
                      <select
                        className="rounded-md border border-border bg-white px-2 py-1"
                        value={user.role}
                        onChange={(e) => changeRole(user.id, e.target.value)}
                      >
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

export default UserManagementPage
