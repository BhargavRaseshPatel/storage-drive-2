import { dashboardFiles, MAXIMUM_TOTAL_STORAGE } from "@/constant";
import { getSizeOfAllDocuments } from "@/lib/action/file.action";
import { calculatePercentage, convertFileSize } from "@/lib/utils";
import Image from "next/image";
import { PieChart } from "@mui/x-charts/PieChart";

export const dynamic = "force-dynamic"; // optional if you want to disable caching

type FileCategory = "documents" | "images" | "media" | "others";

export default async function Home() {
  const storageInformation = await getSizeOfAllDocuments();

  const spaceUsed = calculatePercentage(storageInformation.totalSize);
  const spaceAvailable = 100 - spaceUsed;

  return (
    <div className="h-full">
      <div className="grid xl:grid-cols-4 sm:grid-cols-2 gap-4 p-8 bg-amber-100">
        {/* File Types Pie Chart */}
        <div className="col-span-2 h-60 bg-white rounded-xl pt-4">
          <PieChart
            width={250}
            height={250}
            series={[
              {
                data: [
                  { id: 1, value: calculatePercentage(storageInformation.documents.size), label: "Document" },
                  { id: 2, value: calculatePercentage(storageInformation.images.size), label: "Images" },
                  { id: 3, value: calculatePercentage(storageInformation.media.size), label: "Media" },
                  { id: 4, value: calculatePercentage(storageInformation.others.size), label: "Others" },
                ],
                innerRadius: 25,
                outerRadius: 100,
                paddingAngle: 2,
                cornerRadius: 5,
                startAngle: -90,
                endAngle: 270,
                cx: 125,
                cy: 100,
              },
            ]}
          />
        </div>

        {/* Space Usage Pie Chart */}
        <div className="col-span-2 h-60 bg-white rounded-xl pt-4">
          <PieChart
            width={250}
            height={250}
            series={[
              {
          data: [
            { 
              id: 1, 
              value: spaceUsed, 
              label: `Space Used (${convertFileSize(storageInformation.totalSize)})` 
            },
            { 
              id: 2, 
              value: spaceAvailable,
              label: `Space Avail. (${convertFileSize(MAXIMUM_TOTAL_STORAGE - storageInformation.totalSize)})` 
            },
          ],
          innerRadius: 25,
          outerRadius: 100,
          paddingAngle: 2,
          cornerRadius: 5,
          startAngle: -90,
          endAngle: 270,
          cx: 125,
          cy: 100,
              },
            ]}
          />
        </div>

        {/* File Type Cards */}
        {dashboardFiles.map(({ url, name, type }: { url: string; name: string; type: string }) => {
          const category = type as FileCategory;
          const fileData = storageInformation[category];

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
                <p className="text-lg">{name}</p>
                <Image
                  src={"/assets/icons/line.svg"}
                  alt="line"
                  width={100}
                  height={5}
                  className="mx-auto mt-2"
                />
                <p className="mt-4">Total items: <span className="h5">{fileData.totalItems}</span></p>
                <p className="mt-2">Total size: <span className="h5">{convertFileSize(fileData.size)}</span></p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
