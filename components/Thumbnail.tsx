import { cn, getFileIcon } from '@/lib/utils'
import Image from 'next/image'
import React from 'react'

interface Props {
    type: string
    extension: string
    url?: string
    imageClassName?: string
    className?: string
}

const Thumbnail = ({ type, extension, url = '', imageClassName, className }: Props) => {
    const isImage = type === 'image' && extension !== 'svg'
    return (
        <figure className={cn('thumbnail', className)}>
            <Image src={isImage? url : getFileIcon(extension, type)} alt='thumbnail' 
            width={120} height={120} className={cn('size-8 object-contain', imageClassName, isImage && 'thumbnail-image')} />
        </figure>
    )
}

export default Thumbnail