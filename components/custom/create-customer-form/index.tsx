"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import { toast } from "sonner"
import { clientFetcher } from "@/lib/fetcher/clientFetcher"
import { Customer, Taxpayer } from "@/types/customer"
import { checkCitizenRegisterFormat, checkOrganizationRegisterFormat, citizenRegex, organizationRegex } from "@/lib/utils"
import DatePicker from "@/components/ui/date-picker"
import { BusinessClass, Region, SubRegion } from "@/types/reference"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { createCustomer } from "@/lib/actions/customer-actions"

const customerSchema = z.object({
    CustomerID: z.string()
        .min(7, "Доод тал нь 7 тэмдэгт байх ёстой")
        .regex(organizationRegex, "Регистрийн дугаарын формат буруу байна."),
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
    TaxLoginOid: z.string().optional(),
    InsuranceLoginId: z.string().optional(),
    BusinessClassOid: z.string().min(1, "Бизнес ангилал сонгоно уу."),
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
            ContractPeriodType: contractPeriodTypes[0].value,
        }
    })

    const clearOrgFilledData = () => {
        setOrgDataFetchedRegNo('')
        form.setValue("CustomerName", "", { shouldValidate: false, shouldDirty: false, shouldTouch: false });
        form.setValue("TinCode", "", { shouldValidate: false, shouldDirty: false, shouldTouch: false });
        form.setValue("UserName", "", { shouldValidate: false, shouldDirty: false, shouldTouch: false });
        form.setValue("IsVatPayer", false, { shouldValidate: false, shouldDirty: false, shouldTouch: false });
        form.setValue("IsCityPayer", false, { shouldValidate: false, shouldDirty: false, shouldTouch: false });

        form.clearErrors(["CustomerName", "TinCode", "UserName"]);
    };

    const fetchOrgData = async (regNo: string) => {
        const isValid = await form.trigger("CustomerID");
        if (!isValid) return;

        const rd = regNo?.trim();

        if (!checkOrganizationRegisterFormat(rd)) {
            toast.error("Байгууллагын регистр буруу байна.");
            return;
        }

        // Өмнөх татсан датаг цэвэрлэх
        clearOrgFilledData();

        try {
            setIsOrgLoading(true);

            const response = await clientFetcher.get<
                | { tin: string; exists: false; data: Taxpayer }
                | { exists: true; isActive: boolean; customerData: Customer; customerOid: string }
            >(`/internal/v1/check-organization-by-regno?regno=${encodeURIComponent(rd)}`);

            if (!response.isOk) {
                toast.error(response.error);
                return;
            }

            const data = response.data;

            if (data.exists) {
                form.setError("CustomerID", { type: "manual", message: "Энэ регистрийн дугаар бүртгэлтэй байна." });
                return;
            }

            const tinCode = data.tin ?? "";
            const name = data.data?.name ?? "";
            const vatPayer = !!data.data?.vatPayer;
            const cityPayer = !!data.data?.cityPayer;

            form.setValue("CustomerName", name, { shouldValidate: false });
            form.setValue("TinCode", tinCode.toString(), { shouldValidate: false });
            form.setValue("UserName", name, { shouldValidate: false });
            form.setValue("IsVatPayer", vatPayer, { shouldValidate: false });
            form.setValue("IsCityPayer", cityPayer, { shouldValidate: false });

            form.clearErrors(["CustomerName", "TinCode", "UserName"]);

            setOrgDataFetchedRegNo(rd);
            toast.success("Байгууллагын мэдээлэл амжилттай татагдлаа.");
        } catch {
            toast.error("Байгууллагын мэдээлэл татахад алдаа гарлаа.");
        } finally {
            setIsOrgLoading(false);
        }
    };

    const fetchDirectorData = async (regNo: string) => {
        const isValid = await form.trigger("DirectorRegister");
        if (!isValid) return;

        form.setValue("DrFirstname", "", { shouldValidate: false, shouldDirty: false, shouldTouch: false });
        form.setValue("DrLastname", "", { shouldValidate: false, shouldDirty: false, shouldTouch: false });

        const rd = regNo?.trim()
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

        form.setValue("DrFirstname", firstname, { shouldValidate: false });
        form.setValue("DrLastname", lastname, { shouldValidate: false });

        form.clearErrors(["DrFirstname", "DrLastname"])
        setIsDirectorLoading(false)

        // !!! регистрээр мэдээлэл татчихаад дарааа нь регистр 
        // өөрчлөөд татах дарахгүй байж байгаад submit хийвэл 
        // регистр буруу илгээгдэхээр байгааг засах
    }

    const handleChangeRegion = async (value: string) => {
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
        try {

            const fd = new FormData()

            Object.entries(data).forEach(([key, value]) => {
                if (value === undefined || value === null) return

                if (typeof value === "boolean") {
                    fd.append(key, value ? "true" : "false")
                } else {
                    fd.append(key, String(value))
                }
            })

            const response = await createCustomer(fd)

            if (!response.isOk) {
                toast.error(response.error)
                setIsSubmitting(false)
                return
            }

            toast.success("Байгууллага амжилттай үүслээ")
            router.push("/dashboard/customers")
        } catch (error) {
            console.error("Error submitting form:", error)
            toast.error("Байгууллага үүсгэх үед хатуулахгүй")
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <Form {...form}>
                {/* Content */}
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="space-y-8">
                        {/* Tax Access Right Section */}
                        {/* <div className="space-y-4 grid md:grid-cols-3">
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
                    </div> */}

                        {/* Organization Section */}
                        <div className="space-y-4">
                            <h3 className="font-medium flex items-center gap-2">
                                Байгууллагын мэдээлэл
                            </h3>

                            <FormField
                                control={form.control}
                                name="CustomerID"
                                render={({ field, fieldState: { error } }) => (
                                    <FormItem className="gap-2 items-start">
                                        <FormLabel className="text-sm leading-none">Байгууллагын РД <span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <div className="flex gap-2">
                                                <Input id="CustomerID" {...field} placeholder="1234567" aria-invalid={!!error} />
                                                <div className="flex items-center">
                                                    <Button
                                                        type="button"
                                                        onClick={() => fetchOrgData(field.value)}
                                                        disabled={isOrgLoading || (orgDataFetchedRegNo !== "" && orgDataFetchedRegNo === field.value)}
                                                        className="bg-green-600 hover:bg-green-700">
                                                        {isOrgLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                                                        Мэдээлэл татах
                                                    </Button>
                                                </div>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* General Section */}
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="CustomerName">Байгууллагын нэр <span className="text-destructive">*</span></Label>
                                <Input
                                    id="CustomerName"
                                    {...form.register("CustomerName")}
                                    disabled={true} className="bg-muted"
                                    aria-invalid={!!form.formState.errors.CustomerName}
                                />
                                {form.formState.errors.CustomerName && (
                                    <p className="text-sm text-destructive">{form.formState.errors.CustomerName.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="TinCode">Тин дугаар <span className="text-destructive">*</span></Label>
                                <Input
                                    id="TinCode"
                                    {...form.register("TinCode")}
                                    disabled={true}
                                    className="bg-muted"
                                    aria-invalid={!!form.formState.errors.TinCode}
                                />
                                {form.formState.errors.TinCode && (
                                    <p className="text-sm text-destructive">{form.formState.errors.TinCode.message}</p>
                                )}
                            </div>

                            <FormField
                                control={form.control}
                                name="BusinessClassOid"
                                render={({ field, fieldState: { error } }) => (
                                    <FormItem className="gap-2 items-start">
                                        <FormLabel className="text-sm leading-none">Бизнес ангилал <span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <Select
                                                value={field.value}
                                                onValueChange={(value) => {
                                                    if (value === "new") {
                                                        setShowNewRoleDialog(true)
                                                    } else {
                                                        field.onChange(value)
                                                    }
                                                }}
                                            >
                                                <SelectTrigger id="BusinessClassOid" className="w-full" aria-invalid={!!error}>
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
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Settings Section */}
                        <div className="space-y-4">
                            {/* <h3 className="font-medium">Тохиргоо</h3> */}
                            <div className="flex items-center gap-8">
                                <FormField
                                    control={form.control}
                                    name="IsVatPayer"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center gap-2 space-y-0">
                                            <FormControl>
                                                <Checkbox
                                                    disabled
                                                    checked={!!field.value}
                                                    onCheckedChange={(checked) => field.onChange(!!checked)}
                                                    className="disabled:opacity-100"
                                                />
                                            </FormControl>
                                            <FormLabel className="font-normal peer-disabled:opacity-100">НӨАТ төлөгч</FormLabel>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="IsCityPayer"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center gap-2 space-y-0">
                                            <FormControl>
                                                <Checkbox
                                                    disabled
                                                    checked={!!field.value}
                                                    onCheckedChange={(checked) => field.onChange(!!checked)}
                                                    className="disabled:opacity-100"
                                                />
                                            </FormControl>
                                            <FormLabel className="font-normal peer-disabled:opacity-100">ХХАТ төлөгч</FormLabel>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="Active"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center gap-2 space-y-0">
                                            <FormControl>
                                                <Checkbox
                                                    disabled
                                                    checked={!!field.value}
                                                    onCheckedChange={(checked) => field.onChange(!!checked)}
                                                    className="disabled:opacity-100"
                                                />
                                            </FormControl>
                                            <FormLabel className="font-normal peer-disabled:opacity-100">Идэвхтэй</FormLabel>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Director Section */}
                        <div className="space-y-4">
                            <h3 className="font-medium">Захиралын мэдээлэл</h3>

                            <FormField
                                control={form.control}
                                name="DirectorRegister"
                                render={({ field, fieldState: { error } }) => (
                                    <FormItem className="gap-2 items-start">
                                        <FormLabel className="text-sm leading-none">Регистрийн дугаар <span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <div className="flex gap-2">
                                                <Input {...field} placeholder="АБ12345678" aria-invalid={!!error} />
                                                <div className="flex items-center">
                                                    <Button
                                                        type="button"
                                                        onClick={() => fetchDirectorData(field.value)}
                                                        disabled={isDirectorLoading}
                                                        className="w-full md:w-auto bg-green-600 hover:bg-green-700"
                                                    >
                                                        {isDirectorLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                                                        Мэдээлэл татах
                                                    </Button>
                                                </div>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="DrLastname">Овог <span className="text-destructive">*</span></Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            id="DrLastname"
                                            {...form.register("DrLastname")}
                                            disabled={true}
                                            className="bg-muted"
                                            aria-invalid={!!form.formState.errors.DrLastname}
                                        />
                                    </div>
                                    {form.formState.errors.DrLastname && (
                                        <p className="text-sm text-destructive">{form.formState.errors.DrLastname.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="DrFirstname">Нэр <span className="text-destructive">*</span></Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            id="DrFirstname"
                                            {...form.register("DrFirstname")}
                                            disabled={true}
                                            className="bg-muted"
                                            aria-invalid={!!form.formState.errors.DrFirstname}
                                        />
                                    </div>
                                    {form.formState.errors.DrFirstname && (
                                        <p className="text-sm text-destructive">{form.formState.errors.DrFirstname.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Address Section */}
                        <div className="space-y-4">
                            <h3 className="font-medium">Байгууллагын хаягийн мэдээлэл</h3>
                            <div className="grid md:grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name="RegionId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Аймаг/Хот<span className="text-destructive">*</span></FormLabel>
                                            <FormControl>
                                                <Select
                                                    value={field.value}
                                                    onValueChange={(value) => {
                                                        field.onChange(value)
                                                        handleChangeRegion(value)
                                                    }}
                                                >
                                                    <SelectTrigger id="RegionId" className="w-full" aria-invalid={!!form.formState.errors.RegionId}>
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
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="RegionSubId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Сум/Дүүрэг</FormLabel>
                                            <FormControl>
                                                <Select
                                                    value={field.value}
                                                    onValueChange={(value) => {
                                                        field.onChange(value)
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
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
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
                                    <Label htmlFor="UserName">Апп хэрэглэгчийн нэр <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="UserName"
                                        type="UserName"
                                        {...form.register("UserName")}
                                        aria-invalid={!!form.formState.errors.UserName}
                                    />
                                    {form.formState.errors.UserName && (
                                        <p className="text-sm text-destructive">{form.formState.errors.UserName.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="Phone">
                                        Утас <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="Phone"
                                        {...form.register("Phone")}
                                        placeholder="99112233"
                                        aria-invalid={!!form.formState.errors.Phone}
                                    />
                                    {form.formState.errors.Phone && (
                                        <p className="text-sm text-destructive">{form.formState.errors.Phone.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="Mail">И-мэйл</Label>
                                    <Input id="Mail" type="Mail" {...form.register("Mail")} placeholder="example@mail.com" />
                                </div>

                            </div>
                        </div>

                        {/* Other Section */}
                        {/* <div className="space-y-4">
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
                        </div> */}

                        {/* Contract Section */}
                        <div className="space-y-4">
                            <h3 className="font-medium">Гэрээний мэдээлэл</h3>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="ContractAmount">
                                        Гэрээний дүн <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="ContractAmount"
                                        type="number"
                                        {...form.register("ContractAmount", { valueAsNumber: true })}
                                        placeholder="199999"
                                        aria-invalid={!!form.formState.errors.ContractAmount}
                                    />
                                    {form.formState.errors.ContractAmount && (
                                        <p className="text-sm text-destructive">{form.formState.errors.ContractAmount.message}</p>
                                    )}
                                </div>
                                <FormField
                                    control={form.control}
                                    name="ContractPeriodType"
                                    render={({ field }) => (
                                        <FormItem className="gap-2">
                                            <FormLabel>Төлбөр төлөх давтамж</FormLabel>

                                            <Select
                                                value={field.value ?? ""}
                                                onValueChange={(value) => {
                                                    field.onChange(value);
                                                }}
                                            >
                                                <FormControl>
                                                    <SelectTrigger id="ContractPeriodType" className="w-full">
                                                        <SelectValue placeholder="Сонгох" />
                                                    </SelectTrigger>
                                                </FormControl>

                                                <SelectContent>
                                                    {contractPeriodTypes.map((period) => (
                                                        <SelectItem key={period.value} value={period.value}>
                                                            {period.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="ContractEndDate"
                                    render={({ field, fieldState: { error } }) => (
                                        <FormItem>
                                            <FormLabel>Гэрээ дуусах огноо <span className="text-destructive">*</span></FormLabel>
                                            <FormControl>
                                                <DatePicker
                                                    value={field.value}
                                                    onChange={(value) => field.onChange(value)}
                                                    className="w-full"
                                                    ariaInvalid={!!error}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
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
            </Form >

            {/* New Role Dialog */}
            < Dialog open={showNewRoleDialog} onOpenChange={setShowNewRoleDialog} >
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
            </Dialog >
        </>
    )
}
