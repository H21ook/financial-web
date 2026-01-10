import Image from "next/image"

const Logo = () => {
    return (
        <div className='h-12 flex items-center gap-2'>
            <Image src="/favicon.ico" alt="novaq" className="size-8" height={32} width={32} />
            <h1 className='font-bold text-2xl'>NovaQ</h1>
        </div>
    )
}

export default Logo