const DestinationsDetailsLoading = () => {
  return (
    <main className="min-h-screen bg-white px-5 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        {/* Top Bar */}
        <div className="mb-6 h-5 w-40 animate-pulse rounded bg-[#F0F0F2]" />

        {/* Hero Image */}
        <div className="mb-8 h-[240px] animate-pulse bg-[#F0F0F2] sm:h-[320px] lg:h-[400px]" />

        {/* Content */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px] lg:gap-14">
          <div>
            <div className="h-4 w-28 animate-pulse rounded bg-[#F0F0F2]" />
            <div className="mt-3 h-10 w-2/3 animate-pulse rounded bg-[#F0F0F2]" />
            <div className="mt-5 h-7 w-40 animate-pulse rounded-full bg-[#F0F0F2]" />
            <hr className="my-8 border-[#ECECEE]" />
            <div className="h-6 w-32 animate-pulse rounded bg-[#F0F0F2]" />
            <div className="mt-4 space-y-3">
              <div className="h-4 w-full animate-pulse rounded bg-[#F0F0F2]" />
              <div className="h-4 w-4/5 animate-pulse rounded bg-[#F0F0F2]" />
            </div>
          </div>

          <div className="h-72 animate-pulse rounded-lg bg-[#F0F0F2]" />
        </div>
      </div>
    </main>
  );
};

export default DestinationsDetailsLoading;
