"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import { LoginFormValues, Roles } from "@/types/auth.types";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "../ui/input-group";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../auth-provider";

const roleOptions: { value: Roles; label: string }[] = [
    { value: Roles.ACCOUNTANT, label: "Нягтлан бодогч" },
    { value: Roles.SYSTEM_ADMIN, label: "Системийн админ" },
    { value: Roles.DIRECTOR, label: "Захирал" },
    { value: Roles.EMPLOYEE, label: "Ажилчин" },
];


export function LoginForm({
    className,
    redirectTo,
    ...props
}: React.ComponentProps<"div"> & { redirectTo?: string }) {
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { login } = useAuth();

    const {
        control,
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        defaultValues: {
            role: roleOptions[0].value,
            userId: "",
            password: "",
        },
    });

    const onSubmit = async (data: LoginFormValues) => {
        try {
            setErrorMessage(null);
            const response = await login(data);
            if (!response.isOk) {
                setErrorMessage(response?.error || "Нэвтрэх нэр эсвэл нууц үг буруу байна.");
                return;
            }

            if (redirectTo) {
                window.location.href = redirectTo;
            } else {
                window.location.href = "/dashboard";
            }
        } catch (error) {
            console.error("Login failed", error)
            setErrorMessage("Нэвтрэх үйлдэл амжилтгүй боллоо.");
        }
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Сайн байна уу.</CardTitle>
                    <CardDescription>Системд тавтай морилно уу.</CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <FieldGroup className="gap-4">
                            {/* ROLE */}
                            <Field className="gap-1">
                                <FieldLabel>Role</FieldLabel>
                                <Controller
                                    name="role"
                                    control={control}
                                    rules={{ required: "Role сонгоно уу" }}
                                    render={({ field }) => (
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger className="w-full" aria-invalid={!!errors.role}>
                                                <SelectValue placeholder="Role" />
                                            </SelectTrigger>
                                            <SelectContent position="popper">
                                                {roleOptions.map((item) => (
                                                    <SelectItem
                                                        key={item.value}
                                                        value={item.value}
                                                    >
                                                        {item.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.role && (
                                    <FieldDescription className="text-destructive">
                                        {errors.role.message}
                                    </FieldDescription>
                                )}
                            </Field>

                            {/* USER ID */}
                            <Field className="gap-1">
                                <FieldLabel htmlFor="userId">Нэвтрэх нэр</FieldLabel>
                                <Input
                                    id="userId"
                                    aria-invalid={!!errors.userId}
                                    placeholder="Нэвтрэх нэр"
                                    {...register("userId", {
                                        required: "Нэвтрэх нэр заавал",
                                    })}
                                />
                                {errors.userId && (
                                    <FieldDescription className="text-destructive">
                                        {errors.userId.message}
                                    </FieldDescription>
                                )}
                            </Field>

                            {/* PASSWORD */}
                            <Field className="gap-1">
                                <div className="flex items-center">
                                    <FieldLabel htmlFor="password">Нууц үг</FieldLabel>
                                    <a
                                        href="#"
                                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                    >
                                        Нууц үг мартсан
                                    </a>
                                </div>
                                <InputGroup>
                                    <InputGroupInput
                                        id="password"
                                        placeholder="Нууц үг"
                                        type={showPassword ? "text" : "password"}
                                        {...register("password", {
                                            required: "Нууц үг заавал",
                                            minLength: {
                                                value: 3,
                                                message: "Хамгийн багадаа 3 тэмдэгт",
                                            },
                                        })}
                                        aria-invalid={errors.password ? true : false}
                                    />
                                    <InputGroupAddon align="inline-end">
                                        <InputGroupButton
                                            aria-label="Нууц үг харах"
                                            title="Нууц үг харах"
                                            size="icon-xs"
                                            onClick={() => {
                                                setShowPassword(prev => !prev)
                                            }}
                                        >
                                            {showPassword ? <EyeOff /> : <Eye />}
                                        </InputGroupButton>
                                    </InputGroupAddon>
                                </InputGroup>
                                {errors.password && (
                                    <FieldDescription className="text-destructive">
                                        {errors.password.message}
                                    </FieldDescription>
                                )}
                            </Field>

                            {/* SUBMIT */}
                            <Field>
                                <Button
                                    type="submit"
                                    className="w-full mt-4"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Нэвтэрч байна..." : "Нэвтрэх"}
                                </Button>
                                {
                                    errorMessage && (
                                        <FieldDescription className="text-destructive">
                                            {errorMessage}
                                        </FieldDescription>
                                    )
                                }
                            </Field>

                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
