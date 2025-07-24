import { getTotalSizeUsed } from '@/lib/action/file.action';
import { getCurrentUser } from '@/lib/action/user.actions';
import Image from 'next/image';

const ProfilePage = async () => {
  const user = await getCurrentUser();
  const { percentageUsed } = await getTotalSizeUsed();

  return (
    <div className="page-container">
      {/* User info */}
      <Image src={user.avatar} alt='user profile' width={250} height={250} />
      <p>Name: <strong>{user.fullName}</strong></p>
      <p>Email: <strong>{user.email}</strong></p>

      {/* Progress bar */}
      <div className="w-full mt-6">
        <div className="relative h-6 w-full bg-[#ffe3e4] rounded-full overflow-hidden">
          <div
            style={{ width: `${percentageUsed}%` }}
            className="absolute left-0 top-0 h-full bg-[#fa7275] rounded-full transition-all duration-500"
          />
        </div>

        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#fa7275]" />
            <span className="text-sm font-medium text-gray-700">
              Storage Used ({percentageUsed}%)
            </span>
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

export default ProfilePage