export function Footer() {
  return (
    <footer className="border-t border-border/60 mt-24">
      <div className="container py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} OrderSense AI · Predict the wait, never guess.</p>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-foreground transition-colors">About</a>
          <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
          <a href="#" className="hover:text-foreground transition-colors">Terms</a>
        </div>
      </div>
    </footer>
  );
}
