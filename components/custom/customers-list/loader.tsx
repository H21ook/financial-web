import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const CustomerListLoader = () => {
    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h1 className="text-2xl font-bold mb-1">Харилцагчдын жагсаалт</h1>
                    <p className="text-sm text-gray-500 font-medium">
                        Таны харилцагчдын жагсаалт
                    </p>
                </div>
            </div>


            <div className="bg-transparent h-[612px]">
                <Skeleton className="h-full w-full" />
            </div>
        </>
    )
}

export default CustomerListLoader