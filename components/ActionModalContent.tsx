import React from 'react'
import { Models } from 'node-appwrite'
import Thumbnail from './Thumbnail'
import FormattedDateTime from './FormattedDateTime'
import { formatDateTime } from '@/lib/utils'

const ImageThumbnail = ({file} : {file: Models.Document}) => (
    <div className='file-details-thumbnail'>
        <Thumbnail type={file.type} extension={file.extension} url={file.url}/>
        <div className='flex flex-col'>
            <p className='subtitle-2 mb-1'>{file.name}</p>
            <FormattedDateTime date={file.$createdAt} className='caption'/>
        </div>
    </div>
)

const DetailRow = ({label, value} : {label : string, value : string}) => (
    <div className='flex'>
        <p className='file-details-label text-left'>{label}</p>
        <p className='file-details-value text-left'>{value}</p>
    </div>
)



export const FileDetail = ({file} : {file: Models.Document}) => {
  return (
    <>
    <ImageThumbnail file={file}/>
    <DetailRow label='Format:' value={file.extension}/>
    <DetailRow label='Size:' value={file.size}/>
    <DetailRow label='Created:' value={file.$createdAt}/>
    <DetailRow label='Owner:' value={file.owner.fullName}/>
    <DetailRow label='Last Edit:' value={formatDateTime(file.$updatedAt)}/>
    </>
  )
}