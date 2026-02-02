const SkeletonCard = () => {
  return (
    <div className="animate-pulse bg-white rounded-lg shadow p-4 space-y-4">
      <div className="bg-gray-300 h-32 w-full rounded-lg" />
      <div className="h-4 bg-gray-300 rounded w-3/4" />
      <div className="h-4 bg-gray-300 rounded w-1/2" />
      <div className="h-6 bg-gray-300 rounded w-1/4" />
    </div>
  );
};

export default SkeletonCard;