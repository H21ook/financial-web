import React from 'react'
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import AppSideBar from '@/components/custom/app-sidebar'
import { Separator } from "@/components/ui/separator"

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {

    return (
        <SidebarProvider>
            <AppSideBar />
            <SidebarInset>
                <header className="sticky top-0 z-10 flex h-16 shrink-0 bg-background items-center gap-2 transition-[width,height] ease-linear border-b">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger />
                        <Separator
                            orientation="vertical"
                            className="mr-2"
                        />
                    </div>
                </header>
                <div className="flex flex-col gap-4 p-4">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}

export default DashboardLayout