import { dashboardFiles } from "@/constant";
import Image from "next/image";

export default function Home() {

  return (
    <div className="grid xl:grid-cols-4 sm:grid-cols-2 gap-4 p-8 items-center bg-amber-100">

      {dashboardFiles.map(({ url, type }) => (
        <div className="relative" key={url}>
          <Image alt="image" src={url} height={200} width={200} className="mx-auto object-cover w-[200px] h-[200px]"/>
          <div className="absolute text-center w-full left-2 top-20">
            <p className=" text-lg">{type}</p>
            <Image src={'/assets/icons/line.svg'} alt="line" width={100} height={5} className="mx-auto mt-2"/>
            <p className="mt-4">Total size : </p>
            <p className="mt-2">Total items : </p>
          </div>
        </div>
      ))}
    </div>
  );
}
