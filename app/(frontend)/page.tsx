import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <nav className="sticky top-0 z-50 flex items-center justify-between bg-white px-6 py-4 shadow-sm">
        <div><img src="/image.png" alt="Logo" width="200" /></div>
        <ul className="flex gap-10">
          {/* Who We Are + Dropdown */}
          <li className="relative group">
            <Link href="/" className="hover:text-blue-600">
              Who We Are
            </Link>

            {/* Dropdown */}
            <div className="absolute left-0 top-full hidden w-60 bg-white p-6 shadow-lg group-hover:block">
              <div className="flex flex-col gap-4">

                <Link
                  href="/about"
                  className="hover:text-blue-600"
                >
                  About
                </Link>

                <Link
                  href="/leadership"
                  className="hover:text-blue-600"
                >
                  Leadership
                </Link>

                <Link
                  href="/contact"
                  className="hover:text-blue-600"
                >
                  Contact us
                </Link>

              </div>
            </div>
          </li>

          {/* Other menu options */}
          <li>
            <Link href="/about" className="hover:text-blue-600">
              Where We Work
            </Link>
          </li>

          <li>
            <Link href="/contact" className="hover:text-blue-600">
              What We Do
            </Link>
          </li>

          <li>
            <Link href="/contact" className="hover:text-blue-600">
              Knowledge Hub
            </Link>
          </li>

          <li>
            <Link href="/contact" className="hover:text-blue-600">
              News & Highlight
            </Link>
          </li>

        </ul>
      </nav>

      {/*Main page Img */}
      <section
        className="
          relative
          min-h-[650px]
          bg-[url('/image.png')]
          bg-cover
          bg-center
        "
      >
        {/* Dark/transparent overlay */}
        <div className="absolute inset-0 bg-black/30"></div>

        {/* Text and buttons */}
        <div className="relative z-10 mx-auto max-w-6xl px-8 pt-40 text-white">

          <p className="mb-8 text-2xl font-medium">
            Newborn Essential Solutions and Technologies
          </p>

          <h1 className="max-w-6xl text-5xl font-bold leading-tight">
            We are an international alliance united to end
            preventable newborn deaths in African hospitals
          </h1>

          {/* Buttons */}
          <div className="mt-10 flex gap-6">

            <Link
              href="/about"
              className="
                rounded-md
                bg-cyan-400
                px-8
                py-4
                text-lg
                font-semibold
                text-white
                hover:bg-cyan-500
              "
            >
              About us
            </Link>

            <button
              className="
                rounded-md
                border-2
                border-cyan-400
                px-8
                py-4
                text-lg
                font-semibold
                text-white
                hover:bg-cyan-400/20
              "
            >
              Watch a video about our mission
            </button>

          </div>
        </div>
      </section>

      <div className="flex flex-col items-center bg-[#f8f8f8] px-8 py-16 text-center">
        <p className="max-w-6xl text-[30px] leading-[1.5] text-[#1d3550]">
          We work in partnership with governments in Africa to improve
          hospital-based care for newborns. Our approach combines lifesaving
          technologies, training for clinicians and biomedical technicians,
          and analysis of locally-owned data to drive investment and policy
          change and advance high-quality newborn care.
        </p>

        <Link
          href="/what-we-do"
          className="
            mt-10
            rounded-md
            bg-[#005078]
            px-7
            py-3
            text-[20px]
            font-semibold
            text-white
            hover:bg-[#003f60]
          "
        >
          What we do
        </Link>

      </div>

    </main>
  );
}