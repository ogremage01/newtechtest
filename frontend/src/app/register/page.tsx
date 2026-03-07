"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next"
import { Field, FieldContent, FieldError, FieldLabel, FieldSet, FieldTitle } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { api, getApiErrorMessage } from "@/lib/api";
import { useRouter } from "next/navigation";
import { TermsContent } from "./_components/TermsContent";
import { PrivacyContent } from "./_components/PrivacyContent";


/** 회원가입 요청 스키마. optinal=선택 입력 사항 */
const registerSchema = z
    .object({
        name: z.string().min(1, "register.validation.nameRequired"),
        email: z.string().min(1, "register.validation.emailRequired").email("register.validation.emailInvalid"),
        password: z.string().min(1, "register.validation.passwordRequired"),
        passwordConfirm: z.string().min(1, "register.validation.passwordConfirmRequired"),
        address: z.string().optional(),
        phone: z.string().optional(),
        termsAgreed: z.boolean(),
        privacyAgreed: z.boolean(),
    })
    .refine((data) => data.password === data.passwordConfirm, {
        message: "register.validation.passwordNotMatch",
        path: ["passwordConfirm"],
    });

/** 회원가입 폼 값 타입 */
type RegisterFormValues = z.infer<typeof registerSchema>;

/** 필수 입력 필드 (라벨 * 표시용). 검증은 registerSchema에서 함 */
const REGISTER_REQUIRED = new Set<keyof RegisterFormValues>(["name", "email", "password", "passwordConfirm"]);

