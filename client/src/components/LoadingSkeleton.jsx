const LoadingSkeleton = ({ count = 4, type = "product" }) => {
  if (type === "product") {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {[...Array(count)].map((_, i) => (
          <div key={i} className="card">
            <div className="aspect-[3/4] skeleton" />
            <div className="p-4 space-y-2">
              <div className="h-3 skeleton w-1/3" />
              <div className="h-4 skeleton w-2/3" />
              <div className="h-4 skeleton w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="flex space-x-4">
          <div className="w-20 h-20 skeleton rounded-lg" />
          <div className="flex-1 space-y-2">
            <div className="h-4 skeleton w-1/3" />
            <div className="h-3 skeleton w-1/2" />
            <div className="h-3 skeleton w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
