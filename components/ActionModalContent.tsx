import React from 'react'
import { Models } from 'node-appwrite'
import Thumbnail from './Thumbnail'
import FormattedDateTime from './FormattedDateTime'
import { convertFileSize, formatDateTime } from '@/lib/utils'
import { Input } from './ui/input'
import { Button } from './ui/button'
import Image from 'next/image'

const ImageThumbnail = ({ file }: { file: Models.Document }) => (
    <div className='file-details-thumbnail'>
        <Thumbnail type={file.type} extension={file.extension} url={file.url} />
        <div className='flex flex-col'>
            <p className='subtitle-2 mb-1'>{file.name}</p>
            <FormattedDateTime date={file.$createdAt} className='caption' />
        </div>
    </div>
)

const DetailRow = ({ label, value }: { label: string, value: string }) => (
    <div className='flex'>
        <p className='file-details-label text-left'>{label}</p>
        <p className='file-details-value text-left'>{value}</p>
    </div>
)



export const FileDetail = ({ file }: { file: Models.Document }) => {
    return (
        <>
            <ImageThumbnail file={file} />
            <DetailRow label='Format:' value={file.extension} />
            <DetailRow label='Size:' value={convertFileSize(file.size)} />
            <DetailRow label='Created:' value={formatDateTime(file.$createdAt)} />
            <DetailRow label='Owner:' value={file.owner.fullName} />
            <DetailRow label='Last Edit:' value={formatDateTime(file.$updatedAt)} />
        </>
    )
}

type Props = {
    file: Models.Document,
    onInputChange: React.Dispatch<React.SetStateAction<string>>,
    onRemove: (email: string) => void
}

export const ShareInput = ({ file, onInputChange, onRemove }: Props) => {
    return (
        <div>
            <ImageThumbnail file={file} />
            <div className="share-wrapper">
                <p className='subtitle-2 pl-1 text-light-100'>
                    Share file with other users
                </p>
                <Input type="email" placeholder="Enter email address"
                    onChange={(e) => onInputChange(e.target.value)} className="share-input-field" />

                <div className="pt-4">
                    <div className="flex justify-between">
                        <p className="subtitle-2 text-light-100">
                            Shared with 
                        </p>
                        <p className="subtitle-2 text-light-100">
                            {file.users.length} users
                        </p>
                    </div>

                    <ul className='pt-2'>
                        {file.users.map((email : string) => (
                            <li key={email} className='flex items-center justify-between gap-2'>
                                <p className='subtitle-2'>{email}</p>
                                <Button onClick={() => onRemove(email)} className='share-remove-user'>
                                    <Image src="/assets/icons/remove.svg" alt="Remove" width={24} height={24} />
                                </Button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}