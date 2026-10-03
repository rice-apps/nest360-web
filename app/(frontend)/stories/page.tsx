import Image from "next/image";
import Link from "next/link";

const cards = [
    { picture: "/placeholder.jpg", title: "Example One", date: "01-01-0001", sections: "a, b, c", desc: "Description here" },
    { picture: "/placeholder1.jpg", title: "Example One", date: "01-01-0001", sections: "a, b, c", desc: "Description here" },

    { picture: "/placeholder2.jpg", title: "Example One", date: "01-01-0001", sections: "a, b, c", desc: "Description here" },

    { picture: "/placeholder3.jpg", title: "Example One", date: "01-01-0001", sections: "a, b, c", desc: "Description here" },

];



export default function Home() {
  return (
    <div>
        <div className="relative h-64 w-full">
        
            <Image
            src="/story_banner.jpg"
            alt="Banner"
            fill
            className="object-cover"
            priority
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center xl:pr-200 text-white">
                <h1 className="text-4xl font-bold">Stories and News</h1>
                <p className="mt-2 text-lg">Add stuff to here as needed</p>
            </div>
        </div>
        
        <div className="flex max-w-2xl mx-auto mt-6 shadow-sm rounded-md overflow-hidden border border-gray-200 mb-10">
            <input
              type="text"
              placeholder="Search..."
              className="flex-1 px-4 py-3 outline-none text-gray-700 placeholder-gray-400 text-sm"
            />
            <button className="bg-[#41B6C4] text-white px-8 font-medium hover:bg-[#3298a4] transition-colors text-sm">
              Search
            </button>
        </div>

        <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto mb-10">
            <button className="px-4 py-1.5 rounded-full text-sm font-medium bg-[#41B6C4] text-white">
                All
            </button>
            <button className="px-4 py-1.5 rounded-full text-sm font-medium border border-gray-300 text-gray-700 hover:border-[#41B6C4] hover:text-[#41B6C4] transition-colors">
                Section A
            </button>
            <button className="px-4 py-1.5 rounded-full text-sm font-medium border border-gray-300 text-gray-700 hover:border-[#41B6C4] hover:text-[#41B6C4] transition-colors">
                Section B
            </button>
            <button className="px-4 py-1.5 rounded-full text-sm font-medium border border-gray-300 text-gray-700 hover:border-[#41B6C4] hover:text-[#41B6C4] transition-colors">
                Section C
            </button>
        </div>

        <div className="inset-0 flex flex-col text-center text-black">
            <h1 className="text-4xl font-bold">Stories, News, and More!</h1>
            <p className="mt-2 text-lg">Read the latest stories, and news from the NEST360 Alliance of experts who advance quality newborn care </p>
            <p className="mt-2 text-lg">through innovation, policy, and education.</p>
        </div>
        


        <div className="px-4 lg:px-50">
            <div className="grid grid-cols-1 gap-6 py-8 sm:grid-cols-2 sm:p-8 lg:grid-cols-3">
                {cards.map((card) => (
                <div
                    key={card.picture}
                    className="overflow-hidden bg-white shadow dark:bg-zinc-900 h-100"
                >
                    <div className="relative h-40 w-full">
                    <Image
                        src={card.picture}
                        alt={card.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                    />
                    </div>

                    <div className="p-4">
                    <h2 className="text-xl font-semibold">{card.title}</h2>
                    <p className="mt-2 text-zinc-600 dark:text-zinc-400">{card.date}</p>
                    <p className="mt-2 text-zinc-600 dark:text-zinc-400">{card.desc}</p>
                    <Link href="/resources">READ MORE (go to resources for now)</Link>
                    </div>
                </div>
                ))}
            </div>
        </div>
    </div>
  );
}