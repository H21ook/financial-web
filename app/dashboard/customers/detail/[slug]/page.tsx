"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ChevronRight, Home, Settings, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import type { Employee } from "@/types/customer"
import Breadcrumb from "@/components/custom/Breadcrumb"

const mockTaxRoles = ["Ерөнхий нягтлан бодогч", "Нягтлан бодогч", "Туслах нягтлан бодогч"]

// Mock organization data
const mockOrganization = {
    id: "1",
    name: "Монгол Технологи ХХК",
    registrationNumber: "1234567",
    address: "Улаанбаатар хот, Сүхбаатар дүүрэг, 1-р хороо",
    director: {
        lastName: "Бат",
        firstName: "Болд",
        rd: "АБ12345678",
    },
    phone: "99112233",
    email: "info@mongoltech.mn",
    isVatPayer: true,
    isCitPayer: false,
    isActive: true,
}

export default function ClientDetailPage() {
    return (
        <div>
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div>
                    <Breadcrumb paths={[
                        { name: "Харилцагчид", href: "/dashboard/customers" },
                        { name: mockOrganization.name },
                    ]} />

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold mb-1 text-balance">{mockOrganization.name}</h1>
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-muted-foreground">РД: {mockOrganization.registrationNumber}</span>
                                <Badge variant={mockOrganization.isActive ? "default" : "secondary"}>
                                    {mockOrganization.isActive ? "Идэвхтэй" : "Идэвхгүй"}
                                </Badge>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline">
                                <Pencil className="h-4 w-4 mr-2" />
                                Засах
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Content with Tabs */}
                <div>
                    <Tabs defaultValue="general" className="w-full space-y-2">
                        <TabsList>
                            <TabsTrigger value="general">Ерөнхий мэдээлэл</TabsTrigger>
                            <TabsTrigger value="employees">Ажилчдын жагсаалт</TabsTrigger>
                            <TabsTrigger value="settings">Тохиргоо</TabsTrigger>
                        </TabsList>

                        {/* Tab 1: General Information */}
                        <TabsContent value="general">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                                    <CardTitle>Ерөнхий мэдээлэл</CardTitle>
                                    <Button variant="outline" size="sm">
                                        <Pencil className="h-4 w-4 mr-2" />
                                        Засах
                                    </Button>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Organization Info */}
                                    <div className="space-y-4">
                                        {/* <h3 className="font-medium text-sm text-muted-foreground">Байгууллагын мэдээлэл</h3> */}
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="text-muted-foreground">Байгууллагын нэр</Label>
                                                <p className="font-medium">{mockOrganization.name}</p>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-muted-foreground">Регистрийн дугаар</Label>
                                                <p className="font-medium">{mockOrganization.registrationNumber}</p>
                                            </div>
                                            <div className="space-y-2 md:col-span-2">
                                                <Label className="text-muted-foreground">Хаяг</Label>
                                                <p className="font-medium">{mockOrganization.address}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Director Info */}
                                    <div className="space-y-4 pt-4 border-t">
                                        <h3 className="font-medium text-sm text-muted-foreground">Захирал</h3>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="text-muted-foreground">Овог нэр</Label>
                                                <p className="font-medium">
                                                    {mockOrganization.director.lastName} {mockOrganization.director.firstName}
                                                </p>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-muted-foreground">Иргэний РД</Label>
                                                <p className="font-medium">{mockOrganization.director.rd}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contact Info */}
                                    <div className="space-y-4 pt-4 border-t">
                                        <h3 className="font-medium text-sm text-muted-foreground">Холбоо барих мэдээлэл</h3>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="text-muted-foreground">Утас</Label>
                                                <p className="font-medium">{mockOrganization.phone}</p>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-muted-foreground">И-мэйл</Label>
                                                <p className="font-medium">{mockOrganization.email}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tax Info */}
                                    <div className="space-y-4 pt-4 border-t">
                                        <h3 className="font-medium text-sm text-muted-foreground">Татварын мэдээлэл</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                                <Badge variant={mockOrganization.isVatPayer ? "default" : "secondary"}>
                                                    {mockOrganization.isVatPayer ? "НӨАТ төлөгч" : "НӨАТ төлөгч биш"}
                                                </Badge>
                                                <Badge variant={mockOrganization.isCitPayer ? "default" : "secondary"}>
                                                    {mockOrganization.isCitPayer ? "ХХАТ төлөгч" : "ХХАТ төлөгч биш"}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Tab 2: Employee List */}
                        <TabsContent value="employees">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                                    <CardTitle>Ажилчдын жагсаалт</CardTitle>
                                    {/* <Button size='sm' onClick={() => setShowAddEmployeeDialog(true)}>+ Ажилтан нэмэх</Button> */}
                                </CardHeader>
                                <CardContent>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Tab 3: Settings */}
                        <TabsContent value="settings">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="h-8 flex items-center">Тохиргоо</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Status Settings */}
                                    <div className="space-y-4">
                                        <h3 className="font-medium text-sm text-muted-foreground">Төлөв</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox id="active" checked={mockOrganization.isActive} />
                                                <Label htmlFor="active" className="font-normal cursor-pointer">
                                                    Идэвхтэй
                                                </Label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tax Settings */}
                                    <div className="space-y-4 pt-4 border-t">
                                        <h3 className="font-medium text-sm text-muted-foreground">Татварын тохиргоо</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox id="vat" checked={mockOrganization.isVatPayer} />
                                                <Label htmlFor="vat" className="font-normal cursor-pointer">
                                                    НӨАТ төлөгч
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox id="cit" checked={mockOrganization.isCitPayer} />
                                                <Label htmlFor="cit" className="font-normal cursor-pointer">
                                                    ХХАТ төлөгч
                                                </Label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Access Settings */}
                                    <div className="space-y-4 pt-4 border-t">
                                        <h3 className="font-medium text-sm text-muted-foreground">Нэвтрэх эрхийн тохиргоо</h3>
                                        <div className="space-y-2">
                                            <Label htmlFor="defaultRole">Үндсэн нэвтрэх эрх</Label>
                                            <Input id="defaultRole" defaultValue="Нягтлан бодогч" readOnly className="bg-muted max-w-sm" />
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <Button>Хадгалах</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
