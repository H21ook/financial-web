"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    saveCustomerInsuranceAccess,
    saveCustomerTaxAccess,
} from "@/lib/actions/customer-actions"

type SettingsFormValues = {
    TaxUsername: string;
    TaxPassword: string;
    InsuranceLoginId: string;
    InsurancePassword: string;
    EBarimtRegistered: string;
}

const CustomerSettings = ({
    customerOid,
    taxLoginOid,
    insuranceLoginId,
    eBarimtRegistered,
}: {
    customerOid: string;
    taxLoginOid?: string | null;
    insuranceLoginId?: string | null;
    eBarimtRegistered?: string | null;
}) => {
    const isTaxConnected = !!taxLoginOid
    const isInsuranceConnected = !!insuranceLoginId
    const [isEditingTax, setIsEditingTax] = useState(!isTaxConnected)
    const [isEditingInsurance, setIsEditingInsurance] = useState(!isInsuranceConnected)
    const [showTaxPassword, setShowTaxPassword] = useState(false)
    const [showInsurancePassword, setShowInsurancePassword] = useState(false)
    const [isSavingTax, setIsSavingTax] = useState(false)
    const [isSavingInsurance, setIsSavingInsurance] = useState(false)
    const [isSavingEbarimt, setIsSavingEbarimt] = useState(false)

    const settingsForm = useForm<SettingsFormValues>({
        defaultValues: {
            TaxUsername: taxLoginOid || "",
            TaxPassword: "",
            InsuranceLoginId: insuranceLoginId || "",
            InsurancePassword: "",
            EBarimtRegistered: eBarimtRegistered === "1" ? "1" : "0",
        },
    })

    const handleTaxSave = async () => {
        setIsSavingTax(true)
        try {
            const values = settingsForm.getValues()
            const fd = new FormData()
            fd.append("AccountantOid", customerOid)
            fd.append("TaxUsername", values.TaxUsername)
            fd.append("Password", values.TaxPassword)

            const response = await saveCustomerTaxAccess(fd)
            if (!response.isOk) {
                toast.error(response.error)
                setIsSavingTax(false)
                return
            }

            toast.success("Татварын эрх амжилттай хадгалагдлаа")
            setIsEditingTax(false)
            settingsForm.setValue("TaxPassword", "")
        } catch (error) {
            console.error("Error saving tax access:", error)
            toast.error("Татварын эрх хадгалах үед алдаа гарлаа")
        } finally {
            setIsSavingTax(false)
        }
    }

    const handleInsuranceSave = async () => {
        setIsSavingInsurance(true)
        try {
            const values = settingsForm.getValues()
            const fd = new FormData()
            fd.append("AccountantOid", customerOid)
            fd.append("InsuranceLoginId", values.InsuranceLoginId)
            fd.append("Password", values.InsurancePassword)

            const response = await saveCustomerInsuranceAccess(fd)
            if (!response.isOk) {
                toast.error(response.error)
                setIsSavingInsurance(false)
                return
            }

            toast.success("Нийгмийн даатгалын эрх амжилттай хадгалагдлаа")
            setIsEditingInsurance(false)
            settingsForm.setValue("InsurancePassword", "")
        } catch (error) {
            console.error("Error saving insurance access:", error)
            toast.error("Нийгмийн даатгалын эрх хадгалах үед алдаа гарлаа")
        } finally {
            setIsSavingInsurance(false)
        }
    }

    const handleEbarimtSave = async () => {
        // setIsSavingEbarimt(true)
        // try {
        //     const values = settingsForm.getValues()
        //     const fd = new FormData()
        //     fd.append("CustomerOid", customerOid)
        //     fd.append("EBarimtRegistered", values.EBarimtRegistered)
        //     toast.success("И-Баримтын тохиргоо хадгалагдлаа")
        // } catch (error) {
        //     console.error("Error saving ebarimt:", error)
        //     toast.error("И-Баримтын тохиргоо хадгалах үед алдаа гарлаа")
        // } finally {
        //     setIsSavingEbarimt(false)
        // }
    }

    return (
        <Form {...settingsForm}>
            <form className="space-y-6">
                <div className="grid gap-4 lg:grid-cols-2">
                    <div className="rounded-lg border p-4 border-border">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h3 className="font-medium">Татварын системийн нэвтрэх эрх</h3>
                                <p className="text-sm text-muted-foreground">
                                    Нэвтрэх нэр, нууц үг ашиглан холбоно.
                                </p>
                            </div>
                            <Badge variant={isTaxConnected ? "default" : "secondary"}>
                                {isTaxConnected ? "Холбогдсон" : "Холбоогүй"}
                            </Badge>
                        </div>

                        <div className="grid gap-3 mt-4">
                            <FormField
                                control={settingsForm.control}
                                name="TaxUsername"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Нэвтрэх нэр</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={isTaxConnected && !isEditingTax}
                                                placeholder="Нэвтрэх нэр"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={settingsForm.control}
                                name="TaxPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Нууц үг</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    {...field}
                                                    type={showTaxPassword ? "text" : "password"}
                                                    disabled={isTaxConnected && !isEditingTax}
                                                    placeholder="********"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    className="absolute right-1 top-1/2 -translate-y-1/2"
                                                    onClick={() => setShowTaxPassword((prev) => !prev)}
                                                >
                                                    {showTaxPassword ? (
                                                        <EyeOff className="h-4 w-4" />
                                                    ) : (
                                                        <Eye className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex items-center gap-2 mt-4">
                            {isTaxConnected && !isEditingTax ? (
                                <Button type="button" variant="outline" onClick={() => setIsEditingTax(true)}>
                                    Засах
                                </Button>
                            ) : (
                                <>
                                    <Button type="button" onClick={handleTaxSave} disabled={isSavingTax}>
                                        {isTaxConnected ? "Хадгалах" : "Холбох"}
                                    </Button>
                                    {isTaxConnected && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={() => {
                                                setIsEditingTax(false)
                                                settingsForm.setValue("TaxUsername", taxLoginOid || "")
                                                settingsForm.setValue("TaxPassword", "")
                                            }}
                                        >
                                            Цуцлах
                                        </Button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    <div className="rounded-lg border p-4 border-border">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h3 className="font-medium">Нийгмийн даатгалын системийн нэвтрэх эрх</h3>
                                <p className="text-sm text-muted-foreground">
                                    Нэвтрэх нэр, нууц үг ашиглан холбоно.
                                </p>
                            </div>
                            <Badge variant={isInsuranceConnected ? "default" : "secondary"}>
                                {isInsuranceConnected ? "Холбогдсон" : "Холбоогүй"}
                            </Badge>
                        </div>

                        <div className="grid gap-3 mt-4">
                            <FormField
                                control={settingsForm.control}
                                name="InsuranceLoginId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Нэвтрэх нэр</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={isInsuranceConnected && !isEditingInsurance}
                                                placeholder="Нэвтрэх нэр"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={settingsForm.control}
                                name="InsurancePassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Нууц үг</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    {...field}
                                                    type={showInsurancePassword ? "text" : "password"}
                                                    disabled={isInsuranceConnected && !isEditingInsurance}
                                                    placeholder="********"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    className="absolute right-1 top-1/2 -translate-y-1/2"
                                                    onClick={() => setShowInsurancePassword((prev) => !prev)}
                                                >
                                                    {showInsurancePassword ? (
                                                        <EyeOff className="h-4 w-4" />
                                                    ) : (
                                                        <Eye className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex items-center gap-2 mt-4">
                            {isInsuranceConnected && !isEditingInsurance ? (
                                <Button type="button" variant="outline" onClick={() => setIsEditingInsurance(true)}>
                                    Засах
                                </Button>
                            ) : (
                                <>
                                    <Button type="button" onClick={handleInsuranceSave} disabled={isSavingInsurance}>
                                        {isInsuranceConnected ? "Хадгалах" : "Холбох"}
                                    </Button>
                                    {isInsuranceConnected && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={() => {
                                                setIsEditingInsurance(false)
                                                settingsForm.setValue("InsuranceLoginId", insuranceLoginId || "")
                                                settingsForm.setValue("InsurancePassword", "")
                                            }}
                                        >
                                            Цуцлах
                                        </Button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border border-border p-4">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h3 className="font-medium">И-Баримтын бүртгэл</h3>
                            <p className="text-sm text-muted-foreground">
                                Бүртгэлтэй эсэхийг тохируулна.
                            </p>
                        </div>
                        <Badge variant={settingsForm.watch("EBarimtRegistered") === "1" ? "default" : "secondary"}>
                            {settingsForm.watch("EBarimtRegistered") === "1" ? "Бүртгэлтэй" : "Бүртгэлгүй"}
                        </Badge>
                    </div>
                    <div className="mt-4 flex items-center gap-3 flex-wrap">
                        <FormField
                            control={settingsForm.control}
                            name="EBarimtRegistered"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Төлөв</FormLabel>
                                    <FormControl>
                                        <Switch
                                            checked={field.value === "1"}
                                            onCheckedChange={(checked) => field.onChange(checked ? "1" : "0")}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <span className="text-sm text-muted-foreground">
                            {settingsForm.watch("EBarimtRegistered") === "1" ? "Идэвхтэй" : "Идэвхгүй"}
                        </span>
                        <Button type="button" onClick={handleEbarimtSave} disabled={isSavingEbarimt}>
                            Хадгалах
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    )
}

export default CustomerSettings
