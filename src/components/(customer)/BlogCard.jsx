import React from "react";

const BlogCard = ({ blog }) => {
  return (
    <div className="relative h-[320px] w-full rounded-xl overflow-hidden group cursor-pointer shadow-lg">
      
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
        style={{ backgroundImage: `url(${blog.featuredImage})` }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-all duration-300" />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between h-full p-5 text-white">
        
        {/* Title */}
        <h2 className="text-xl font-semibold leading-tight line-clamp-2">
          {blog.title}
        </h2>

        {/* Description */}
       <p
  className="text-sm text-gray-200 line-clamp-3"
  dangerouslySetInnerHTML={{ __html: blog.description }}
/>

      </div>
    </div>
  );
};

export default BlogCard;
