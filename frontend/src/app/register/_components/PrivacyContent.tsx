 "use client";

import { useTranslation } from "react-i18next";

export function PrivacyContent() {
    const { t } = useTranslation("common");

    return (
        <span
            className="text-sm"
            dangerouslySetInnerHTML={{ __html: t("privacy.content") }}
        />
    );
}
