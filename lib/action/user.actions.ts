"use server"

import { ID, Query } from "node-appwrite"
import { createAdminClient, createSessionClient } from "../appwrite"
import { appWriteConfig } from "../appwrite/config"
import { parseStringify } from "../utils"
import { cookies } from "next/headers"
import { avatarPlaceholderUrl } from "@/constant"

const handleError = (error: unknown) => {
    console.error(error)
    throw error
}

export const sendEmailOTP = async ({ email }: { email: string }) => {
    const { account } = await createAdminClient()

    try {
        const session = await account.createEmailToken(ID.unique(), email)
        return session.userId
    } catch (error) {
        handleError('Failed to send email OTP')
    }
}

const getUserByEmail = async (email: string) => {
    const { database } = await createAdminClient()

    const result = await database.listDocuments(appWriteConfig.databaseId, appWriteConfig.userCollectionId, [Query.equal('email', [email])],)

    return result.total > 0 ? result.documents[0] : null
}

export const createAccount = async ({ fullName, email }: { fullName: string, email: string }) => {
    const existingUser = await getUserByEmail(email)
    const accountId = await sendEmailOTP({ email })

    if (!accountId) throw new Error("Failed to send an OTP")

    if (!existingUser) {
        const { database } = await createAdminClient()

        await database.createDocument(
            appWriteConfig.databaseId,
            appWriteConfig.userCollectionId,
            ID.unique(),
            {
                fullName, email, avatar: avatarPlaceholderUrl, accountId
            }
        )
    }

    return parseStringify({ accountId })
}

export const verifySecret = async ({ accountId, password }: { accountId: string, password: string }) => {
    try {
        const { account } = await createAdminClient();

        const session = await account.createSession(accountId, password);

        (await cookies()).set('appwrite-session', session.secret, {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            secure: true,
        })

        return parseStringify({ sessionId: session.$id })
    } catch (error) {
        handleError('Failed to verify OTP')
    }
}

export const getCurrentUser = async () => {
    const { database , account } = await createSessionClient()

    const result = await account.get()

    const user = await database.listDocuments(appWriteConfig.databaseId, appWriteConfig.userCollectionId, [Query.equal('accountId', [result.$id])])

    if (user.total === 0) return null

    return parseStringify(user.documents[0])
}