import { dashboardFiles } from "@/constant";
import { getSizeOfAllDocuments } from "@/lib/action/file.action";
import { convertFileSize } from "@/lib/utils";
import Image from "next/image";

export default async function Home() {

  const sizeAlltheFile: any = await getSizeOfAllDocuments()

  return (
    <div className="grid xl:grid-cols-4 sm:grid-cols-2 gap-4 p-8 items-center bg-amber-100">

      {dashboardFiles.map(({ url, name, type }) => (
        <div className="relative" key={url}>
          <Image alt="image" src={url} height={200} width={200} className="mx-auto object-cover w-[200px] h-[200px]" />
          <div className="absolute text-center w-full left-2 top-20">
            <p className=" text-lg">{name}</p>
            <Image src={'/assets/icons/line.svg'} alt="line" width={100} height={5} className="mx-auto mt-2" />
            <p className="mt-4">Total items : <span className='h5'>{sizeAlltheFile[type].totalItems}</span></p>
            <p className="mt-2">Total size : <span className='h5'>{convertFileSize(sizeAlltheFile[type].size)}</span></p>
          </div>
        </div>
      ))}
    </div>
  );
}
