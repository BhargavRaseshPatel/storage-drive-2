"use client"
import { MAX_FILE_SIZE, MAXIMUM_TOTAL_STORAGE } from '@/constant'
import { useToast } from '@/hooks/use-toast'
import { getSizeOfAllDocuments, uploadFile } from '@/lib/action/file.action'
import { cn, convertFileToUrl, getFileType } from '@/lib/utils'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { MouseEvent, useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import Thumbnail from './Thumbnail'
import { Button } from './ui/button'

interface Props {
  ownerId: string
  accountId: string
  className?: string
}

const FileUploader = ({ ownerId, accountId, className }: Props) => {
  const [file, setFile] = useState<File[]>([])
  const { toast } = useToast()
  const path = usePathname()

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    // Do something with the files

    setFile(acceptedFiles);
    const uploadPromises = acceptedFiles.map(async (file) => {
      if (file.size > MAX_FILE_SIZE) {
        setFile((prevFiles) => prevFiles.filter((f: File) => f.name !== file.name))

        return toast({
          description: (<p className='body-2 text-white'><span className='font-semibold'>{file.name}</span> is too large.
            Max file size is 15MB.</p>
          ), className: 'error-toast'
        });
      }

      const totalStorage = await getSizeOfAllDocuments()

      if ((totalStorage?.totalSize ?? 0) + file.size > MAXIMUM_TOTAL_STORAGE) {
        setFile((prevFiles) => prevFiles.filter((f: File) => f.name !== file.name))

        return toast({
          description: (<p className='body-2 text-white'>Adding <span className='font-semibold'>{file.name}</span>
            result in exceeding your storage capacity.</p>
          ), className: 'error-toast'
        });
      }

      return uploadFile({ file, ownerId, accountId, path }).then((uploadFile) => {
        if (uploadFile) {
            setFile((prevFiles) => prevFiles.filter((f: File) => f.name !== file.name))
        }
      });
    });

    await Promise.all(uploadPromises);
  }, [ownerId, accountId, path]);

  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  const handleRemoveFile = (e: MouseEvent<HTMLImageElement>, fileName: string) => {
    e.stopPropagation()
    const updatedFiles = file.filter((file) => file.name !== fileName)
    setFile(updatedFiles)
  }

  return (
    <div {...getRootProps()} className='cursor-pointer'>
      <input {...getInputProps()} />
      <Button type='button' className={cn('uploader-button', className)}>
        <Image src='/assets/icons/upload.svg' alt='logo' width={24} height={24} /><p>Upload</p>
      </Button>

      {file.length > 0 && <ul className='uploader-preview-list'>
        <h4 className='h4 text-light-100'>Uploading</h4>

        {file.map((file, index) => {
          const { type, extension } = getFileType(file.name)

          return (
            <li key={`${file.name}-${index}`} className='uploader-preview-item'>
              <div className='flex items-center gap-3'>
                <Thumbnail type={type} extension={extension} url={convertFileToUrl(file)} />

                <div className='preview-item-name'>
                  {file.name}
                  <Image src="/assets/icons/file-loader.gif" width={80} height={26} alt='Loader' />
                </div>
              </div>
              <Image src='/assets/icons/remove.svg' width={24} height={24} alt='Remove' onClick={(e) => handleRemoveFile(e, file.name)} />
            </li>
          )
        })}
      </ul>}
      {/* {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag 'n' drop some files here, or click to select files</p>
      }
      */}


    </div>
  )
}

export default FileUploader