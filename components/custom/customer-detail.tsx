"use client"

import { Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import type { CustomerDetailType, Employee } from "@/types/customer"
import Breadcrumb from "@/components/custom/Breadcrumb"
import { BusinessClass, Region, SubRegion } from "@/types/reference"
import EmployeeTable from "./employee-table"
import CustomerSettings from "./customer-settings"
import { useAuth } from "../auth-provider"

export default function CustomerDetails({
    data,
    referenceData
}: {
    data: {
        customer: CustomerDetailType;
        employees: Employee[];
    },
    referenceData: {
        regions: Region[];
        businessClasses: BusinessClass[];
        allSubRegions: SubRegion[];
    }
}) {
    const { user} = useAuth();
    const customer = data.customer
    const registrationNumber = customer.CustomerID

    const regionName = referenceData.regions.find(r => r.Oid === customer.RegionId)?.RegionName || "";
    const subRegionName = referenceData.allSubRegions.find(sr => sr.Oid === customer.RegionSubId)?.SubRegionName || "";
    const businessClassName = referenceData.businessClasses.find(bc => bc.Oid === customer.BusinessClassOid)?.BusinessClassName || "";

    return (
        <>
            <div>
                <Breadcrumb paths={[
                    { name: "Харилцагчид", href: "/dashboard/customers" },
                    { name: customer.CustomerName },
                ]} />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold mb-1 text-balance">{customer.CustomerName}</h1>
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-muted-foreground">РД: {registrationNumber}</span>
                            <Badge variant={customer.Active ? "default" : "secondary"}>
                                {customer.Active ? "Идэвхтэй" : "Идэвхгүй"}
                            </Badge>
                        </div>
                    </div>
                    <Button variant="outline" size="sm">
                        <Pencil className="h-4 w-4 mr-2" />
                        Засах
                    </Button>
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
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-xl font-bold">Ерөнхий мэдээлэл</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Organization Info */}
                                <div className="space-y-4">
                                    {/* <h3 className="font-medium text-sm text-muted-foreground">Байгууллагын мэдээлэл</h3> */}
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-muted-foreground">Байгууллагын нэр</Label>
                                            <p className="font-medium">{customer.CustomerName}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-muted-foreground">Регистрийн дугаар</Label>
                                            <p className="font-medium">{registrationNumber}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-muted-foreground">Бизнесийн ангилал</Label>
                                            <p className="font-medium">{businessClassName}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-muted-foreground">Хаяг</Label>
                                            <p className="font-medium">{`${regionName}, ${subRegionName}${customer?.Address ? `, ${customer.Address}` : ''}`}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Director Info */}
                                <div className="space-y-4 pt-4 border-t">
                                    <h3 className="font-medium text-sm text-muted-foreground">Захирал</h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-muted-foreground">Овог, нэр</Label>
                                            <p className="font-medium">
                                                {customer.DrLastname} {customer.DrFirstname}
                                            </p>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-muted-foreground">Иргэний РД</Label>
                                            <p className="font-medium">{customer.Director}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Info */}
                                <div className="space-y-4 pt-4 border-t">
                                    <h3 className="font-medium text-sm text-muted-foreground">Холбоо барих мэдээлэл</h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-muted-foreground">Утас</Label>
                                            <p className="font-medium">{customer.Phone}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-muted-foreground">И-мэйл</Label>
                                            <p className="font-medium">{customer.Mail}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Tax Info */}
                                <div className="space-y-4 pt-4 border-t">
                                    <h3 className="font-medium text-sm text-muted-foreground">Татварын мэдээлэл</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            {
                                                customer.IsVatPayer && <Badge variant="default">
                                                    НӨАТ төлөгч
                                                </Badge>
                                            }
                                            {
                                                customer.IsCityPayer && <Badge variant="default">
                                                    ХХАТ төлөгч
                                                </Badge>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Tab 2: Employee List */}
                    <TabsContent value="employees">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl font-bold">Ажилчдын жагсаалт</CardTitle>
                                <CardDescription className="text-sm text-gray-500 font-medium">
                                    Харилцагчийн ажилчдын мэдээлэл
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <EmployeeTable data={data.employees} isConnectedInsurance={!!customer.InsuranceLoginId} />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Tab 3: Settings */}
                    <TabsContent value="settings">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl font-bold">Тохиргоо</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <CustomerSettings
                                    customerOid={user?.Oid || ""}
                                    taxLoginOid={customer.TaxLoginOid}
                                    insuranceLoginId={customer.InsuranceLoginId}
                                    eBarimtRegistered={customer.EBarimtRegistered}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </>
    )
}




