"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CalendarDays, Check, X } from "lucide-react"; // Import icons

interface EndScreenProps {
  type: "success" | "failure";
  message?: string;
  onRetry?: () => void;
}

// 1. Your Google Calendar ICS Link
const GOOGLE_ICS_URL = import.meta.env.PUBLIC_GOOGLE_ICS_URL;

export function EndScreen({ type, message, onRetry }: EndScreenProps) {
  // 2. Helper to generate subscription links
  const getCalendarLinks = () => {
    const webcalUrl = GOOGLE_ICS_URL.replace(/^https?:\/\//, "webcal://");
    const encodedUrl = encodeURIComponent(GOOGLE_ICS_URL);
    const encodedWebcal = encodeURIComponent(webcalUrl);

    return {
      google: `https://calendar.google.com/calendar/render?cid=${encodedWebcal}`,
      apple: webcalUrl,
      outlook: `https://outlook.live.com/calendar/0/addcalendar?url=${encodedWebcal}`,
      office365: `https://outlook.office.com/calendar/0/addcalendar?url=${encodedWebcal}`,
    };
  };

  const links = getCalendarLinks();

  // Failure State
  if (type === "failure") {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center space-y-6 animate-in fade-in zoom-in duration-300">
        <div className="rounded-full bg-red-500/20 p-4 border border-red-500/50">
          <X className="h-12 w-12 text-red-400" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-pixelated text-red-400">Помилка</h2>
          <p className="text-brand-light max-w-md">
            {message || "Щось пішло не так. Спробуйте ще раз."}
          </p>
        </div>
        {onRetry && (
          <Button variant="destructive" onClick={onRetry} className="mt-4">
            Спробувати ще раз
          </Button>
        )}
      </div>
    );
  }

  // Success State
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-6 animate-in fade-in zoom-in duration-300">
      <div className="rounded-full bg-green-500/20 p-4 border border-green-500/50">
        <Check className="h-12 w-12 text-green-400" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-pixelated text-green-400">Успіх!</h2>
        <p className="text-brand-light max-w-md">
          {message ||
            "Дякуємо за реєстрацію! Перевіряй пошту/Telegram для отримання подальших інструкцій."}
        </p>

        {/* Custom Calendar Dropdown */}
        <div className="pt-4">
          <p className="text-sm text-muted-foreground mb-2">
            Хочеш додати події до календаря?
          </p>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 min-w-[200px]">
                <CalendarDays className="h-4 w-4" />
                Підписатися на календар
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-[200px]">
              <DropdownMenuItem asChild>
                <a
                  href={links.google}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer w-full"
                >
                  Google Calendar
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href={links.apple} className="cursor-pointer w-full">
                  Apple Calendar (iOS/Mac)
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a
                  href={links.outlook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer w-full"
                >
                  Outlook.com
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a
                  href={links.office365}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer w-full"
                >
                  Microsoft 365 (Business)
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <a
        href="/"
        className="mt-4 cursor-pointer text-sm hover:underline opacity-70"
      >
        На головну
      </a>
    </div>
  );
}
