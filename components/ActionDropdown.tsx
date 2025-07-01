"use client"
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from 'next/image'
import { Models } from 'node-appwrite'
import { actionsDropdownItems } from '@/constant'
import Link from 'next/link'
import { constructDownloadUrl } from '@/lib/utils'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { deleteFile, renameFile } from '@/lib/action/file.action'
import { usePathname } from 'next/navigation'
import { FileDetail } from './ActionModalContent'

const ActionDropdown = ({ file }: { file: Models.Document }) => {

    const [action, setAction] = useState<ActionType | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isDropDown, setIsDropDown] = useState(false)
    const [fileName, setFileName] = useState(file.name)
    const [loading, setLoading] = useState(false)

    const path = usePathname()

    const closeAllModals = () => {
        setIsModalOpen(false)
        setIsDropDown(false)
        setAction(null)
        setFileName(file.name)
        setLoading(false)
        // setEmail([])
    }

    const handleAction = async () => {
        if (!action) return;
        setLoading(true)

        let success: void | boolean = false

        const actions = {
            rename: async () => renameFile({ fileId: file.$id, name: fileName, extension: file.extension, path: path }),
            share: async () => { console.log('share'); return true },
            delete: async () => { deleteFile({ fileId: file.$id, path: path, bucketFileId: file.bucketFileId }) },
        }

        success = await actions[action.value as keyof typeof actions]()
        console.log(success)

        if (success) closeAllModals()

    }

    const renderDialogContent = () => {
        if (!action) return null

        const { value, label } = action
        return (
            <DialogContent className='shad-dialog button'>
                <DialogHeader className='flex flex-col gap-3'>
                    <DialogTitle className='text-center text-light-100'>{label}</DialogTitle>
                    {value === 'rename' && <Input type='text' value={fileName} onChange={(e) => setFileName(e.target.value)} />}
                    {value === 'details' && <FileDetail file={file} />}
                    {value === 'delete' && (
                        <p className='delete-confirmation'>
                            Are you sure you want to delete <span className='text-light-100'>{file.name}</span>?
                        </p>
                    )
                    }
                </DialogHeader>
                {['rename', 'share', 'delete'].includes(value) && (
                    <DialogFooter className='flex flex-col gap-3 md:flex-row'>
                        <Button onClick={closeAllModals} className='modal-cancel-button'>Cancel</Button>
                        <Button onClick={handleAction} className='modal-submit-button'>
                            <p className='capitalize'>{value}</p>
                            {loading && (<Image src='/assets/icons/loader.svg' alt='loader' width={24} height={24} className='animate-spin' />)}
                        </Button>
                    </DialogFooter>
                )}
            </DialogContent>
        )
    }
    return (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DropdownMenu>
                <DropdownMenuTrigger className='shad-no-focus'>
                    <Image src="/assets/icons/dots.svg" alt="dots" width={34} height={34} />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel className='max-w-[200px] truncate'>{file.name}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {actionsDropdownItems.map((actionItem) => (
                        <DropdownMenuItem key={actionItem.value} className='shad-dropdown-item' onClick={() => {
                            setAction(actionItem);
                            if (['rename', 'share', 'delete', 'details'].includes(actionItem.value)) { setIsModalOpen(true) }
                        }}>
                            {actionItem.value === 'download' ?
                                (<Link href={constructDownloadUrl(file.bucketFileId)} download={file.name} className='flex items-center gap-2'>
                                    <Image src={actionItem.icon} alt={actionItem.label} width={24} height={24} />{actionItem.label}
                                </Link>) :
                                (<div className='flex items-center gap-2'>
                                    <Image src={actionItem.icon} alt={actionItem.label} width={24} height={24} />
                                    {actionItem.label}
                                </div>)}
                        </DropdownMenuItem>))}
                </DropdownMenuContent>
            </DropdownMenu>
            {renderDialogContent()}
        </Dialog>
    )
}

export default ActionDropdown