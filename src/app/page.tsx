import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-blue-200 text-lg">
      <nav className="w-full flex items-center justify-between px-8 py-2 bg-gray-100 shadow-sm">
        <div className="flex items-center space-x-3">
          {/* Logos */}
          <Image
            src="/pnw-logo.png"
            alt="PNW Lion"
            width={80}
            height={40}
            className="object-contain"
          />
          <Image
            src="/pnw-lion.png"
            alt="PNW Logo"
            width={40}
            height={40}
            className="object-contain"
          />
          <div className="font-bold text-blue-600 text-lg ml-2">Campus Parking</div>
        </div>

        <div className="flex space-x-6">
          <Link href="/" className="hover:text-blue-500 text-gray-700">Home</Link>
          <Link href="/aboutUs" className="hover:text-blue-500 text-gray-700">About Us</Link>
          <Link href="/contact" className="hover:text-blue-500 text-gray-700">Contact</Link>
        </div>
      </nav>
    
    <h1 className="text-blue-500 text-6xl p-8 font-bold flex justify-center">About Us</h1>
    <div className="grid grid-cols-2 gap-5">


    <section className="grid-cols-subgrid ml-5 flex justify-center items-center">
      <div>
        <Image
          src="/campus.jpg"
          alt="Campus Parking"
          width={500}
          height={300}
          className="rounded-lg"
        />
      </div>
    </section>


      <section className="p-5 grid-cols-subgrid">
    <p>
      Welcome to our project!
    </p>
    
      <h2 className="my-2">Parking on campus</h2>
      <p className="my-2">
        How often are you late to class and can't find parking?<br/>
        Our project aims to solve this.<br/>
        By letting you know where you can find a parking spot.<br/>
        This will save you time instead of going around and around looking for a spot.<br/>
      </p>
      <h2 className="mt-6">Meet the Team</h2>
      <ul className="my-2 grid-cols-3">
        <li>Jih bin Luo</li>
        <li>Aaron Jung</li>
        <li>Justin Meng</li>
        <li>Isabella Sosa</li>
      </ul>

      <Image
        src="/mini.jpg"
        alt="Campus Parking"
        width={500}
        height={300}
        className="rounded-lg mt-4"
      />

    </section>

    </div>
  </main>
  );
}
