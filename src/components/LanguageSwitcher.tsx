import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { LANGUAGES } from "@/i18n";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = { className?: string };

const LanguageSwitcher = ({ className }: Props) => {
  const { i18n, t } = useTranslation();
  const current =
    LANGUAGES.find((l) => i18n.language?.startsWith(l.code)) ?? LANGUAGES[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={className}
          aria-label={t("language.choose")}
        >
          <span className="text-lg leading-none">{current.flag}</span>
          <span className="ml-1 text-xs font-medium uppercase">{current.code}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel>{t("language.label")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => i18n.changeLanguage(lang.code)}
            className="gap-2 cursor-pointer"
          >
            <span className="text-lg leading-none">{lang.flag}</span>
            <span className={lang.code === current.code ? "font-semibold" : ""}>
              {lang.label}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
