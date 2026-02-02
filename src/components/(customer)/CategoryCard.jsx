const CategoryCard = ({ cat }) => {
  return (
    <div
      className="
        group relative 
        w-[80px] h-[80px]
        sm:w-[90px] sm:h-[90px]
        md:w-[110px] md:h-[110px]
        lg:w-[120px] lg:h-[120px]
        rounded-xl overflow-hidden cursor-pointer
        shadow-md hover:shadow-xl
        transition-all duration-300
      "
    >
      <img
        src={cat.image}
        alt={cat.name}
        className="
          w-full h-full object-cover
          group-hover:scale-110
          transition-transform duration-300
        "
      />

      {/* Overlay */}
      <div
        className="
          absolute inset-0
          bg-gradient-to-t from-black/70 via-black/20 to-transparent
          flex items-end justify-center
          p-2
        "
      >
        <p
          className="
            text-[10px]
            sm:text-xs
            md:text-sm
            font-semibold text-white
            tracking-wide capitalize
            drop-shadow-lg
            text-center
            leading-tight
          "
        >
          {cat.name}
        </p>
      </div>
    </div>
  );
};

export default CategoryCard;
