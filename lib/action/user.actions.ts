"use server"

import { avatarPlaceholderUrl } from "@/constant"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { ID, Query } from "node-appwrite"
import { createAdminClient, createSessionClient } from "../appwrite"
import { appWriteConfig } from "../appwrite/config"
import { parseStringify } from "../utils"

const handleError = (error: unknown, message: string) => {
    console.error(error, message)
    throw error
}

export const sendEmailOTP = async ({ email }: { email: string }) => {
    const { account } = await createAdminClient()

    try {
        const session = await account.createEmailToken(ID.unique(), email)
        return session.userId
    } catch (error) {
        handleError(error, 'Failed to send email OTP')
    }
}

export const getUserByEmail = async (email: string) => {
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
            sameSite: 'none',
            secure: true,
        })

        return parseStringify({ sessionId: session.$id })
    } catch (error) {
        handleError(error, 'Failed to verify OTP')
    }
}

export const getCurrentUser = async () => {
  try {
    const { database, account } = await createSessionClient();

    const result = await account.get();

    const user = await database.listDocuments(
      appWriteConfig.databaseId,
      appWriteConfig.userCollectionId,
      [Query.equal("accountId", [result.$id])]
    );

    if (user.total === 0) return null;

    return parseStringify(user.documents[0]);
  } catch (error) {
    console.error("getCurrentUser failed", error);
    return null; // ✅ Safe return, won’t crash production
  }
};



export const signOutUser = async () => {
    const { account } = await createSessionClient()

    try {
        await account.deleteSession('current');
        (await cookies()).delete('appwrite-session')
    } catch (error) {
        handleError(error, 'Failed to sign out user')
    } finally {
        redirect('/sign-in')
    }
}

export const signInUser = async ({ email }: { email: string }) => {
    try {
        const existingUser = await getUserByEmail(email)
        // if (!existingUser) throw new Error('User not found')

        if (existingUser) {
            await sendEmailOTP({ email })
            return parseStringify({ accountId: existingUser.accountId })
        }

        return parseStringify({ accountId: null, error: 'User not found' })
    } catch (error) {
        handleError(error, 'Failed to sign in user')
    }
}