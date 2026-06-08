interface PlaceholderPageProps {
  title: string;
  description?: string;
}

export default function PlaceholderPage({
  title,
  description = "This page is being prepared.",
}: PlaceholderPageProps) {
  return (
    <main className="mx-auto flex min-h-[50vh] w-full max-w-5xl flex-col justify-center px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
        Coming soon
      </p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground">
        {title}
      </h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">{description}</p>
    </main>
  );
}
