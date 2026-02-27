import { useEffect, useState } from 'react'
import api from '../api/client'

const emptyForm = { name: '', email: '', password: '', role: 'user' }

const UserManagementPage = () => {
  const [users, setUsers] = useState([])
  const [form, setForm] = useState(emptyForm)

  const loadUsers = async () => {
    const { data } = await api.get('/api/users')
    setUsers(data)
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
    <section>
      <h2>User Management</h2>
      <form onSubmit={createUser} style={{ display: 'grid', gap: 8, maxWidth: 400 }}>
        <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Create User</button>
      </form>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} ({user.email}) - {user.role}
            <select value={user.role} onChange={(e) => changeRole(user.id, e.target.value)} style={{ marginLeft: 8 }}>
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default UserManagementPage
