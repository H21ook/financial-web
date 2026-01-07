import React from 'react'
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import AppSideBar from '@/components/custom/app-sidebar'
import { Separator } from "@/components/ui/separator"
import { ThemeToggleButton } from '@/components/custom/shared/theme-toggle-button'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {

    return (
        <SidebarProvider>
            <AppSideBar />
            <SidebarInset>
                <header className="sticky top-0 z-10 flex h-16 shrink-0 bg-background items-center gap-2 transition-[width,height] ease-linear border-b">
                    <div className="w-full flex items-center justify-between gap-8 px-4">
                        <div className="flex items-center gap-2">
                            <SidebarTrigger />
                            <Separator
                                orientation="vertical"
                                className="mr-2"
                            />

                        </div>
                        <ThemeToggleButton />
                    </div>
                </header>
                <div className="flex flex-col gap-4 p-8">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}

export default DashboardLayout