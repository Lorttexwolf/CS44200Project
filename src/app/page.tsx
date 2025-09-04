import Image from "next/image";
import HorizontalWrap from "./components/HorizontalWrap";

export default function Home() {
  return (
    <div className="text-lg py-10">

      <HorizontalWrap>

        <h1 className="text-blue-500 text-6xl font-bold flex justify-center">PNW parking</h1>

        <br/> {/* Maybe change for flex box separation? */}

        <div className="grid grid-cols-2 gap-5">

          <section className="grid-cols-subgrid flex justify-center items-center">
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
              How often are you late to class and can't find parking?<br />
              Our project aims to solve this.<br />
              By letting you know where you can find a parking spot.<br />
              This will save you time instead of going around and around looking for a spot.<br />
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

      </HorizontalWrap>

    </div>
  );
}
