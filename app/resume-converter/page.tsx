export default function ResumeConverterPage() {
  return (
    <div className="flex min-h-[calc(100vh-68px)] items-center justify-center bg-white dark:bg-black">
      <main className="flex flex-col items-center justify-center gap-8 p-16">
        <h1 className="text-4xl font-semibold text-black dark:text-white">
          Resume Converter
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 text-center max-w-md">
          Convert and parse PDF resumes with ease.
        </p>
      </main>
    </div>
  );
}
