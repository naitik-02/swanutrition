export default function ImageBox({ fields, design }) {

  // ⭐ DESIGN V2 — Side-by-side, fixed image, clean layout
  if (design === "v1") {
    return (
      <section className="px-6 md:px-20 my-20 space-y-20">
        {fields.map((field, i) => (
          <div
            key={i}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            {/* FIXED HEIGHT IMAGE */}
            <div className="w-full h-80 md:h-[28rem] overflow-hidden rounded-2xl shadow-lg">
              <img
                src={field.image}
                alt={field.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* CONTENT */}
            <div className="space-y-4">
              <h3 className="text-3xl font-bold text-gray-900">
                {field.title}
              </h3>

              {/* Render HTML description */}
              <div
                className="prose prose-gray max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: field.description }}
              />
            </div>
          </div>
        ))}
      </section>
    );
  }

  // ⭐ DESIGN V2 — Clean card-style grid with fixed height image
  return (
    <section className="px-6 md:px-20 my-16">
      <div className="grid md:grid-cols-2 gap-12">
        {fields.map((field, i) => (
          <div
            key={i}
            className="rounded-xl shadow hover:shadow-lg transition overflow-hidden"
          >
            {/* FIXED IMAGE HEIGHT */}
            <div className="w-full h-64 overflow-hidden">
              <img
                src={field.image}
                alt={field.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-5 space-y-3">
              <h3 className="text-xl font-semibold text-gray-900">
                {field.title}
              </h3>

              {/* Description (HTML) */}
              <div
                className="prose prose-sm prose-gray max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: field.description }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
