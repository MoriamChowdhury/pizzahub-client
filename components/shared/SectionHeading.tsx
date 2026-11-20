export default function SectionHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center">
      <h2 className="text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
        {title}
      </h2>
      <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-primary" />
      {subtitle && <p className="mt-4 text-muted-foreground">{subtitle}</p>}
    </div>
  );
}