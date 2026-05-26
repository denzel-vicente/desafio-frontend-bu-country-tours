export const SkeletonLoader = ({ variant = 'card', count = 1 }) => {
  const Skeletons = Array(count).fill(0);

  if (variant === 'gallery') {
    return (
      <div className="flex flex-col gap-4 w-full" data-testid="skeleton-gallery">
        <div className="w-full h-96 bg-gray-200 animate-pulse rounded-lg"></div>
        <div className="flex gap-4">
          <div className="w-1/4 h-24 bg-gray-200 animate-pulse rounded-lg"></div>
          <div className="w-1/4 h-24 bg-gray-200 animate-pulse rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (variant === 'widget') {
    return (
      <div className="w-full p-6 bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col gap-4" data-testid="skeleton-widget">
        <div className="w-1/2 h-8 bg-gray-200 animate-pulse rounded"></div>
        <div className="w-full h-12 bg-gray-200 animate-pulse rounded mt-4"></div>
        <div className="w-full h-12 bg-gray-200 animate-pulse rounded"></div>
        <div className="w-3/4 h-6 bg-gray-200 animate-pulse rounded mt-2"></div>
        <div className="w-full h-14 bg-gray-200 animate-pulse rounded-lg mt-4"></div>
      </div>
    );
  }

  // default 'card' variant
  return (
    <>
      {Skeletons.map((_, i) => (
        <div key={i} className="flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden" data-testid="skeleton-card">
          <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
          <div className="p-4 flex flex-col gap-3">
            <div className="w-1/3 h-4 bg-gray-200 animate-pulse rounded"></div>
            <div className="w-full h-6 bg-gray-200 animate-pulse rounded"></div>
            <div className="w-2/3 h-6 bg-gray-200 animate-pulse rounded"></div>
            <div className="flex justify-between mt-2">
              <div className="w-1/4 h-4 bg-gray-200 animate-pulse rounded"></div>
              <div className="w-1/4 h-6 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};
