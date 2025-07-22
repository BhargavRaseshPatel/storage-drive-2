"use client"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import { useState } from 'react'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { actionsDropdownItems } from '@/constant'
import { useToast } from '@/hooks/use-toast'
import { deleteFile, renameFile, updateFileUser } from '@/lib/action/file.action'
import { getUserByEmail } from '@/lib/action/user.actions'
import { constructDownloadUrl } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Models } from 'node-appwrite'
import { FileDetail, ShareInput } from './ActionModalContent'
import { Button } from './ui/button'
import { Input } from './ui/input'

const ActionDropdown = ({ file, sharedFile }: { file: Models.Document, sharedFile: boolean }) => {

    const [action, setAction] = useState<ActionType | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isDropDown, setIsDropDown] = useState(false)
    const [fileName, setFileName] = useState(file.name)
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState<string>("")
    const { toast } = useToast()

    const path = usePathname()

    const closeAllModals = () => {
        setIsModalOpen(false)
        setIsDropDown(false)
        setAction(null)
        setFileName(file.name)
        setLoading(false)
        // setEmail([])
    }

    // console.log(file)
    const handleRemoveUser = async (email: string) => {
        const emails = file.users
        const updateEmails = emails.filter((e: string) => e !== email)

        const success = await updateFileUser({
            fileId: file.$id,
            emails: updateEmails,
            path
        })

        if (success) setEmail("")
        closeAllModals()
    }

    const handleAction = async () => {
        if (!action) return;
        setLoading(true)

        let success: void | boolean = false

        const actions = {
            rename: async () => renameFile({ fileId: file.$id, name: fileName, extension: file.extension, path: path }),
            share: async () => {
                const userRegistered = await getUserByEmail(email);
                if (userRegistered) {
                    const emails = file.users;
                    emails.push(email);
                    const updatedFile = await updateFileUser({ fileId: file.$id, emails, path })
                    return updatedFile
                }
                return toast({
                    description: (<p className='body-2 text-white'><span className='font-semibold'>
                        No account found with this email address</span></p>
                    ), className: 'error-toast'
                })
            },
            delete: async () => { deleteFile({ fileId: file.$id, path: path, bucketFileId: file.bucketFileId }) },
        }

        success = await actions[action.value as keyof typeof actions]()
        // console.log(success)

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
                    {value === 'share' && (<ShareInput file={file} onInputChange={setEmail} onRemove={handleRemoveUser} />)}
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
                    {!sharedFile ? <div>{actionsDropdownItems.map((actionItem) => (
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
                        </DropdownMenuItem>)
                    )} </div> :
                        <div>

                            {[
                                {
                                    label: 'Details',
                                    icon: '/assets/icons/info.svg',
                                    value: 'details',
                                },
                                {
                                    label: 'Download',
                                    icon: '/assets/icons/download.svg',
                                    value: 'download',
                                },
                            ].map((actionItem) => (
                                <DropdownMenuItem key={actionItem.value} className='shad-dropdown-item' onClick={() => {
                                    setAction(actionItem);
                                    if (['details'].includes(actionItem.value)) { setIsModalOpen(true) }
                                }}>
                                    {actionItem.value === 'download' ?
                                        (<Link href={constructDownloadUrl(file.bucketFileId)} download={file.name} className='flex items-center gap-2'>
                                            <Image src={actionItem.icon} alt={actionItem.label} width={24} height={24} />{actionItem.label}
                                        </Link>) :
                                        (<div className='flex items-center gap-2'>
                                            <Image src={actionItem.icon} alt={actionItem.label} width={24} height={24} />
                                            {actionItem.label}
                                        </div>)}
                                </DropdownMenuItem>)
                            )}

                        </div>
                    }
                </DropdownMenuContent>
            </DropdownMenu>
            {renderDialogContent()}
        </Dialog>
    )
}

export default ActionDropdown