import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const DestinationNotFound = () => {
  return (
    <main className="min-h-screen bg-white px-5 py-10 text-[#0C0B0B] sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center py-24 text-center">
        <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">
          Destination Not Found
        </h1>
        <p className="mt-3 max-w-md text-sm text-[#6C696D]">
          The destination you are looking for does not exist or may have been
          removed.
        </p>
        <Link
          href="/destinations"
          className="mt-8 inline-flex h-11 items-center gap-2 rounded-md bg-[#15A1BF] px-6 text-sm font-medium text-white transition-colors hover:bg-teal-600"
        >
          <ArrowLeft className="size-4" />
          Back to Destinations
        </Link>
      </div>
    </main>
  );
};

export default DestinationNotFound;
