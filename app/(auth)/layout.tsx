import Image from 'next/image'
import React from 'react'

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='flex min-h-screen'>
            <section className='hidden w-1/2 items-center justify-center bg-brand p-10 lg:flex xl:w-2/5'>
                <div className='flex max-h-[800px] max-w-[430px] flex-col justify-center space-y-12'>
                    <Image src='/assets/new_icons/logo-full-white.svg' alt='Logo' width={224} height={82} className='h-auto' />

                    <div className='space-y-5 text-white'>
                        <h1 className='h1'>Manage your files the best way</h1>
                        <p className='flex-1'>This is the place where you can store all your documents.</p>
                    </div>

                    <Image alt='file' width={342} height={342} src='/assets/images/files.png' className='transition-all hover:rotate-2 hover:scale-105' />
                </div>
            </section>

            <section className='flex flex-1 flex-col items-center bg-white p-4 py-10 lg:justify-center lg:p-10 lg:py-0'>
                <div className='flex mb-16 lg:hidden '>
                    <Image src="/assets/new_icons/logo-full.svg" alt="Logo" width={224} height={82} className='h-auto w-[200px] lg:w-[250px]' />
                </div>
                {children}
            </section>
        </div>
    )
}

export default Layout