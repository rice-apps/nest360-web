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
            <div className="absolute inset-0 flex flex-col items-center justify-center pr-200 text-center text-white">
                <h1 className="text-4xl font-bold">Stories and News</h1>
                <p className="mt-2 text-lg">Add stuff to here as needed</p>
            </div>
        </div>
        
        <div className="inset-0 flex flex-col text-center text-black">
            <h1 className="text-4xl font-bold">Stories, News, and More!</h1>
            <p className="mt-2 text-lg">Read the latest stories, and news from the NEST360 Alliance of experts who advance quality newborn care </p>
            <p className="mt-2 text-lg">through innovation, policy, and education.</p>
        </div>
        
        <div className="px-50">
            <div className="grid grid-cols-3 gap-6 p-8">
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