export default function RegisterPage() {
    const { t } = useTranslation("common");
    const router = useRouter();
    const [passwordVisibility, setPasswordVisibility] = useState(false);
    const [passwordConfirmVisibility, setPasswordConfirmVisibility] = useState(false);
    const togglePasswordVisibility = () => {
        setPasswordVisibility(!passwordVisibility);
    };
    const togglePasswordConfirmVisibility = () => {
        setPasswordConfirmVisibility(!passwordConfirmVisibility);
    };
    const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<RegisterFormValues>({
        defaultValues: { name: "", email: "", password: "", passwordConfirm: "", address: "", phone: "" },
        resolver: zodResolver(registerSchema),
    });
    const password = watch("password");
    const passwordConfirm = watch("passwordConfirm");
    const showPasswordMatchHint = password.length > 0 && passwordConfirm.length > 0;
    const passwordMatch = password === passwordConfirm;

    const onSubmit = async (data: RegisterFormValues) => {
        try {
            await api.post("/api/auth/register", data);
            alert(t("register.success"));
            router.push("/login");
        } catch (err) {
            const keyOrMsg = getApiErrorMessage(err);
            alert(keyOrMsg ? t(keyOrMsg) : t("register.error"));
        }
    };

    return (

        <>
            <form className="w-full h-full" onSubmit={handleSubmit(onSubmit)} noValidate>
                <FieldSet className="flex flex-col w-2/3 max-w-md gap-4 mx-auto">
                    <FieldTitle className="text-center text-2xl font-bold">{t("register.title")}</FieldTitle>

                    <Field>
                        <FieldLabel htmlFor="name">
                            {t("register.name")}
                            {REGISTER_REQUIRED.has("name") && <span className="text-red-500 text-sm ml-0.5">{t("register.mustType")}</span>}
                        </FieldLabel>
                        <FieldContent>
                            <Input id="name" type="text" {...register("name")} aria-invalid={!!errors.name} />
                        </FieldContent>
                        {errors.name?.message && <FieldError>{t(errors.name.message)}</FieldError>}
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="email">
                            {t("register.email")}
                            {REGISTER_REQUIRED.has("email") && <span className="text-red-500 text-sm ml-0.5">{t("register.mustType")}</span>}
                        </FieldLabel>
                        <FieldContent>
                            <Input id="email" type="email" {...register("email")} aria-invalid={!!errors.email} />
                        </FieldContent>
                        {errors.email?.message && <FieldError>{t(errors.email.message)}</FieldError>}
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="password">
                            {t("register.password")}
                            {REGISTER_REQUIRED.has("password") && <span className="text-red-500 text-sm ml-0.5">{t("register.mustType")}</span>}
                        </FieldLabel>
                        <FieldContent className="relative">
                            <Input
                                id="password"
                                type={passwordVisibility ? "text" : "password"}
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
                                {passwordVisibility ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
                            </Button>
                        </FieldContent>
                        {errors.password?.message && <FieldError>{t(errors.password.message)}</FieldError>}
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="passwordConfirm">
                            {t("register.passwordConfirm")}
                            {REGISTER_REQUIRED.has("passwordConfirm") && <span className="text-red-500 text-sm ml-0.5">{t("register.mustType")}</span>}
                        </FieldLabel>
                        <FieldContent className="relative">
                            <Input
                                id="passwordConfirm"
                                type={passwordConfirmVisibility ? "text" : "password"}
                                {...register("passwordConfirm")}
                                aria-invalid={!!errors.passwordConfirm}
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                type="button"
                                className="absolute right-0 top-1/2 size-9 -translate-y-1/2"
                                onClick={togglePasswordConfirmVisibility}
                                aria-label={passwordConfirmVisibility ? t("login.hidePassword") : t("login.showPassword")}
                            >
                                {passwordConfirmVisibility ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
                            </Button>
                        </FieldContent>
                        {showPasswordMatchHint ? (
                            <p className={passwordMatch ? "text-sm text-green-600" : "text-sm text-red-600"} role="status">
                                {t(passwordMatch ? "register.validation.passwordMatch" : "register.validation.passwordNotMatch")}
                            </p>
                        ) : errors.passwordConfirm?.message ? (
                            <FieldError>{t(errors.passwordConfirm.message)}</FieldError>
                        ) : null}
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="address">{t("register.address")}</FieldLabel>
                        <FieldContent>
                            <Input id="address" type="text" {...register("address")} aria-invalid={!!errors.address} />
                        </FieldContent>
                        {errors.address?.message && <FieldError>{t(errors.address.message)}</FieldError>}
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="phone">{t("register.phone")}</FieldLabel>
                        <FieldContent>
                            <Input id="phone" type="text" {...register("phone")} aria-invalid={!!errors.phone} />
                        </FieldContent>
                        {errors.phone?.message && <FieldError>{t(errors.phone.message)}</FieldError>}
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="termsAgreed">{t("register.termsAgreed")}</FieldLabel>
                        <FieldContent>
                            <Input id="termsAgreed" type="checkbox" {...register("termsAgreed")} aria-invalid={!!errors.termsAgreed} />
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="link" className="text-sm text-center text-blue-500 hover:underline">
                                        {t("register.termsOfService")}
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>{t("terms.title")}</DialogTitle>
                                    </DialogHeader>
                                    <DialogDescription>
                                        <TermsContent />
                                    </DialogDescription>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant="secondary">{t("common.confirm")}</Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </FieldContent>
                        {errors.termsAgreed?.message && <FieldError>{t(errors.termsAgreed.message)}</FieldError>}
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="privacyAgreed">{t("register.privacyAgreed")}</FieldLabel>
                        <FieldContent>
                            <Input id="privacyAgreed" type="checkbox" {...register("privacyAgreed")} aria-invalid={!!errors.privacyAgreed} />
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="link" className="text-sm text-center text-blue-500 hover:underline">
                                        {t("register.privacyPolicy")}
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>{t("privacy.title")}</DialogTitle>
                                    </DialogHeader>
                                    <DialogDescription>
                                        <PrivacyContent />
                                    </DialogDescription>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant="secondary">{t("common.confirm")}</Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </FieldContent>
                        {errors.privacyAgreed?.message && <FieldError>{t(errors.privacyAgreed.message)}</FieldError>}
                    </Field>

                    <Button className="w-1/2 mx-auto" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? t("register.submitting") : t("register.button")}
                    </Button>
                </FieldSet>
            </form>
            <a className="text-sm text-center text-blue-500 hover:underline" href="/login">{t("register.haveAccount")}</a>
        </>
    );
}
