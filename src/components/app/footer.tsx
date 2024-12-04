export function Footer() {
  return (
    <footer className="border-t py-4 px-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          © 2023 Your Company Name. All rights reserved.
        </p>
        <nav className="flex space-x-4">
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
            Privacy Policy
          </a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
            Terms of Service
          </a>
        </nav>
      </div>
    </footer>
  )
}

