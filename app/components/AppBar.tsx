import Image from "next/image";

export default function AppBar() {
  return (
    <header className="bg-white border border-[#d4d4d4] flex flex-col items-start px-6 py-4 w-full">
      <div className="h-9 w-32 relative" style={{ aspectRatio: '32/9' }}>
        <Image
          src="/logo.svg"
          alt="Logo"
          fill
          className="object-contain"
          priority
          unoptimized
        />
      </div>
    </header>
  );
}
