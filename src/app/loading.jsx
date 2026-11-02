
export default function LoadingPage() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center gap-4">
      <span className="loading loading-spinner loading-lg text-primary" />

      <p className="text-base-content/70">
        Loading CareConnect...
      </p>
    </section>
  );
}
