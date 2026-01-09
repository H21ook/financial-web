"use client";

import React from 'react'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
} from "@/components/ui/sidebar"
import {
    Calculator,
    TableProperties,
} from "lucide-react"
import { NavMain } from './nav-main';
import { NavUser } from './nav-user';
import Logo from './logo';

const MENU_DATA = [
    {
        title: "Жагсаалт",
        url: "#",
        icon: TableProperties,
        isActive: true,
        items: [
            {
                title: "Харилцагч",
                url: "/dashboard/customers",
            },
            {
                title: "Апп хэрэглэгч",
                url: "/dashboard/app-users",
            },
            {
                title: "Цалин",
                url: "#",
            },
        ],
    },
    // {
    //     title: "Models",
    //     url: "#",
    //     icon: Bot,
    //     items: [
    //         {
    //             title: "Genesis",
    //             url: "#",
    //         },
    //         {
    //             title: "Explorer",
    //             url: "#",
    //         },
    //         {
    //             title: "Quantum",
    //             url: "#",
    //         },
    //     ],
    // },
    // {
    //     title: "Documentation",
    //     url: "#",
    //     icon: BookOpen,
    //     items: [
    //         {
    //             title: "Introduction",
    //             url: "#",
    //         },
    //         {
    //             title: "Get Started",
    //             url: "#",
    //         },
    //         {
    //             title: "Tutorials",
    //             url: "#",
    //         },
    //         {
    //             title: "Changelog",
    //             url: "#",
    //         },
    //     ],
    // },
    {
        title: "Санхүү тайлан",
        url: "#",
        icon: Calculator,
        items: [
            {
                title: "Эхний үлдэгдэл",
                url: "#",
            },
            {
                title: "Ерөнхий журам",
                url: "#",
            }
        ],
    },
];

const AppSideBar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
    return (
        <Sidebar collapsible="offExamples" {...props}>
            <SidebarHeader>
                <Logo />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={MENU_DATA} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    )
}

export default AppSideBar