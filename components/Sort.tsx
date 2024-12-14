"use client"
import React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter } from 'next/router'
import { usePathname } from 'next/navigation'
import { sortTypes } from '@/constant'

const Sort = () => {
  const path = usePathname()
  const router = useRouter()
  const handleSort = (value: string) => {
    router.push(`{path}?sort=${value}`)
  }

  return (
    <Select onValueChange={handleSort} defaultValue={sortTypes[0].value}>
      <SelectTrigger className="sort-select">
        <SelectValue placeholder={sortTypes[0].value} />
      </SelectTrigger >
      <SelectContent className='sort-select-content'>
        {/* <SelectItem value="light">Light</SelectItem>
        <SelectItem value="dark">Dark</SelectItem>
        <SelectItem value="system">System</SelectItem> */}
        {sortTypes.map((sort) => (
          <SelectItem className='shad-select-item' key={sort.value} value={sort.value}>{sort.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>

  )
}

export default Sort