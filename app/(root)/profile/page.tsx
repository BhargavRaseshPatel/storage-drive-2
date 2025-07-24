// app/profile/page.tsx

import { getCurrentUser } from "@/lib/action/user.actions";
import { getTotalSizeUsed } from "@/lib/action/file.action";
import Image from "next/image";

const ProfilePage = async () => {
  const user = await getCurrentUser();

  if (!user) {
    return <div className="text-red-500 text-center">User not found. Please sign in.</div>;
  }

  const { percentageUsed } = await getTotalSizeUsed();

  return (
    <div className="page-container space-y-6">
      <div className="flex justify-between">
        <h1 className="h1 capitalize">Profile Information</h1>
      </div>

      <div className="flex flex-col items-center space-y-4">
        <Image src={user.avatar} alt="user profile" width={250} height={250} className="rounded-full" />
        <p className="text-xl">Name: <span className="font-semibold">{user.fullName}</span></p>
        <p className="text-xl">Email: <span className="font-semibold">{user.email}</span></p>
      </div>

      {/* Storage Usage Progress Bar */}
      <div className="w-full">
        <div className="relative h-6 w-full bg-[#ffe3e4] rounded-full overflow-hidden">
          <div
            style={{ width: `${percentageUsed}%` }}
            className="absolute left-0 top-0 h-full bg-[#fa7275] rounded-full transition-all duration-500"
          />
        </div>

        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#fa7275]" />
            <span className="text-sm font-medium text-gray-700">Storage Used ({percentageUsed}%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#ffe3e4]" />
            <span className="text-sm font-medium text-gray-700">
              Storage Left ({100 - percentageUsed}%)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
