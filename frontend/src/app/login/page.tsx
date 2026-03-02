"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Field,
    FieldContent,
    FieldError,
    FieldLabel,
    FieldSet,
    FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api, getApiErrorMessage } from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";
import type { User } from "@/stores/auth-store";
import { EyeIcon, EyeOffIcon } from "lucide-react";




const loginSchema = z.object({
    email: z.string().min(1, "login.validation.emailRequired").email("login.validation.emailInvalid"),
    password: z.string().min(1, "login.validation.passwordRequired"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const { t } = useTranslation("common");
    const setAuth = useAuthStore((s) => s.setAuth);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [passwordVisibility, setPasswordVisibility] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
    });

    const togglePasswordVisibility = () => {
        setPasswordVisibility(!passwordVisibility);
    };


    const onSubmit = async (values: LoginFormValues) => {
        setSubmitError(null);
        try {
            const result = await api.post<{
                token?: string;
                userId?: string;
                email?: string;
                message?: string;
            }>("/api/auth/login", values);
            if (result?.token && result?.userId != null && result?.email != null) {
                const user: User = {
                    id: result.userId,
                    email: result.email,
                    name: result.email,
                    role: "USER",
                    point: 0,
                };
                setAuth(result.token, user);
                router.push("/");
            } else {
                setSubmitError(result?.message ?? t("login.error"));
            }
        } catch (err) {
            const keyOrMsg = getApiErrorMessage(err);
            setSubmitError(keyOrMsg ? t(keyOrMsg) : t("login.error"));
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <FieldSet className="flex flex-col w-2/3 max-w-md gap-4 mx-auto">
                <FieldTitle className="text-center text-2xl font-bold">{t("login.title")}</FieldTitle>

                {submitError && (
                    <p className="text-sm text-destructive text-center" role="alert">
                        {submitError}
                    </p>
                )}

                <Field>
                    <FieldLabel htmlFor="email">{t("login.email")}</FieldLabel>
                    <FieldContent>
                        <Input
                            id="email"
                            type="email"
                            autoComplete="email"
                            {...register("email")}
                            aria-invalid={!!errors.email}
                        />
                    </FieldContent>
                    {errors.email?.message && (
                        <FieldError>{t(errors.email.message as string)}</FieldError>
                    )}
                </Field>

                <Field>
                    <FieldLabel htmlFor="password">{t("login.password")}</FieldLabel>
                    <FieldContent className="relative">
                        <Input
                            id="password"
                            type={passwordVisibility ? "text" : "password"}
                            autoComplete="current-password"
                            className="pr-10"
                            {...register("password")}
                            aria-invalid={!!errors.password}
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            type="button"
                            className="absolute right-0 top-1/2 size-9 -translate-y-1/2"
                            onClick={togglePasswordVisibility}
                            aria-label={passwordVisibility ? t("login.hidePassword") : t("login.showPassword")}
                        >
                            {passwordVisibility ? <EyeIcon className="size-4" /> : <EyeOffIcon className="size-4" />}
                        </Button>
                    </FieldContent>
                    {errors.password?.message && (
                        <FieldError>{t(errors.password.message as string)}</FieldError>
                    )}
                </Field>

                <Button className="w-1/2 mx-auto" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? t("login.submitting") : t("login.button")}
                </Button>
                <Button
                    className="w-1/2 mx-auto"
                    variant="secondary"
                    type="button"
                    onClick={() => router.push("/register")}
                >
                    {t("login.registerButton")}
                </Button>
            </FieldSet>
        </form>
    );
}
