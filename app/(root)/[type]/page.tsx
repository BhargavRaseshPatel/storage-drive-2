import Card from '@/components/Card'
import Sort from '@/components/Sort'
import { getFiles } from '@/lib/action/file.action'
import { getCurrentUser } from '@/lib/action/user.actions'
import { getFileTypesParams } from '@/lib/utils'
import { Models } from 'node-appwrite'
import React from 'react'

const page = async ({ searchParams, params }: SearchParamProps) => {

    const type = (await params)?.type as string || ""
    const searchText = ((await searchParams)?.query as string) || ""

    const sort = ((await searchParams)?.sort as string) || ""

    const types = getFileTypesParams(type) as FileType[]

    const files = await getFiles({ types, searchText, sort })

    let currentUer = await getCurrentUser()

    return (
        <div className='page-container'>
            <section key="file-heading" className='w-full'>
                <div className='flex justify-between'>
                    <h1 className='h1 capitalize'>{type}</h1>
                    <div className='flex gap-3 bg-white rounded-full items-center px-4 border border-gray-200'>
                        <div className='rounded-full h-5 w-5 bg-red' >
                        </div>
                        <p>Shared files have a red border</p>
                    </div>
                </div>

                <div className='total-size-section'>
                    <p className='body-1'>Total : <span className='h5'>{files.totalSize}</span></p>
                    <div className='sort-container'>
                        <p className='body-1 hidden sm:block text-light-200'> Sort by :</p>
                        <Sort />
                    </div>
                </div>
            </section>

            {/* Render the files  */}

            {files.total > 0 ? (
                <section key="file-section" className='file-list'>
                    {files.documents.map((file: Models.Document) => (
                        <Card accountId={currentUer.accountId} key={file.$id} file={file} />
                    ))}
                </section>
            )
                : (<p>Empty List</p>)}
        </div>
    )
}

export default page