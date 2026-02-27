import { Link } from 'react-router-dom'

const Footer = () => (
  <footer className="border-t border-border bg-white/90 dark:bg-slate-950/90">
    <div className="mx-auto grid w-full max-w-[1400px] gap-8 px-4 py-10 text-sm text-muted-foreground md:grid-cols-4 md:px-6">
      <div>
        <h4 className="mb-3 font-semibold text-foreground">Semantic Search</h4>
        <p>Modern document intelligence platform with secure role-based collaboration.</p>
      </div>
      <div>
        <h4 className="mb-3 font-semibold text-foreground">Navigation</h4>
        <div className="space-y-1.5">
          <Link to="/" className="block hover:text-primary">Home</Link>
          <Link to="/dashboard" className="block hover:text-primary">Dashboard</Link>
        </div>
      </div>
      <div>
        <h4 className="mb-3 font-semibold text-foreground">Account</h4>
        <div className="space-y-1.5">
          <Link to="/profile" className="block hover:text-primary">Profile</Link>
          <Link to="/settings" className="block hover:text-primary">Settings</Link>
        </div>
      </div>
      <div>
        <h4 className="mb-3 font-semibold text-foreground">Stack</h4>
        <p>React · Tailwind CSS · shadcn/ui · Framer Motion · FastAPI</p>
      </div>
    </div>
  </footer>
)

export default Footer
