const LoadingSkeleton = ({ count = 4, type = "product" }) => {
  if (type === "product") {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 stagger-children">
        {[...Array(count)].map((_, i) => (
          <div key={i} className="card">
            <div className="aspect-[3/4] skeleton relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmerSlide_1.5s_ease-in-out_infinite]" style={{ backgroundSize: "200% 100%" }} />
            </div>
            <div className="p-4 space-y-3">
              <div className="h-2.5 skeleton w-1/3 rounded-full" />
              <div className="h-3.5 skeleton w-2/3 rounded-full" />
              <div className="h-3 skeleton w-1/4 rounded-full" />
              <div className="flex items-center gap-1 mt-2">
                {[...Array(5)].map((_, j) => (
                  <div key={j} className="w-3 h-3 skeleton rounded-full" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="flex space-x-4 animate-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
          <div className="w-20 h-20 skeleton rounded-xl flex-shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="h-3 skeleton w-1/3 rounded-full" />
            <div className="h-2.5 skeleton w-1/2 rounded-full" />
            <div className="h-2.5 skeleton w-1/4 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
