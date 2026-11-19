/**
 * Public landing page — no auth required.
 * Route group (marketing) keeps public and authenticated routes separate
 * without affecting the URL (no "/marketing" prefix in the URL).
 */
export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold">Welcome</h1>
      <p className="mt-4 text-muted-foreground">Your application starts here.</p>
    </main>
  );
}
