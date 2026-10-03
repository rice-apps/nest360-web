import Link from 'next/link';
import { getPillars, getImpactStats } from "@/lib/data/site";

const colors = [
  { title: "text-red-300", button: "bg-red-400" },
  { title: "text-blue-300", button: "bg-blue-400" },
  { title: "text-green-300", button: "bg-green-400" },
];

export default async function Home() {
  const pillars = await getPillars();
  const stats = await getImpactStats();
  return (
    <main>
        <nav className="sticky top-0 z-50 flex items-center justify-between bg-white px-6 py-4 shadow-sm">
            <div className="text-xl font-bold">NEST360</div>
            <ul className="flex gap-6">
                <li>
                <Link href="/" className="hover:text-blue-600">Who We Are</Link>
                </li>
                <li>
                <Link href="/about" className="hover:text-blue-600">Where We Work</Link>
                </li>
                <li>
                <Link href="/contact" className="hover:text-blue-600">What We Do</Link>
                </li>
                        <li>
                <Link href="/contact" className="hover:text-blue-600">Knowledge Hub</Link>
                </li>
                        <li>
                <Link href="/contact" className="hover:text-blue-600">News & Highlight</Link>
                </li>
            </ul>
        </nav>
      <section>
        <h2>What We Do</h2>

        <div>
          <div>
            <h3>Data-Driven Action</h3>
            <p>
              We use locally owned data to help healthcare teams and governments
              improve newborn care.
            </p>
          </div>
        </div>
      </section>

      {}
      <section className="px-6 py-12 md:px-16 lg:px-24">
  <h2 className="text-2xl font-bold">Our progress in numbers</h2>

  <dl className="mt-8 grid gap-8 md:grid-cols-3">
    {stats.map((stat) => (
      <div key={stat.label} className="flex flex-col bg-gray-100 p-6 text-gray-900">
        <dt className="order-2 mt-2">{stat.label}</dt>
        <dd className="order-1 text-4xl font-bold">{stat.value}</dd>
      </div>
    ))}
  </dl>
</section>

      {/** This is the impact section, it is connected to the site.ts with designs from types.ts */}
      <section className = 'px-6 py-12'>
      <div className="mx-auto max-w-6xl">
      <h2 className="text-2xl font-bold">Our Impact</h2>
      <p>
        We partner with governments, hospitals, educational institutions, professional societies, and national non-governmental organizations (NGOs) to catalyze country-led change through:
      </p>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
    {pillars.map((pillar, index) => {
      const color = colors[index % colors.length];

      return (
        <div
          key={pillar.title}
          className="flex flex-col bg-gray-100 p-6 text-gray-900"
        >
          {/* Image placeholder */}
          <div className="flex h-40 items-center justify-center bg-gray-200 text-sm text-gray-500">
            Image placeholder
          </div>

          <h3 className={`mt-4 text-lg font-semibold ${color.title}`}>
            {pillar.title}
          </h3>
          <p className="mt-2 flex-1">{pillar.body}</p>

          <button
            type="button"
            className={`mt-4 self-start px-4 py-2 text-sm font-medium text-white ${color.button}`}
          >
            {pillar.link.label}
          </button>
        </div>
      );
    })}
  </div>
  </div>
</section>

  <section>
    <div className="mx-auto max-w-6xl">
    <h2 className="text-2xl font-bold"> Our Progress in Numbers </h2>
    <>
    </>
    </div>
  </section>


      {/** The Resources Section: In this section we add on the numbers */ }
      <section>
        
        <h2>Resources</h2>

        <p>
          Explore clinical and biomedical resources, training materials, and
          other tools for newborn healthcare teams.
        </p>
      </section>
    </main>
  );
}