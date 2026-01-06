"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectSeparator } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import { toast } from "sonner"
import { clientFetcher } from "@/lib/fetcher/clientFetcher"
import { Customer, Taxpayer } from "@/types/customer"
import { checkCitizenRegisterFormat, checkOrganizationRegisterFormat, citizenRegex, organizationRegex } from "@/lib/utils"
import DatePicker from "@/components/ui/date-picker"
import { BusinessClass, Region, SubRegion } from "@/types/reference"

const customerSchema = z.object({
    CustomerID: z.string()
        .min(7, "Доод тал нь 7 тэмдэгт байх ёстой")
        .regex(organizationRegex, "Зөвхөн тоо оруулна уу."),
    CustomerName: z.string().min(1, "Байгууллагын нэр шаардлагатай"),
    ShortName: z.string().optional(),
    TinCode: z.string().min(1, "Байгууллагын ТИН дугаар шаардлагатай"),
    Phone: z.string().min(1, "Утасны дугаар оруулна уу."),
    Mail: z.string().optional(),
    Address: z.string().optional(),
    ContractAmount: z.number()
        .positive("0-ээс их байх ёстой").min(1, "Гэрээний дүн оруулна уу."),
    ContractEndDate: z.string().min(1, "Гэрээний дуусах хугацаа оруулна уу."),
    DigitalSignaturePassword: z.string().optional(),
    DigitalCertFilePath: z.string().optional(),
    EBarimtRegistered: z.string().optional(),
    TaxLoginOid: z.string().min(1, "Татварын нэвтрэх эрх шаардлагатай"),
    InsuranceLoginId: z.string().optional(),
    BusinessClassOid: z.string().optional(),
    RegionId: z.string().min(1, "Аймаг/Хот сонгоно уу"),
    RegionSubId: z.string().optional(),
    // Director: z.string().min(1, "Захирлын РД оруулна уу."),
    DrFirstname: z.string().min(1, "Захирлын нэр оруулна уу."),
    DrLastname: z.string().min(1, "Захирлын овог оруулна уу."),
    DirectorRegister: z.string()
        .min(10, "Доод тал нь 10 тэмдэгт байх ёстой")
        .regex(citizenRegex, "Регистрийн дугаарын формат буруу байна."),
    taxAccessRight: z.string().optional(),
    TaxName: z.string().optional(),
    IsVatPayer: z.boolean(),
    IsCityPayer: z.boolean(),
    Active: z.boolean(),
    UserName: z.string().min(1, "Апп хэрэглэгчийн нэр оруулна уу."),
    ContractPeriodType: z.string().min(1, "Гэрээний давтамж сонгоно уу."),
})

type CustomerFormData = z.infer<typeof customerSchema>

const mockTaxRoles = ["Ерөнхий нягтлан бодогч", "Нягтлан бодогч", "Туслах нягтлан бодогч"]

const contractPeriodTypes = [{
    value: "сар",
    label: "Сар",
}, {
    value: "улирал",
    label: "Улирал",
}, {
    value: "жил",
    label: "Жил",
}]

