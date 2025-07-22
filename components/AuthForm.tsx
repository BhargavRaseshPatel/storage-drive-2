"use client"
import { useState } from 'react'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { createAccount, signInUser } from '@/lib/action/user.actions'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import OTPModal from './OTPModal'

const formSchema = z.object({
    username: z.string().min(2).max(50),
})

type FormType = "sign-in" | "sign-up"

const authFormSchema = (formType: FormType) => {
    return z.object({
        email: z.string().email(),
        fullName: formType == 'sign-up' ? z.string().min(2).max(50) : z.string().optional(),
    })
}

const AuthForm = ({ type }: { type: FormType }) => {

    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [accountId, setAccountId] = useState(null)
    const router = useRouter()
    // 1. Define your form.

    const formSchema = authFormSchema(type)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: "",
            email: "",
        },
    })

    // 2. Define a submit handler.
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.

        setIsLoading(true)
        setErrorMessage('')

        try {

            const user =
                type === 'sign-up' ? await createAccount({
                    fullName: values.fullName ?? '',
                    email: values.email
                }) : await signInUser({
                    email: values.email
                })
            // console.log(user)

            if(user.error == "User not found"){
                return router.push("/sign-up")
            }

            setAccountId(user.accountId)
        } catch {
            setErrorMessage('Failed to create an account. Please try again')
        } finally {
            setIsLoading(false)
        }

    }
    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
                    <h1 className='form-title'> {type == 'sign-in' ? "Sign In" : "Sign Up"}</h1>
                    {type === 'sign-up' && <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                            <FormItem>
                                <div className='shad-form-item'>
                                    <FormLabel className='shad-form-label'>Full Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your full name" className='shad-input' {...field} />
                                    </FormControl>
                                    <FormMessage className='shad-form-message' />
                                </div>
                            </FormItem>
                        )}
                    />}

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <div className='shad-form-item'>
                                    <FormLabel className='shad-form-label'>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your email" className='shad-input' {...field} />
                                    </FormControl>
                                    <FormMessage className='shad-form-message' />
                                </div>
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className='form-submit-button'>{type === 'sign-in' ? 'Sign In' : 'Sign Up'}{isLoading && (<Image src="/assets/icons/loader.svg" alt="loader" width={24} height={24} className="ml-2 animate-spin" />)}</Button>

                    {errorMessage && <p className='error-message'>*{errorMessage}</p>}

                    <div className='body-2 flex justify-center'>
                        <p> {type === 'sign-in' ? "Don't have an account?" : "Already have an account"} </p>
                        <Link href={type === 'sign-in' ? 'sign-up' : 'sign-in'} className='ml-1 font-medium text-brand'>
                            {type === 'sign-in' ? "Sign Up" : "Sign In"}
                        </Link>
                    </div>
                </form>
            </Form>
            {/* OTP verification */}

            {accountId && <OTPModal email={form.getValues('email')} accountId={accountId} />}
        </>
    )
}

export default AuthForm