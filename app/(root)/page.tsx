"use client"
import { dashboardFiles } from "@/constant";
import { getSizeOfAllDocuments } from "@/lib/action/file.action";
import { calculatePercentage, convertFileSize } from "@/lib/utils";
import Image from "next/image";
import { PieChart } from '@mui/x-charts/PieChart';
import { useEffect, useState } from "react";

export default function Home() {

  type SpaceProps = {
    spaceAvailable: number,
    spaceUsed: number
  }

  const [space, setSpace] = useState<SpaceProps>({
    spaceAvailable: 0,
    spaceUsed: 0
  })

  type StorageInformationProps = {
    documents: {
      size: number,
      totalItems: number
    },
    images: {
      size: number,
      totalItems: number
    },
    media: {
      size: number,
      totalItems: number
    },
    others: {
      size: number,
      totalItems: number
    },
    totalSize: number
  }

  const [storageInformation, setStorageInformation] = useState<StorageInformationProps>({
    documents: {
      size: 0,
      totalItems: 0
    },
    images: {
      size: 0,
      totalItems: 0
    },
    media: {
      size: 0,
      totalItems: 0
    },
    others: {
      size: 0,
      totalItems: 0
    },
    totalSize: 0
  })

  useEffect(() => {

    const fetchData = async () => {
      const sizeAlltheFile: any = await getSizeOfAllDocuments()
      setSpace({
        spaceUsed: calculatePercentage(sizeAlltheFile.totalSize),
        spaceAvailable: 100 - calculatePercentage(sizeAlltheFile.totalSize)
      })
      setStorageInformation(sizeAlltheFile)
    }
    fetchData()
  }, [])

  return (
    <div className="h-full">

      <div className="grid xl:grid-cols-4 sm:grid-cols-2 gap-4 p-8 bg-amber-100">
        <div className="col-span-2 h-60 bg-white rounded-xl pt-4">
          <PieChart
            width={250}
            height={250}
            series={[
              {
                data: [
                  { id: 1, value: calculatePercentage(storageInformation?.documents?.size), label: 'Document' },
                  { id: 2, value: calculatePercentage(storageInformation?.images?.size), label: 'Images' },
                  { id: 3, value: calculatePercentage(storageInformation?.media?.size), label: 'Media' },
                  { id: 4, value: calculatePercentage(storageInformation?.others?.size), label: 'Others' },
                ],
                innerRadius: 25,
                outerRadius: 100,
                paddingAngle: 2,
                cornerRadius: 5,
                startAngle: -90,
                endAngle: 270,
                cx: 125,
                cy: 100,
              }
            ]}
          />
        </div>
        <div className="col-span-2 h-60 bg-white rounded-xl pt-4">
          <PieChart
            width={250}
            height={250}
            series={[
              {
                data: [
                  { id: 2, value: space.spaceUsed, label: 'Space Used' },
                  { id: 1, value: space.spaceAvailable, label: 'Space Available' },
                ],
                innerRadius: 25,
                outerRadius: 100,
                paddingAngle: 2,
                cornerRadius: 5,
                startAngle: -90,
                endAngle: 270,
                cx: 125,
                cy: 100,
              }
            ]}
          />
        </div>

        {dashboardFiles.map(({ url, name, type }: { url: string; name: string; type: string }) => {
          type FileCategory = Exclude<keyof StorageInformationProps, "totalSize">;
          const fileData = storageInformation[type as FileCategory];

          return (
            <div className="relative" key={url}>
              <Image
                alt="image"
                src={url}
                height={200}
                width={200}
                className="mx-auto object-cover w-[200px] h-[200px]"
              />
              <div className="absolute text-center w-full left-2 top-20">
                <p className=" text-lg">{name}</p>
                <Image
                  src={"/assets/icons/line.svg"}
                  alt="line"
                  width={100}
                  height={5}
                  className="mx-auto mt-2"
                />

                {fileData ? (
                  <>
                    <p className="mt-4">
                      Total items : <span className="h5">{fileData.totalItems}</span>
                    </p>
                    <p className="mt-2">
                      Total size : <span className="h5">{convertFileSize(fileData.size)}</span>
                    </p>
                  </>
                ) : (
                  <p className="mt-4 text-gray-400">Loading...</p>
                )}
              </div>
            </div>
          );
        })}


      </div>
    </div>
  );
}