export default function CreateCustomerForm({ regions = [], businessClasses = [], allSubRegions = [] }: { regions: Region[], businessClasses: BusinessClass[], allSubRegions: SubRegion[] }) {
    const router = useRouter()
    const [isOrgLoading, setIsOrgLoading] = useState(false)
    const [isDirectorLoading, setIsDirectorLoading] = useState(false)
    const [orgDataFetchedRegNo, setOrgDataFetchedRegNo] = useState('')
    const [directorDataFetched, setDirectorDataFetched] = useState(false)
    const [subRegions, setSubRegions] = useState<SubRegion[]>([])
    const [showNewRoleDialog, setShowNewRoleDialog] = useState(false)
    const [taxRoles, setTaxRoles] = useState(mockTaxRoles)
    const [newRoleName, setNewRoleName] = useState("")
    const [newRoleDescription, setNewRoleDescription] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<CustomerFormData>({
        resolver: zodResolver(customerSchema),
        defaultValues: {
            CustomerID: "",
            CustomerName: "",
            ShortName: "",
            TinCode: "",
            Phone: "",
            Mail: "",
            Address: "",
            ContractAmount: 0,
            ContractEndDate: "",
            DigitalSignaturePassword: "",
            DigitalCertFilePath: "",
            EBarimtRegistered: "",
            TaxLoginOid: "",
            InsuranceLoginId: "",
            BusinessClassOid: "",
            RegionId: "",
            RegionSubId: "",
            DrFirstname: "",
            DrLastname: "",
            DirectorRegister: "",
            TaxName: "",
            IsVatPayer: false,
            IsCityPayer: false,
            Active: true,
            UserName: "",
            ContractPeriodType: "",
        },
    })

    const fetchOrgData = async () => {
        setOrgDataFetchedRegNo('')
        const isValid = await form.trigger("CustomerID");
        if (!isValid) {
            return
        }
        const rd = form.getValues("CustomerID")?.trim();

        if (!checkOrganizationRegisterFormat(rd)) {
            toast.error("Байгууллагын регистр буруу байна.")
            return
        }

        try {
            setIsOrgLoading(true)
            const response = await clientFetcher.get<{
                tin: string,
                exists: false,
                data: Taxpayer
            } | {
                exists: true,
                isActive: boolean,
                customerData: Customer,
                customerOid: string
            }>(`/internal/v1/check-organization-by-regno?regno=${rd}`)
            if (!response.isOk) {
                toast.error(response.error)
                return
            }
            const data = response.data
            const { exists } = data;

            let tinCode = '', name = '', vatPayer = false, cityPayer = false
            if (exists) {
                // Өөр хэрэглэгч дээр бүртгэлтэй бол яах бол?
                form.setError("CustomerID", { type: "manual", message: "Энэ регистрийн дугаар бүртгэлтэй байна." });
                return;
            } else {
                tinCode = data.tin
                name = data.data.name
                vatPayer = data.data.vatPayer
                cityPayer = data.data.cityPayer
            }
            form.setValue("CustomerName", name)
            form.setValue("TinCode", tinCode)
            form.setValue("UserName", name)
            form.setValue("IsVatPayer", vatPayer)
            form.setValue("IsCityPayer", cityPayer)

            setOrgDataFetchedRegNo(rd)
            toast.success("Байгууллагын мэдээлэл амжилттай татагдлаа.")
        } catch {
            toast.error("Байгууллагын мэдээлэл татахад алдаа гарлаа.")
        } finally {
            setIsOrgLoading(false)
        }
    }

    const fetchDirectorData = async () => {
        const rd = form.getValues("DirectorRegister")
        if (!checkCitizenRegisterFormat(rd)) {
            toast.error("Регистрийн дугаарын формат буруу байна.")
            return
        }

        setIsDirectorLoading(true)
        const response = await clientFetcher.get<{
            tin: string,
            exists: false,
            data: Taxpayer
        } | {
            exists: true,
            isActive: boolean,
            customerData: Customer,
            customerOid: string
        }>(`/internal/v1/check-director-by-register?regno=${rd}`)

        if (!response.isOk) {
            toast.error(response.error)
            return
        }

        const data = response.data
        const { exists } = data;

        let firstname = '', lastname = ''
        if (!exists) {
            firstname = data.data.directorLastName;
            lastname = data.data.directorName;
        } else {
            // end neg logic bainadaa
        }

        form.setValue("DrLastname", firstname)
        form.setValue("DrFirstname", lastname)
        setIsDirectorLoading(false)

        // !!! регистрээр мэдээлэл татчихаад дарааа нь регистр 
        // өөрчлөөд татат дарахгүй байж байгаад submit хийвэл 
        // регистр буруу илгээгдэхээр байгааг засах
    }

    const handleChangeRegion = async (value: string) => {
        form.setValue("RegionId", value)
        form.setValue("RegionSubId", "")
        setSubRegions(allSubRegions.filter(item => item.RegionId === value))
    }

    const handleSaveNewRole = () => {
        if (newRoleName) {
            setTaxRoles([...taxRoles, newRoleName])
            form.setValue("TaxLoginOid", newRoleName)
            setShowNewRoleDialog(false)
            setNewRoleName("")
            setNewRoleDescription("")
        }
    }

    const onSubmit = async (data: CustomerFormData) => {
        setIsSubmitting(true)
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Generate a mock ID for the new organization
        const newOrgId = Math.random().toString(36).substr(2, 9)

        toast.success("Байгууллага амжилттай үүслээ")

        // Redirect to organization detail page
        router.push(`/clients/${newOrgId}`)
    }

    return (
        <>
            {/* Content */}
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="space-y-8">
                    {/* Tax Access Right Section */}
                    <div className="space-y-4 grid md:grid-cols-3">
                        <div className="space-y-2">
                            <Label htmlFor="taxAccessRight">
                                Татварын нэвтрэх эрх <span className="text-destructive">*</span>
                            </Label>
                            <Select
                                value={form.watch("taxAccessRight")}
                                onValueChange={(value) => {
                                    if (value === "new") {
                                        setShowNewRoleDialog(true)
                                    } else {
                                        form.setValue("taxAccessRight", value)
                                    }
                                }}
                            >
                                <SelectTrigger id="taxAccessRight" className="w-full">
                                    <SelectValue placeholder="Сонгох" />
                                </SelectTrigger>
                                <SelectContent>
                                    {taxRoles.map((role) => (
                                        <SelectItem key={role} value={role}>
                                            {role}
                                        </SelectItem>
                                    ))}
                                    <SelectSeparator />
                                    <SelectItem value="new">+ Шинэ нэвтрэх эрх нэмэх</SelectItem>
                                </SelectContent>
                            </Select>
                            {form.formState.errors.taxAccessRight && (
                                <p className="text-sm text-destructive">{form.formState.errors.taxAccessRight.message}</p>
                            )}
                            <p className="text-sm text-muted-foreground">Жагсаалтад байхгүй бол шинээр үүсгэж болно</p>
                        </div>
                    </div>

                    {/* Organization Section */}
                    <div className="space-y-4">
                        <h3 className="font-medium flex items-center gap-2">
                            Байгууллагын мэдээлэл
                        </h3>

                        <div className="space-y-2">
                            <Label htmlFor="CustomerID">
                                Байгууллагын РД <span className="text-destructive">*</span>
                            </Label>
                            <div className="grid md:grid-cols-3 gap-4">
                                <Input id="CustomerID" {...form.register("CustomerID")} placeholder="1234567" />
                                <div className="flex items-center">
                                    <Button type="button"
                                        onClick={fetchOrgData}
                                        disabled={isOrgLoading || (orgDataFetchedRegNo !== "" && orgDataFetchedRegNo === form.watch("CustomerID"))}
                                        className="bg-green-600 hover:bg-green-700">
                                        {isOrgLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                                        Мэдээлэл татах
                                    </Button>
                                </div>
                            </div>
                            {form.formState.errors.CustomerID && (
                                <p className="text-sm text-destructive">{form.formState.errors.CustomerID.message}</p>
                            )}
                            {/* <p className="text-sm text-muted-foreground">Төрийн бүртгэлээс автоматаар татагдана</p> */}
                        </div>

                        {/* General Section */}
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="CustomerName">Байгууллагын нэр <span className="text-destructive">*</span></Label>
                                <Input id="CustomerName" {...form.register("CustomerName")} disabled={true} className="bg-muted" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="TinCode">Тин дугаар <span className="text-destructive">*</span></Label>
                                <Input
                                    id="TinCode"
                                    {...form.register("TinCode")}
                                    disabled={true}
                                    className="bg-muted"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="organizationAddress">Бизнес ангилал <span className="text-destructive">*</span></Label>
                                <Select
                                    value={form.watch("BusinessClassOid")}
                                    onValueChange={(value) => {
                                        if (value === "new") {
                                            setShowNewRoleDialog(true)
                                        } else {
                                            form.setValue("BusinessClassOid", value)
                                        }
                                    }}
                                >
                                    <SelectTrigger id="BusinessClassOid" className="w-full">
                                        <SelectValue placeholder="Сонгох" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {businessClasses.map((item) => (
                                            <SelectItem key={item.BusinessClassOid} value={item.BusinessClassOid}>
                                                {item.BusinessClassName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Director Section */}
                        <div className="space-y-4">
                            <h3 className="font-medium">Захиралын мэдээлэл</h3>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="DirectorRegister">
                                        Регистрийн дугаар <span className="text-destructive">*</span>
                                    </Label>
                                    <Input id="DirectorRegister" {...form.register("DirectorRegister")} placeholder="АБ12345678" />
                                    {form.formState.errors.DirectorRegister && (
                                        <p className="text-sm text-destructive">{form.formState.errors.DirectorRegister.message}</p>
                                    )}
                                </div>
                                <div className="flex items-end">
                                    <Button
                                        type="button"
                                        onClick={fetchDirectorData}
                                        disabled={isDirectorLoading}
                                        className="w-full md:w-auto bg-green-600 hover:bg-green-700"
                                    >
                                        {isDirectorLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                                        Захирлын мэдээлэл татах
                                    </Button>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="DrLastname">Овог</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            id="DrLastname"
                                            {...form.register("DrLastname")}
                                            disabled={true}
                                            className="bg-muted"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="DrFirstname">Нэр</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            id="DrFirstname"
                                            {...form.register("DrFirstname")}
                                            disabled={true}
                                            className="bg-muted"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Address Section */}
                        <div className="space-y-4">
                            <h3 className="font-medium">Байгууллагын хаягийн мэдээлэл</h3>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="organizationAddress">Аймаг/Хот<span className="text-destructive">*</span></Label>
                                    <Select
                                        value={form.watch("RegionId")}
                                        onValueChange={handleChangeRegion}
                                    >
                                        <SelectTrigger id="RegionId" className="w-full">
                                            <SelectValue placeholder="Сонгох" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {regions.map((item) => (
                                                <SelectItem key={item.Oid} value={item.Oid}>
                                                    {item.RegionName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="organizationAddress">Сум/Дүүрэг</Label>
                                    <Select
                                        value={form.watch("RegionSubId")}
                                        onValueChange={(value) => {
                                            form.setValue("RegionSubId", value)
                                        }}
                                        disabled={subRegions.length === 0}
                                    >
                                        <SelectTrigger id="RegionSubId" className="w-full">
                                            <SelectValue placeholder="Сонгох" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {subRegions.map((item) => (
                                                <SelectItem key={item.Oid} value={item.Oid}>
                                                    {item.SubRegionName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="Address">Хаяг</Label>
                                    <Input
                                        id="Address"
                                        {...form.register("Address")}
                                        className="bg-muted"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Contact Section */}
                        <div className="space-y-4">
                            <h3 className="font-medium">Холбоо барих мэдээлэл</h3>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="Phone">
                                        Утас <span className="text-destructive">*</span>
                                    </Label>
                                    <Input id="Phone" {...form.register("Phone")} placeholder="99112233" />
                                    {form.formState.errors.Phone && (
                                        <p className="text-sm text-destructive">{form.formState.errors.Phone.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="Mail">И-мэйл</Label>
                                    <Input id="Mail" type="Mail" {...form.register("Mail")} placeholder="example@mail.com" />
                                    {form.formState.errors.Mail && (
                                        <p className="text-sm text-destructive">{form.formState.errors.Mail.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Other Section */}
                        <div className="space-y-4">
                            <h3 className="font-medium">Бусад мэдээлэл</h3>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="EBarimtRegistered">
                                        И-Баримт бүртгэл
                                    </Label>
                                    <Input id="EBarimtRegistered" {...form.register("EBarimtRegistered")} placeholder="12332545" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="InsuranceLoginId">НД нэвтрэх эрх</Label>
                                    <Select
                                        value={form.watch("InsuranceLoginId")}
                                        onValueChange={(value) => {
                                            if (value === "new") {
                                                setShowNewRoleDialog(true)
                                            } else {
                                                form.setValue("InsuranceLoginId", value)
                                            }
                                        }}
                                    >
                                        <SelectTrigger id="InsuranceLoginId" className="w-full">
                                            <SelectValue placeholder="Сонгох" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {taxRoles.map((role) => (
                                                <SelectItem key={role} value={role}>
                                                    {role}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="UserName">Апп хэрэглэгчийн нэр</Label>
                                    <Input id="UserName" type="UserName" {...form.register("UserName")} />
                                    {form.formState.errors.UserName && (
                                        <p className="text-sm text-destructive">{form.formState.errors.UserName.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Settings Section */}
                        <div className="space-y-4">
                            <h3 className="font-medium">Тохиргоо</h3>
                            <div className="flex items-center gap-8">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="IsVatPayer"
                                        disabled={true}
                                        checked={form.watch("IsVatPayer")}
                                        onCheckedChange={(checked) => form.setValue("IsVatPayer", checked as boolean)}
                                    />
                                    <Label htmlFor="IsVatPayer" className="font-normal cursor-pointer">
                                        НӨАТ төлөгч
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="IsCityPayer"
                                        disabled={true}
                                        checked={form.watch("IsCityPayer")}
                                        onCheckedChange={(checked) => form.setValue("IsCityPayer", checked as boolean)}
                                    />
                                    <Label htmlFor="IsCityPayer" className="font-normal cursor-pointer">
                                        ХХАТ төлөгч
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="Active"
                                        disabled={true}
                                        checked={form.watch("Active")}
                                        onCheckedChange={(checked) => form.setValue("Active", checked as boolean)}
                                    />
                                    <Label htmlFor="Active" className="font-normal cursor-pointer">
                                        Идэвхтэй
                                    </Label>
                                </div>
                            </div>
                        </div>


                        {/* Contract Section */}
                        <div className="space-y-4">
                            <h3 className="font-medium">Гэрээний мэдээлэл</h3>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="ContractAmount">
                                        Гэрээний дүн <span className="text-destructive">*</span>
                                    </Label>
                                    <Input id="ContractAmount" type="number" {...form.register("ContractAmount", { valueAsNumber: true })} placeholder="199999" />
                                    {form.formState.errors.ContractAmount && (
                                        <p className="text-sm text-destructive">{form.formState.errors.ContractAmount.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="organizationAddress">Төлбөр төлөх давтамж</Label>
                                    <Select
                                        value={form.watch("ContractPeriodType")}
                                        onValueChange={(value) => {
                                            if (value === "new") {
                                                setShowNewRoleDialog(true)
                                            } else {
                                                form.setValue("ContractPeriodType", value)
                                            }
                                        }}
                                    >
                                        <SelectTrigger id="ContractPeriodType" className="w-full">
                                            <SelectValue placeholder="Сонгох" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {contractPeriodTypes.map((period) => (
                                                <SelectItem key={period.value} value={period.value}>
                                                    {period.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="ContractEndDate">Гэрээ дуусах огноо</Label>
                                    <DatePicker
                                        value={form.watch("ContractEndDate")}
                                        onChange={(value) => form.setValue("ContractEndDate", value)}
                                        className="w-full"
                                    />
                                    {form.formState.errors.ContractEndDate && (
                                        <p className="text-sm text-destructive">{form.formState.errors.ContractEndDate.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 w-full mx-auto">
                    <Button type="button" variant="outline" size="lg" onClick={() => router.push("/clients")}>
                        Цуцлах
                    </Button>
                    <Button type="submit" size="lg" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                        Байгууллага үүсгэх
                    </Button>
                </div>
            </form>

            {/* New Role Dialog */}
            <Dialog open={showNewRoleDialog} onOpenChange={setShowNewRoleDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Шинэ нэвтрэх эрх үүсгэх</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="roleName">Нэвтрэх эрхийн нэр</Label>
                            <Input
                                id="roleName"
                                value={newRoleName}
                                onChange={(e) => setNewRoleName(e.target.value)}
                                placeholder="Жишээ: Захирал"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="roleDescription">Тайлбар</Label>
                            <Input
                                id="roleDescription"
                                value={newRoleDescription}
                                onChange={(e) => setNewRoleDescription(e.target.value)}
                                placeholder="Товч тайлбар"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowNewRoleDialog(false)}>
                            Цуцлах
                        </Button>
                        <Button onClick={handleSaveNewRole}>Хадгалах</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
