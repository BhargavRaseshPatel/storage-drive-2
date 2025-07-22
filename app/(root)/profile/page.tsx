import { getTotalSizeUsed } from '@/lib/action/file.action'
import { getCurrentUser } from '@/lib/action/user.actions'
import { calculatePercentage } from '@/lib/utils'
import Image from 'next/image'

const ProfilePage = async () => {
    const user = await getCurrentUser()
    const totalSize = calculatePercentage(await getTotalSizeUsed() as number) + "%"
    
    return (
        <div className="page-container">
            <div className='flex justify-between'>
                <h1 className='h1 capitalize'>Profile Information</h1>
            </div>
            <Image src={user.avatar} alt='user profile' width={250} height={250} />
            <div className="flex-1 space-y-4">
                <p className="text-center text-xl">Name : <span className='text-xl font-semibold'>{user.fullName}</span></p>
                <p className="text-center text-xl">Email ID : <span className='text-xl font-semibold'>{user.email}</span></p>
            </div>

            {/* Storage Usage Bar */}
            <div className="w-full mt-6">
                <div className="relative h-6 w-full bg-[#ffe3e4] rounded-full overflow-hidden">
                    <div
                        style={{ width: totalSize }}
                        className="absolute left-0 top-0 h-full bg-[#fa7275] rounded-full transition-all duration-500"
                    />
                </div>

                {/* Labels & Legend */}
                <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-[#fa7275]" />
                        <span className="text-sm font-medium text-gray-700">Storage Used ({totalSize})</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-[#ffe3e4]" />
                        <span className="text-sm font-medium text-gray-700">
                            Storage Left ({`${100 - parseFloat(totalSize)}%`})
                        </span>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default ProfilePage