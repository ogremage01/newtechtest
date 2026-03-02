import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AuthButtons() {
    const { t } = useTranslation("common");
    const { isAuthenticated, logout } = useAuthStore();
    const router = useRouter();
    const login = () => {
        router.push("/login");
    };

    return (
        <div className="flex items-center gap-2">
            {isAuthenticated ? (
                <Button variant="outline" size="sm" onClick={logout}>
                    {t("nav.logout")}
                </Button>
            ) : (
                <Button variant="outline" size="sm" onClick={login}>
                    {t("nav.login")}
                </Button>
            )}
        </div>
    );
}