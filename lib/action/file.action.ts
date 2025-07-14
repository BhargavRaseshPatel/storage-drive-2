"use server"
import { InputFile } from "node-appwrite/file"
import { createAdminClient, createSessionClient } from "../appwrite"
import { appWriteConfig } from "../appwrite/config"
import { ID, Models, Query } from "node-appwrite"
import { constructFileUrl, convertFileSize, getFileType, parseStringify } from "../utils"
import { revalidatePath } from "next/cache"
import { getCurrentUser } from "./user.actions"

const handleError = (error: unknown, message: string) => {
    console.error(error, message)
    throw error
}

export const uploadFile = async ({ file, ownerId, accountId, path }: UploadFileProps) => {
    const { storage, database } = await createAdminClient()

    try {
        const inputFile = InputFile.fromBuffer(file, file.name)
        const bucketFile = await storage.createFile(appWriteConfig.bucketId, ID.unique(), inputFile)

        const fileDocument = {
            type: getFileType(bucketFile.name).type,
            name: bucketFile.name,
            url: constructFileUrl(bucketFile.$id),
            extension: getFileType(bucketFile.name).extension,
            size: bucketFile.sizeOriginal,
            owner: ownerId,
            accountId,
            users: [],
            bucketFileId: bucketFile.$id
        }

        const newFile = await database.createDocument(appWriteConfig.databaseId, appWriteConfig.fileCollectionId, ID.unique(), fileDocument)
            .catch(async (error: unknown) => {
                await storage.deleteFile(appWriteConfig.bucketId, bucketFile.$id)
                handleError(error, 'Failed to create file document')
            })

        revalidatePath(path)
        return parseStringify(newFile)

    } catch (error) {
        handleError(error, 'Failed to upload file')
    }

}

const createQueries = (currentUser: Models.Document, types: string[], searchText: string, sort: string, limit?: number) => {
    const queries = []
    if (types.includes("shared")) {
        queries.push(Query.contains('users', [currentUser.email]))
    } else {
        queries.push(Query.equal('owner', [currentUser.$id]))
        if (types.length > 0) queries.push(Query.equal('type', types))
    }
    // const queries = [Query.or([),]]

    if (searchText) queries.push(Query.contains('name', searchText))
    if (limit) queries.push(Query.limit(limit))

    if (sort) {
        const [sortBy, orderBy] = sort.split('-')
        queries.push(orderBy === 'asc' ? Query.orderAsc(sortBy) : Query.orderDesc(sortBy))
    }
    return queries
}

export const getFiles = async ({ types = [], searchText = '', sort = '$createdAt-desc', limit }: GetFilesProps) => {
    const { database } = await createAdminClient()

    try {
        const currentUser = await getCurrentUser()

        if (!currentUser) throw new Error('User not found')

        const queries = createQueries(currentUser, types, searchText, sort, limit)

        const files = await database.listDocuments(
            appWriteConfig.databaseId,
            appWriteConfig.fileCollectionId,
            queries
        )
        let size = 0;

        (files.documents.forEach((element) => size += element.size))
        const totalSize = convertFileSize(size)

        return parseStringify({ ...files, totalSize })

    } catch (error) {
        handleError(error, 'Failed to get files')
    }
}

export const renameFile = async ({ fileId, name, extension, path }: RenameFileProps) => {
    const { database } = await createAdminClient()

    try {
        const newName = `${name}.${extension}`
        const updatedFile = await database.updateDocument(appWriteConfig.databaseId, appWriteConfig.fileCollectionId, fileId, { name: newName })

        revalidatePath(path)
        return parseStringify(updatedFile)

    } catch (error) {
        handleError(error, 'Failed to rename file')
    }
}

export const deleteFile = async ({ fileId, bucketFileId, path }: DeleteFileProps) => {
    const { database, storage } = await createAdminClient()

    try {
        const deletedFile = await database.deleteDocument(appWriteConfig.databaseId, appWriteConfig.fileCollectionId, fileId)

        if (deletedFile) await storage.deleteFile(appWriteConfig.bucketId, bucketFileId)

        revalidatePath(path)

        return parseStringify(deletedFile)
    } catch (error) {
        handleError(error, 'Failed to delete file')
    }
}

export const updateFileUser = async ({ fileId, emails, path }: UpdateFileUsersProps) => {
    const { database } = await createAdminClient()

    try {
        const updatedEmailsInFile = await database.updateDocument(
            appWriteConfig.databaseId, appWriteConfig.fileCollectionId, fileId, {
            users: emails
        }
        )
        revalidatePath(path)
        return parseStringify(updatedEmailsInFile)
    } catch (error) {
        handleError(error, "Failed to update the adding new user email")
    }
}

export const getSizeOfAllDocuments = async () => {
    const { database, account } = await createSessionClient()

    try {
        const result = await account.get()

        const files = await database.listDocuments(appWriteConfig.databaseId, appWriteConfig.fileCollectionId, [Query.equal('accountId', [result.$id])])

        const allDocumentsSize: DocumentsSizeProps = {
            documents: {
                size: 0,
                totalItems: 0
            },
            images: {
                size: 0,
                totalItems: 0
            },
            media: {
                size: 0,
                totalItems: 0
            },
            others: {
                size: 0,
                totalItems: 0
            },
            totalSize: 0
        }

        // console.log(files)

        return files.documents.reduce((accumulator, currentValue) => {
            if (currentValue.type == 'document') {
                accumulator['documents'].size += currentValue.size
                accumulator['documents'].totalItems += 1;
            } else if (['video', 'audio'].includes(currentValue.type)) {
                accumulator.media.totalItems += 1
                accumulator.media.size += currentValue.size
            } else if (currentValue.type == 'image') {
                accumulator.images.totalItems += 1;
                accumulator.images.size += currentValue.size
            } else {
                accumulator.others.size += currentValue.size
                accumulator.others.totalItems += 1
            }
            accumulator.totalSize += currentValue.size
            return accumulator
        }, allDocumentsSize)
    } catch (error) {
        console.log("Error while fetching the data", error)
    }
}