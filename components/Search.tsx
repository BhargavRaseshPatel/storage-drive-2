"use client"
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { getFiles } from '@/lib/action/file.action'
import { Models } from 'node-appwrite'
import { useDebounce } from 'use-debounce'
import Thumbnail from './Thumbnail'
import FormattedDateTime from './FormattedDateTime'

const Search = () => {
  const [query, setQuery] = useState('')
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get('query') || ''
  const [results, setResults] = useState<Models.Document[]>([])
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const path = usePathname()
  const [debounceQuery] = useDebounce(query, 1000)

  useEffect(() => {
    if (!searchQuery) {
      setQuery("")
    }
  }, [searchQuery])

  useEffect(() => {
    const fetchFile = async () => {

      if (debounceQuery.length === 0) {
        setResults([])
        setOpen(false)
        return router.push(path.replace(searchParams.toString(), ''))
      }

      const files = await getFiles({ types: [], searchText: query })

      setResults(files.documents)
      setOpen(true)
    }
    fetchFile()
  }, [debounceQuery])

  const handleClickItem = (file: Models.Document) => {
    setOpen(false)
    setResults([])
    router.push(`/${file.type === 'video' || file.type === 'audio' ? 'media' : file.type + 's'}?query=${query}`)
  }

  return (
    <div className='search'>
      <div className='search-input-wrapper'>
        <Image src="/assets/icons/search.svg" alt="search" width={24} height={24} />
        <Input value={query} placeholder='Search ... ' className='search-input' onChange={(e) => setQuery(e.target.value)} />
        {open && <ul className='search-result'>{results.length > 0 ? results.map((file) =>
          (<li className='flex items-center justify-between' onClick={() => handleClickItem(file)} key={file.$id}>
            <div className='flex cursor-pointer items-center gap-4'>
              <Thumbnail type={file.type} extension={file.extension} url={file.url} className='size-9 min-w-9'/>
              <p className='subtitle-2 line-clamp-1 text-light-100'>{file.name}</p>
            </div>
            <FormattedDateTime date={file.$createdAt} className='caption line-clamp-1 text-light-200' />
          </li>))
          : <p className='empty-result'>No files found</p>}
        </ul>}
      </div>
    </div>
  )
}

export default Search