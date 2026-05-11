const benefits = [
    "Perfumes 100% originales",
    "Duración extrema",
    "Envíos a todo el país",
    "Atención personalizada"
  ];
  
  export default function Benefits() {
    return (
      <section className="bg-black px-6 py-24">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-4">
          {benefits.map((item) => (
            <div
              key={item}
              className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl"
            >
              <h3 className="text-lg font-semibold text-white">
                {item}
              </h3>
            </div>
          ))}
        </div>
      </section>
    );
  }