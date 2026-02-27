import { Link } from 'react-router-dom'

const Footer = () => (
  <footer className="mt-10 border-t border-border bg-white py-10 dark:border-slate-800 dark:bg-slate-950">
    <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 text-sm text-muted-foreground md:grid-cols-4 md:px-6">
      <div>
        <h4 className="mb-2 font-semibold text-foreground">About</h4>
        <p>Semantic Search App helps teams organize and manage documents with role-based workflows.</p>
      </div>
      <div>
        <h4 className="mb-2 font-semibold text-foreground">Quick Links</h4>
        <div className="space-y-1">
          <Link to="/" className="block hover:text-primary">Home</Link>
          <Link to="/login" className="block hover:text-primary">Login</Link>
        </div>
      </div>
      <div>
        <h4 className="mb-2 font-semibold text-foreground">Dashboard Links</h4>
        <div className="space-y-1">
          <Link to="/dashboard" className="block hover:text-primary">Dashboard</Link>
          <Link to="/users" className="block hover:text-primary">User Management</Link>
        </div>
      </div>
      <div>
        <h4 className="mb-2 font-semibold text-foreground">Contact / Credits</h4>
        <p>Built with React, Tailwind, FastAPI and SQLAlchemy.</p>
      </div>
    </div>
    <div className="mx-auto mt-8 w-full max-w-7xl border-t border-border px-4 pt-4 text-xs text-muted-foreground md:px-6 dark:border-slate-800">
      Latest frontend rollout applied: <span className="font-semibold">UI Refresh v2</span>
    </div>
  </footer>
)

export default Footer
