export default function EditorSection({ fields, design }) {

  if (design === "v2") {
    return (
      <section className="px-20 my-16 text-center">
        {fields.map((f, i) => (
          <div key={i} className="prose mx-auto" dangerouslySetInnerHTML={{ __html: f.content }} />
        ))}
      </section>
    );
  }

  return (
    <section className="px-20 my-16">
      {fields.map((f, i) => (
        <div key={i} className="prose" dangerouslySetInnerHTML={{ __html: f.content }} />
      ))}
    </section>
  );
}
