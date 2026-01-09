"use client";

import React, { ReactNode } from 'react'
import { ChevronRight, Home } from 'lucide-react'
import { useRouter } from 'next/navigation'

const Breadcrumb = ({
    icon = <Home className="h-4 w-4" />,
    paths = []
}: {
    icon?: ReactNode,
    paths: { name: string, href?: string }[]
}) => {
    const router = useRouter()
    return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            {icon}
            <ChevronRight className="h-4 w-4" />
            {
                paths.map((path, index) => {
                    if (index === paths.length - 1) {
                        return (
                            <span key={index} className="text-foreground">
                                {path.name}
                            </span>
                        )
                    }
                    return (
                        <React.Fragment key={`path_$${index}`}>
                            <span key={index} className="cursor-pointer hover:text-foreground" onClick={() => {
                                if (path.href) {
                                    router.push(path.href)
                                }
                            }}>
                                {path.name}
                            </span>
                            <ChevronRight className="h-4 w-4" />
                        </React.Fragment>
                    )
                })
            }
        </div>
    )
}

export default Breadcrumb