export default function RepeaterImgContent({ fields, design }) {

  // ⭐ DESIGN V2 (Single Column)
  if (design === "v2") {
    return (
      <section className="px-6 md:px-20 my-20 space-y-12">
        {fields.map((f, i) => (
          <div
            key={i}
            className="rounded-xl p-6 md:p-10 shadow bg-white border"
            style={{ background: f.backgroundColor || "white" }}
          >
            {/* FIXED IMAGE AREA */}
            <div className="w-full h-72 md:h-96 overflow-hidden rounded-xl mb-6">
              <img
                src={f.image}
                alt={f.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-3">
              {f.subtitle && (
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  {f.subtitle}
                </h4>
              )}

              <h3 className="text-3xl font-bold text-gray-900">
                {f.title}
              </h3>

              <p className="text-gray-700 leading-relaxed">
                {f.description}
              </p>

              {f.buttonTitle && (
                <a
                  href={f.buttonUrl}
                  className="inline-block mt-2 px-5 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
                >
                  {f.buttonTitle}
                </a>
              )}
            </div>
          </div>
        ))}
      </section>
    );
  }

  // ⭐ DESIGN V1 (2 COLUMN FIXED BOXES)
  return (
    <section className="px-6 md:px-20 my-16">
      <div className="grid md:grid-cols-2 gap-10">
        {fields.map((f, i) => (
          <div
            key={i}
            className="shadow-lg rounded-xl bg-white border overflow-hidden"
            style={{ background: f.backgroundColor || "white" }}
          >
            {/* FIXED IMAGE AREA */}
            <div className="w-full h-64 overflow-hidden">
              <img
                src={f.image}
                alt={f.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* FIXED HEIGHT CONTENT */}
            <div className="p-6 space-y-3 h-60 flex flex-col justify-between">
              <div>
                {f.subtitle && (
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {f.subtitle}
                  </h4>
                )}

                <h3 className="text-xl font-bold text-gray-900">
                  {f.title}
                </h3>

                <p className="text-gray-700 text-sm leading-relaxed line-clamp-4">
                  {f.description}
                </p>
              </div>

              {f.buttonTitle && (
                <a
                  href={f.buttonUrl}
                  className="inline-block mt-3 text-orange-600 font-semibold hover:underline"
                >
                  {f.buttonTitle} →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
