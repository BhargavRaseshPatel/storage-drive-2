"use server"
import { InputFile } from "node-appwrite/file"
import { createAdminClient } from "../appwrite"
import { appWriteConfig } from "../appwrite/config"
import { ID } from "node-appwrite"
import { constructFileUrl, getFileType, parseStringify } from "../utils"
import { revalidatePath } from "next/cache"

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
            user: [],
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