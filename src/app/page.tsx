"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Eye,
  EyeOff,
  Lock,
  Unlock,
  FileJson,
  LayoutDashboard,
  ArrowRight,
  Check,
  X,
  Zap,
  GitBranch,
  Layers,
  Settings,
  ChevronDown,
  ChevronRight,
  Sparkles,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type CabinetType = "postpaid" | "micro_prepaid" | "prepaid" | "full";

interface RouteConfig {
  path: string;
  label: string;
  allowed: boolean;
}

interface SectionConfig {
  id: string;
  label: string;
  visible: boolean;
}

interface UIElementConfig {
  id: string;
  label: string;
  visible: boolean;
  description: string;
}

interface CabinetSpec {
  key: CabinetType;
  title: string;
  subtitle: string;
  billingType: string;
  segment: string;
  routes: RouteConfig[];
  sections: SectionConfig[];
  uiElements: UIElementConfig[];
  image: string;
  accentColor: string;
  bgColor: string;
}

// ─── Cabinet Specifications (Tolya's concept) ────────────────────────────────

const CABINET_SPECS: CabinetSpec[] = [
  {
    key: "full",
    title: "Полный кабинет (демо)",
    subtitle: "Все возможности · Демонстрация конфига",
    billingType: "all",
    segment: "all",
    routes: [
      { path: "/dashboard", label: "Главная / Дашборд", allowed: true },
      { path: "/statistics", label: "Статистика", allowed: true },
      { path: "/services", label: "Услуги и тарифы", allowed: true },
      { path: "/payments", label: "Платежи и счета", allowed: true },
      { path: "/support", label: "Поддержка", allowed: true },
      { path: "/settings", label: "Настройки", allowed: true },
      { path: "/api-docs", label: "API-документация", allowed: true },
      { path: "/*", label: "Все остальные роуты", allowed: true },
    ],
    sections: [
      { id: "balance-widget", label: "Виджет баланса", visible: true },
      { id: "traffic-chart", label: "График трафика", visible: true },
      { id: "services-grid", label: "Сетка услуг", visible: true },
      { id: "payment-history", label: "История платежей", visible: true },
      { id: "notifications", label: "Уведомления", visible: true },
      { id: "quick-actions", label: "Быстрые действия", visible: true },
      { id: "promo-banner", label: "Промо-баннер", visible: true },
      { id: "tariff-details", label: "Детали тарифа", visible: true },
    ],
    uiElements: [
      { id: "btn-top-up", label: "Кнопка \u00ABПополнить\u00BB", visible: true, description: "Доступна и для постпейда (автопополнение), и для препейда" },
      { id: "btn-auto-pay", label: "Автоплатёж", visible: true, description: "Доступен на всех тарифах" },
      { id: "link-invoices", label: "Ссылка на счета", visible: true, description: "Показывается на постпейде, а на препейде — история платежей" },
      { id: "link-statistics", label: "Раздел статистики", visible: true, description: "Полная аналитика для всех типов кабинетов" },
      { id: "block-usage", label: "Блок потребления", visible: true, description: "Текущее потребление минут/ГБ/СМС + остаток пакета" },
      { id: "block-balance", label: "Блок баланса", visible: true, description: "Баланс и задолженность (постпейд) или остаток (препейд)" },
    ],
    image: null,
    accentColor: "bg-violet-600",
    bgColor: "bg-violet-50 border-violet-200",
  },
  {
    key: "postpaid",
    title: "Стандартный кабинет",
    subtitle: "Постпейд · Самозанятые / Бизнес",
    billingType: "postpaid",
    segment: "selfployt",
    routes: [
      { path: "/dashboard", label: "Главная / Дашборд", allowed: true },
      { path: "/statistics", label: "Статистика", allowed: true },
      { path: "/services", label: "Услуги и тарифы", allowed: true },
      { path: "/payments", label: "Платежи и счета", allowed: true },
      { path: "/support", label: "Поддержка", allowed: true },
      { path: "/settings", label: "Настройки", allowed: true },
      { path: "/api-docs", label: "API-документация", allowed: true },
      { path: "/*", label: "Все остальные роуты", allowed: true },
    ],
    sections: [
      { id: "balance-widget", label: "Виджет баланса", visible: true },
      { id: "traffic-chart", label: "График трафика", visible: true },
      { id: "services-grid", label: "Сетка услуг", visible: true },
      { id: "payment-history", label: "История платежей", visible: true },
      { id: "notifications", label: "Уведомления", visible: true },
      { id: "quick-actions", label: "Быстрые действия", visible: true },
      { id: "promo-banner", label: "Промо-баннер", visible: true },
      { id: "tariff-details", label: "Детали тарифа", visible: true },
    ],
    uiElements: [
      { id: "btn-top-up", label: "Кнопка «Пополнить»", visible: true, description: "Пополнение баланса не требуется — постпейд" },
      { id: "btn-auto-pay", label: "Автоплатёж", visible: true, description: "Настройка автосписания" },
      { id: "link-invoices", label: "Ссылка на счета", visible: true, description: "Просмотр и скачивание счетов" },
      { id: "link-statistics", label: "Раздел статистики", visible: true, description: "Полная аналитика по трафику и звонкам" },
      { id: "block-usage", label: "Блок потребления", visible: true, description: "Текущее потребление минут/ГБ/СМС" },
      { id: "block-balance", label: "Блок баланса", visible: true, description: "Текущий баланс и задолженность" },
    ],
    image: "/cabinets/cabinet_postpaid.png",
    accentColor: "bg-emerald-600",
    bgColor: "bg-emerald-50 border-emerald-200",
  },
  {
    key: "micro_prepaid",
    title: "Микробизнес Препейд",
    subtitle: "Препейд · Микробизнес",
    billingType: "prepaid",
    segment: "micro",
    routes: [
      { path: "/dashboard", label: "Главная / Дашборд", allowed: true },
      { path: "/statistics", label: "Статистика", allowed: false },
      { path: "/services", label: "Услуги и тарифы", allowed: true },
      { path: "/payments", label: "Платежи и счета", allowed: true },
      { path: "/support", label: "Поддержка", allowed: true },
      { path: "/settings", label: "Настройки", allowed: true },
      { path: "/api-docs", label: "API-документация", allowed: false },
      { path: "/*", label: "Все остальные роуты", allowed: false },
    ],
    sections: [
      { id: "balance-widget", label: "Виджет баланса", visible: true },
      { id: "traffic-chart", label: "График трафика", visible: false },
      { id: "services-grid", label: "Сетка услуг", visible: true },
      { id: "payment-history", label: "История платежей", visible: true },
      { id: "notifications", label: "Уведомления", visible: true },
      { id: "quick-actions", label: "Быстрые действия", visible: true },
      { id: "promo-banner", label: "Промо-баннер", visible: false },
      { id: "tariff-details", label: "Детали тарифа", visible: true },
    ],
    uiElements: [
      { id: "btn-top-up", label: "Кнопка «Пополнить»", visible: true, description: "Основное действие для препейда — пополнить баланс" },
      { id: "btn-auto-pay", label: "Автоплатёж", visible: false, description: "Не доступно на микробизнес-препейд" },
      { id: "link-invoices", label: "Ссылка на счета", visible: false, description: "Счета не формируются — предоплата" },
      { id: "link-statistics", label: "Раздел статистики", visible: false, description: "Статистика недоступна на этом тарифе" },
      { id: "block-usage", label: "Блок потребления", visible: true, description: "Остаток минут/ГБ/СМС" },
      { id: "block-balance", label: "Блок баланса", visible: true, description: "Текущий баланс на препейде" },
    ],
    image: "/cabinets/cabinet_micro_prepaid.png",
    accentColor: "bg-amber-600",
    bgColor: "bg-amber-50 border-amber-200",
  },
  {
    key: "prepaid",
    title: "Полноценный Препейд",
    subtitle: "Препейд · Самозанятые / Бизнес",
    billingType: "prepaid",
    segment: "selfployt",
    routes: [
      { path: "/dashboard", label: "Главная / Дашборд", allowed: true },
      { path: "/statistics", label: "Статистика", allowed: true },
      { path: "/services", label: "Услуги и тарифы", allowed: true },
      { path: "/payments", label: "Платежи и счета", allowed: true },
      { path: "/support", label: "Поддержка", allowed: true },
      { path: "/settings", label: "Настройки", allowed: true },
      { path: "/api-docs", label: "API-документация", allowed: true },
      { path: "/*", label: "Все остальные роуты", allowed: false },
    ],
    sections: [
      { id: "balance-widget", label: "Виджет баланса", visible: true },
      { id: "traffic-chart", label: "График трафика", visible: true },
      { id: "services-grid", label: "Сетка услуг", visible: true },
      { id: "payment-history", label: "История платежей", visible: true },
      { id: "notifications", label: "Уведомления", visible: true },
      { id: "quick-actions", label: "Быстрые действия", visible: true },
      { id: "promo-banner", label: "Промо-баннер", visible: true },
      { id: "tariff-details", label: "Детали тарифа", visible: true },
    ],
    uiElements: [
      { id: "btn-top-up", label: "Кнопка «Пополнить»", visible: true, description: "Основное действие — пополнение баланса" },
      { id: "btn-auto-pay", label: "Автоплатёж", visible: true, description: "Доступен автоплатёж через карту" },
      { id: "link-invoices", label: "Ссылка на счета", visible: false, description: "На препейде счета не нужны" },
      { id: "link-statistics", label: "Раздел статистики", visible: true, description: "Полная статистика доступна" },
      { id: "block-usage", label: "Блок потребления", visible: true, description: "Остаток пакета" },
      { id: "block-balance", label: "Блок баланса", visible: true, description: "Текущий баланс" },
    ],
    image: "/cabinets/cabinet_prepaid.png",
    accentColor: "bg-sky-600",
    bgColor: "bg-sky-50 border-sky-200",
  },
];

// ─── JSON Config Generator ──────────────────────────────────────────────────

function generateConfigJSON(spec: CabinetSpec): string {
  const config = {
    cabinetType: spec.key,
    billingType: spec.billingType,
    segment: spec.segment,
    meta: {
      title: spec.title,
      description: spec.subtitle,
    },
    routes: {
      allow: spec.routes.filter((r) => r.allowed).map((r) => r.path),
      deny: spec.routes.filter((r) => !r.allowed).map((r) => r.path),
    },
    sections: Object.fromEntries(
      spec.sections.map((s) => [s.id, { visible: s.visible, label: s.label }])
    ),
    ui: Object.fromEntries(
      spec.uiElements.map((u) => [u.id, { visible: u.visible, label: u.label }])
    ),
  };
  return JSON.stringify(config, null, 2);
}

// ─── Diff Component ─────────────────────────────────────────────────────────

function DiffIndicator({
  current,
  base,
  label,
}: {
  current: boolean;
  base: boolean;
  label: string;
}) {
  const isDiff = current !== base;
  return (
    <div
      className={`flex items-center gap-2 py-1.5 px-3 rounded-md text-sm transition-colors ${
        isDiff
          ? current
            ? "bg-green-50 text-green-800 border border-green-200"
            : "bg-red-50 text-red-800 border border-red-200"
          : "bg-muted/50 text-muted-foreground"
      }`}
    >
      {current ? (
        <Eye className="h-3.5 w-3.5 shrink-0" />
      ) : (
        <EyeOff className="h-3.5 w-3.5 shrink-0" />
      )}
      <span className="flex-1">{label}</span>
      {isDiff && (
        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
          {current ? "включено" : "скрыто"}
        </Badge>
      )}
    </div>
  );
}

// ─── Collapsible Section ────────────────────────────────────────────────────

function CollapsibleSection({
  title,
  icon,
  children,
  defaultOpen = false,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-4 py-3 text-left font-medium text-sm hover:bg-muted/50 transition-colors"
      >
        {icon}
        <span className="flex-1">{title}</span>
        {open ? (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
      {open && <div className="px-4 pb-4 space-y-2">{children}</div>}
    </div>
  );
}

// ─── Full Cabinet Preview (composite of all real widgets) ────────────────────

function FullCabinetPreview() {
  return (
    <div className="bg-white">
      {/* Sidebar */}
      <div className="flex">
        <div className="w-12 bg-slate-50 border-r flex flex-col items-center py-3 gap-4 shrink-0">
          {[
            { icon: "☰", label: "Меню" },
            { icon: "👤", label: "Профиль" },
            { icon: "🛒", label: "Корзина" },
            { icon: "📊", label: "Статистика" },
            { icon: "📁", label: "Файлы" },
            { icon: "⚙", label: "Настройки" },
            { icon: "✉", label: "Сообщения" },
          ].map((item) => (
            <Tooltip key={item.label}>
              <TooltipTrigger asChild>
                <div className="w-8 h-8 rounded-lg hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer text-sm">
                  {item.icon}
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs">{item.label}</TooltipContent>
            </Tooltip>
          ))}
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="bg-white border-b px-4 py-2.5 flex items-center gap-3">
            <span className="text-sm font-bold text-slate-800">ОАТС</span>
            <div className="flex-1" />
            <div className="flex items-center gap-3 text-slate-400">
              <span className="text-sm cursor-pointer hover:text-slate-600">🌙</span>
              <span className="text-sm cursor-pointer hover:text-slate-600">🔔</span>
              <div className="h-7 w-7 rounded-full bg-slate-200" />
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* "Ваша АТС" заголовок */}
            <h2 className="text-base font-bold text-slate-800">Ваша АТС</h2>

            {/* [Из Постпейд] Основные настройки АТС — прогресс */}
            <div className="border rounded-xl p-4 bg-white">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 shrink-0">
                  <svg viewBox="0 0 36 36" className="h-16 w-16 -rotate-90">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#facc15" strokeWidth="3" strokeDasharray="22 66" strokeLinecap="round" />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-slate-700">25%</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800">Основные настройки АТС</p>
                  <p className="text-[10px] text-slate-500">Осталось 3 шага</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3">
                {[
                  { label: "Подключить номера сотрудников", done: true },
                  { label: "Подключить многоканальные номера", done: false },
                  { label: "Создать маршрут", done: false },
                  { label: "Подключить запись звонков", done: false },
                ].map((step) => (
                  <div key={step.label} className="flex items-center gap-1.5 bg-slate-50 rounded-md px-2 py-1.5 text-[10px] text-slate-600 truncate">
                    {step.done ? (
                      <span className="text-green-500 shrink-0">✓</span>
                    ) : (
                      <span className="text-amber-500 shrink-0">+</span>
                    )}
                    <span className="truncate">{step.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* [Из Препейд] Номер телефона + Договор */}
            <div className="border rounded-xl p-4 bg-white flex items-center gap-4">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-green-500 text-xs">●</span>
                  <span className="text-[10px] text-slate-500">Номер телефона</span>
                  <span className="text-xs font-medium text-slate-800">(968) 181-14-10</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500">Договор</span>
                  <span className="text-xs font-medium text-slate-800">123456789</span>
                </div>
              </div>
              <button className="text-[10px] font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg">
                Настроить профиль
              </button>
            </div>

            {/* [Из Препейд] Стоимость в месяц */}
            <div className="border rounded-xl p-4 bg-sky-50 border-sky-200">
              <p className="text-[10px] text-sky-600">Стоимость в месяц</p>
              <p className="text-xl font-bold text-sky-800">600 ₽</p>
            </div>

            {/* [Из Постпейд] Стандартный пакет + "Открыть счета" */}
            <div className="border rounded-xl p-4 bg-white">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-800">Стандартный</span>
                  <Badge variant="outline" className="text-[9px]">Пакет</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <button className="text-[10px] font-medium text-slate-500 hover:text-slate-700">✏️</button>
                  <button className="text-[10px] font-medium text-white bg-amber-500 hover:bg-amber-600 px-2.5 py-1 rounded-md">
                    Открыть счета
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {[
                  { label: "Пакет", value: "3 490 ₽" },
                  { label: "Сверх пакета", value: "0 ₽" },
                  { label: "Итого", value: "3 490 ₽" },
                ].map((item) => (
                  <div key={item.label} className="text-center bg-slate-50 rounded-md py-2">
                    <p className="text-xs font-bold text-slate-800">{item.value}</p>
                    <p className="text-[9px] text-slate-500">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* [Из Постпейд] 20 номеров — прогресс использования */}
            <div className="border rounded-xl p-4 bg-white">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-slate-800">20 номеров</span>
                <span className="text-[10px] text-slate-500">из 20</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: "60%" }} />
              </div>
              <div className="grid grid-cols-2 gap-3 text-[10px]">
                <div>
                  <p className="text-slate-500 mb-1">Подключено</p>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-amber-400" />
                    <span className="text-slate-700">2 многоканальных номера</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="h-2 w-2 rounded-full bg-violet-400" />
                    <span className="text-slate-700">10 номеров сотрудников</span>
                  </div>
                </div>
                <div>
                  <p className="text-slate-500 mb-1">Осталось</p>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-slate-300" />
                    <span className="text-slate-400">2 многоканальных номера</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="h-2 w-2 rounded-full bg-slate-300" />
                    <span className="text-slate-400">0 номеров сотрудников</span>
                  </div>
                </div>
              </div>
            </div>

            {/* [Из Микро-препейд] Номера — "Входят в пакет" + "Купить" */}
            <div className="border rounded-xl p-4 bg-amber-50 border-amber-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-800">Номера</p>
                  <p className="text-[10px] text-slate-500">Входят в пакет</p>
                </div>
                <div className="text-right">
                  <button className="text-[10px] font-medium text-white bg-amber-500 hover:bg-amber-600 px-3 py-1.5 rounded-md">
                    Купить
                  </button>
                  <p className="text-[10px] text-amber-600 mt-1">20 номеров свободны</p>
                </div>
              </div>
            </div>

            {/* [Из Постпейд] Внешние SIP-номера */}
            <div className="border rounded-xl p-4 bg-white">
              <p className="text-sm font-semibold text-slate-800">Внешние SIP-номера</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Используйте свои номера других операторов связи</p>
              <button className="text-[10px] font-medium text-amber-600 hover:text-amber-700 mt-2 flex items-center gap-1">
                Смотрите, как это работает <span>»</span>
              </button>
            </div>

            {/* [Из Препейд] Статистика за сегодня */}
            <div className="border rounded-xl p-4 bg-white">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-slate-800">Статистика за сегодня</p>
                <button className="text-[10px] text-amber-600 hover:text-amber-700">Перейти к журналу звонков →</button>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {[
                  { label: "Всего входящих", value: "210", icon: "↓", color: "text-slate-700" },
                  { label: "Пропущено", value: "42", icon: "−", color: "text-red-500" },
                  { label: "Принято", value: "138", icon: "↓", color: "text-sky-600" },
                  { label: "Исходящих", value: "197", icon: "↑", color: "text-slate-700" },
                  { label: "Время разговоров", value: "23:08:37", icon: "⏱", color: "text-slate-700" },
                ].map((m) => (
                  <div key={m.label} className="text-center bg-slate-50 rounded-lg py-2 px-1">
                    <p className="text-[10px] text-slate-500 mb-0.5">{m.icon}</p>
                    <p className={`text-sm font-bold ${m.color}`}>{m.value}</p>
                    <p className="text-[8px] text-slate-400 mt-0.5 leading-tight">{m.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* [Из Препейд] Управление звонками */}
            <div className="border rounded-xl p-4 bg-white">
              <p className="text-sm font-semibold text-slate-800 mb-3">Управление звонками</p>
              <div className="space-y-2.5">
                {[
                  "Простая переадресация",
                  "Переадресация на несколько номеров",
                  "Черные и белые списки",
                  "Голосовая почта",
                ].map((feature) => (
                  <div key={feature} className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-600">{feature}</span>
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-7 rounded-full bg-slate-200 relative">
                        <div className="absolute left-0.5 top-0.5 h-3 w-3 rounded-full bg-white shadow" />
                      </div>
                      <span className="text-slate-400 text-xs">ℹ</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* [Из Препейд] Услуги */}
            <div className="border rounded-xl p-4 bg-white">
              <p className="text-sm font-semibold text-slate-800 mb-3">Услуги</p>
              <div className="space-y-2.5">
                {[
                  { name: "Запись разговора", active: true },
                  { name: "Ограничение вызовов", active: true },
                ].map((svc) => (
                  <div key={svc.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-green-500 text-xs">✓</span>
                      <span className="text-[11px] text-slate-600">{svc.name}</span>
                    </div>
                    <span className="text-slate-400 text-xs">⚙</span>
                  </div>
                ))}
                {/* Файлы — вложенный блок */}
                <div className="bg-slate-50 rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-green-500 text-xs">✓</span>
                    <div>
                      <p className="text-[11px] text-slate-600 font-medium">Файлы</p>
                      <p className="text-[9px] text-slate-400">Занято 0 ГБ из 1 ГБ</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <button className="text-[10px] text-amber-600">Файлы →</button>
                    <p className="text-[9px] text-slate-400">1 ГБ доступно</p>
                  </div>
                </div>
              </div>
            </div>

            {/* [Общий] Управление номерами — заголовок + вкладки */}
            <div>
              <h3 className="text-sm font-semibold text-slate-800 mb-2">Управление номерами</h3>
              <div className="flex gap-4 border-b mb-3">
                <button className="text-xs font-medium text-amber-600 border-b-2 border-amber-500 pb-1.5">
                  Номера сотрудников
                </button>
                <button className="text-xs font-medium text-slate-400 pb-1.5 hover:text-slate-600">
                  Многоканальные номера
                </button>
              </div>
              {/* Панель поиска */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1 flex items-center gap-2 bg-slate-50 border rounded-lg px-3 py-1.5">
                  <span className="text-slate-400 text-xs">🔍</span>
                  <span className="text-[11px] text-slate-400">Поиск</span>
                </div>
                <span className="text-[10px] text-slate-500 bg-slate-50 border rounded-lg px-2.5 py-1.5">Везде</span>
                <span className="text-slate-400 text-xs">🔽</span>
                <span className="text-slate-400 text-xs">⬇️ Импорт</span>
                <button className="text-[10px] font-medium text-white bg-amber-500 hover:bg-amber-600 px-3 py-1.5 rounded-lg">
                  + Номера сотрудников
                </button>
              </div>
              {/* Мини-таблица */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-slate-50 grid grid-cols-5 text-[9px] font-medium text-slate-500 px-3 py-1.5">
                  <span>Номер</span><span>Имя</span><span>Короткий</span><span>Статус SIP</span><span>Действия</span>
                </div>
                {[
                  { num: "(968) 181-14-10", name: "Иванов Иван", short: "201", sip: true },
                  { num: "(968) 181-14-11", name: "Петров Петр", short: "202", sip: true },
                  { num: "(985) 978-98-11", name: "Сидоров Сидор", short: "203", sip: false },
                ].map((row) => (
                  <div key={row.num} className="grid grid-cols-5 text-[10px] px-3 py-2 border-t">
                    <span className="font-mono text-slate-700">{row.num}</span>
                    <span className="text-slate-600">{row.name}</span>
                    <span className="font-mono text-slate-500">{row.short}</span>
                    <span>{row.sip ? <span className="text-green-500">●</span> : <span className="text-slate-300">●</span>}</span>
                    <span className="text-slate-400">⋯</span>
                  </div>
                ))}
              </div>
              {/* Пагинация */}
              <div className="flex items-center justify-between mt-2 text-[10px] text-slate-500">
                <span>Строк на странице: 10</span>
                <span>1-10 из 100</span>
                <div className="flex gap-1">
                  <span className="px-1.5 py-0.5 bg-slate-100 rounded">«</span>
                  <span className="px-1.5 py-0.5 bg-slate-100 rounded">‹</span>
                  <span className="px-1.5 py-0.5 bg-slate-100 rounded">›</span>
                  <span className="px-1.5 py-0.5 bg-slate-100 rounded">»</span>
                </div>
              </div>
            </div>

            {/* Source legend */}
            <div className="flex flex-wrap gap-2 pt-2">
              <Badge variant="outline" className="text-[9px] gap-1 bg-emerald-50 border-emerald-200 text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Постпейд
              </Badge>
              <Badge variant="outline" className="text-[9px] gap-1 bg-amber-50 border-amber-200 text-amber-700">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Микробизнес Препейд
              </Badge>
              <Badge variant="outline" className="text-[9px] gap-1 bg-sky-50 border-sky-200 text-sky-700">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-500" /> Полноценный Препейд
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function Page() {
  const [activeCabinet, setActiveCabinet] = useState<CabinetType>("postpaid");
  const [compareMode, setCompareMode] = useState(false);
  const [baseCabinet, setBaseCabinet] = useState<CabinetType>("postpaid");
  const [showConfig, setShowConfig] = useState(true);

  const currentSpec = useMemo(
    () => CABINET_SPECS.find((s) => s.key === activeCabinet)!,
    [activeCabinet]
  );
  const baseSpec = useMemo(
    () => CABINET_SPECS.find((s) => s.key === baseCabinet)!,
    [baseCabinet]
  );

  const configJson = useMemo(() => generateConfigJSON(currentSpec), [currentSpec]);

  // Compute detailed diff list & count
  const diffDetails = useMemo(() => {
    if (!compareMode) return [];
    const diffs: { category: string; id: string; label: string; currentVal: boolean; baseVal: boolean; jsonPath: string; currentLine: string; baseLine: string }[] = [];
    currentSpec.routes.forEach((r, i) => {
      const br = baseSpec.routes[i];
      if (!br || r.allowed !== br.allowed) {
        const path = `routes[${i}].allowed`;
        diffs.push({
          category: "routes",
          id: r.path,
          label: r.label,
          currentVal: r.allowed,
          baseVal: br?.allowed ?? false,
          jsonPath: path,
          currentLine: `  "${path}": ${r.allowed}`,
          baseLine: `  "${path}": ${br?.allowed ?? false}`,
        });
      }
    });
    currentSpec.sections.forEach((s, i) => {
      const bs = baseSpec.sections[i];
      if (!bs || s.visible !== bs.visible) {
        const path = `sections[${i}].visible`;
        diffs.push({
          category: "sections",
          id: s.id,
          label: s.label,
          currentVal: s.visible,
          baseVal: bs?.visible ?? false,
          jsonPath: path,
          currentLine: `  "${path}": ${s.visible},  // ${s.label}`,
          baseLine: `  "${path}": ${bs?.visible ?? false},  // ${bs?.label ?? s.label}`,
        });
      }
    });
    currentSpec.uiElements.forEach((u, i) => {
      const bu = baseSpec.uiElements[i];
      if (!bu || u.visible !== bu.visible) {
        const path = `uiElements[${i}].visible`;
        diffs.push({
          category: "uiElements",
          id: u.id,
          label: u.label,
          currentVal: u.visible,
          baseVal: bu?.visible ?? false,
          jsonPath: path,
          currentLine: `  "${path}": ${u.visible},  // ${u.label}`,
          baseLine: `  "${path}": ${bu?.visible ?? false},  // ${bu?.label ?? u.label}`,
        });
      }
    });
    return diffs;
  }, [currentSpec, baseSpec, compareMode]);

  const diffCount = diffDetails.length;

  return (
    <TooltipProvider delayDuration={300}>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
        {/* ── Header ── */}
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-slate-800 to-slate-600 flex items-center justify-center">
                <LayoutDashboard className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold leading-tight">
                  Прототип конфигурируемых кабинетов
                </h1>
                <p className="text-[11px] text-muted-foreground leading-tight">
                  Концепция Толи · Декларативная конфигурация UI
                </p>
              </div>
            </div>
            <div className="flex-1" />
            <Badge variant="outline" className="text-xs gap-1.5">
              <FileJson className="h-3 w-3" />
              Конфигурационный подход
            </Badge>
          </div>
        </header>

        {/* ── Main Content ── */}
        <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 py-6">
          {/* ── Concept Explanation ── */}
          <Card className="mb-6 border-2 border-dashed border-slate-300 bg-white">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-500" />
                <CardTitle className="text-base">Суть концепции</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Из транскрипции &laquo;ЛК ОАТС || Архитектура&raquo;, 26 июня 2026 г.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2 pb-4">
              <p>
                <strong className="text-foreground">Проблема:</strong> 800+ проверок{" "}
                <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
                  if (isPrepaid) / if (isSelfployt)
                </code>{" "}
                разбросаны по 244 файлам. Императивный подход не масштабируется —
                каждая новая конфигурация кабинета требует изменений в сотнях мест.
              </p>
              <p>
                <strong className="text-foreground">Решение:</strong> Единый
                конфигурационный файл (реестр фича-флагов), который декларативно
                определяет доступные роуты, видимые секции и UI-элементы для каждого
                типа кабинета. Аналогия — i18n файлы, но вместо переводов —
                условия отображения. Позже можно вынести в бэк-офис для менеджеров.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <Badge variant="secondary" className="text-xs gap-1">
                  <Layers className="h-3 w-3" /> Биллинг: Постпейд / Препейд / Контракт
                </Badge>
                <Badge variant="secondary" className="text-xs gap-1">
                  <GitBranch className="h-3 w-3" /> Сегмент: Самозанятые / Микробизнес / Бизнес
                </Badge>
                <Badge variant="secondary" className="text-xs gap-1">
                  <Settings className="h-3 w-3" /> Матрица: биллинг x сегмент = кабинет
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* ── Cabinet Selector ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {CABINET_SPECS.map((spec) => (
              <button
                key={spec.key}
                onClick={() => setActiveCabinet(spec.key)}
                className={`relative text-left p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md ${
                  activeCabinet === spec.key
                    ? `${spec.bgColor} shadow-sm ring-2 ring-offset-1 ring-slate-300`
                    : "bg-white border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      activeCabinet === spec.key ? spec.accentColor : "bg-slate-300"
                    }`}
                  />
                  <span className="font-semibold text-sm">{spec.title}</span>
                </div>
                <span className="text-xs text-muted-foreground">{spec.subtitle}</span>
                {activeCabinet === spec.key && (
                  <div className="absolute top-2 right-2">
                    <Check className={`h-5 w-5 ${spec.accentColor.replace("bg-", "text-")}`} />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* ── Controls Bar ── */}
          <div className="flex flex-wrap items-center gap-4 mb-6 bg-white rounded-xl border p-3">
            <div className="flex items-center gap-2">
              <Switch
                id="compare-mode"
                checked={compareMode}
                onCheckedChange={setCompareMode}
              />
              <label htmlFor="compare-mode" className="text-sm font-medium cursor-pointer">
                Режим сравнения
              </label>
            </div>

            {compareMode && (
              <>
                <Separator orientation="vertical" className="h-6" />
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Сравнить с:</span>
                  <div className="flex gap-1.5">
                    {CABINET_SPECS.filter((s) => s.key !== activeCabinet).map((spec) => (
                      <button
                        key={spec.key}
                        onClick={() => setBaseCabinet(spec.key)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          baseCabinet === spec.key
                            ? `${spec.accentColor} text-white`
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        {spec.title}
                      </button>
                    ))}
                  </div>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="text-xs cursor-help">
                      {diffCount} {diffCount === 1 ? "различие" : diffCount < 5 ? "различия" : "различий"}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    align="end"
                    className="max-w-[480px] p-0 !bg-white !text-slate-900 border border-slate-200 shadow-lg [&>svg]:hidden"
                  >
                    <div className="px-3 py-2.5">
                      <div className="text-xs font-semibold text-slate-900 mb-2">
                        {currentSpec.title} vs {baseSpec.title}
                      </div>
                      <div className="space-y-1.5 max-h-[340px] overflow-y-auto">
                        {diffDetails.map((d, idx) => (
                          <div
                            key={idx}
                            className="rounded-md bg-slate-50 border border-slate-200 px-2.5 py-2 text-[11px] space-y-1"
                          >
                            <div className="flex items-center gap-1.5">
                              <span
                                className={
                                  d.currentVal
                                    ? "inline-block h-2 w-2 rounded-full bg-emerald-500"
                                    : "inline-block h-2 w-2 rounded-full bg-red-500"
                                }
                              />
                              <span className="font-mono font-semibold text-slate-900">
                                {d.label}
                              </span>
                              <span className="text-slate-400 ml-auto font-mono text-[10px]">
                                {d.category}
                              </span>
                            </div>
                            <div className="font-mono leading-relaxed text-slate-800">
                              <span className="text-red-600 font-medium">− {d.baseLine}</span>
                            </div>
                            <div className="font-mono leading-relaxed text-slate-800">
                              <span className="text-emerald-700 font-medium">+ {d.currentLine}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </>
            )}

            <div className="flex-1" />

            <div className="flex items-center gap-2">
              <Switch
                id="show-config"
                checked={showConfig}
                onCheckedChange={setShowConfig}
              />
              <label htmlFor="show-config" className="text-sm text-muted-foreground cursor-pointer">
                Конфиг-файл
              </label>
            </div>
          </div>

          {/* ── Main Grid: Image + Config/Spec ── */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* ── Left: Cabinet Screenshot ── */}
            <div className={showConfig ? "xl:col-span-7" : "xl:col-span-12"}>
              <Card className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{currentSpec.title}</CardTitle>
                      <CardDescription className="text-xs mt-0.5">
                        {currentSpec.subtitle}
                      </CardDescription>
                    </div>
                    <Badge className={`${currentSpec.accentColor} text-white`}>
                      {currentSpec.billingType === "all" ? "Все возможности" : currentSpec.billingType === "postpaid" ? "Постпейд" : "Препейд"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {currentSpec.image ? (
                    <div className="relative bg-slate-100">
                      <img
                        src={currentSpec.image}
                        alt={currentSpec.title}
                        className="w-full h-auto"
                        loading="eager"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-black/70 text-white backdrop-blur-sm border-0 text-[11px]">
                          Дизайн-макет кабинета
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <FullCabinetPreview />
                  )}
                </CardContent>
              </Card>

              {/* ── Comparison: all cabinets side by side (mobile-friendly) ── */}
              <div className="mt-6">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Все варианты кабинетов
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {CABINET_SPECS.map((spec) => (
                    <button
                      key={spec.key}
                      onClick={() => setActiveCabinet(spec.key)}
                      className={`rounded-lg overflow-hidden border-2 transition-all duration-200 hover:shadow-md ${
                        activeCabinet === spec.key
                          ? "ring-2 ring-offset-1 ring-slate-400 border-slate-400"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="relative">
                        {spec.image ? (
                          <img
                            src={spec.image}
                            alt={spec.title}
                            className="w-full h-auto"
                            loading="lazy"
                          />
                        ) : (
                          <div className="bg-gradient-to-br from-violet-50 to-violet-100 h-40 flex flex-col items-center justify-center p-3">
                            <Sparkles className="h-8 w-8 text-violet-400 mb-2" />
                            <span className="text-[10px] text-violet-600 font-medium text-center">Все виджеты включены</span>
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-8">
                          <p className="text-white text-xs font-semibold">{spec.title}</p>
                          <p className="text-white/70 text-[10px]">{spec.subtitle}</p>
                        </div>
                        {activeCabinet === spec.key && (
                          <div className="absolute top-2 right-2">
                            <div className={`h-6 w-6 rounded-full ${spec.accentColor} flex items-center justify-center`}>
                              <Check className="h-3.5 w-3.5 text-white" />
                            </div>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Right: Config + Spec Details ── */}
            {showConfig && (
              <div className="xl:col-span-5 space-y-4">
                {/* ── Config JSON ── */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <FileJson className="h-4 w-4 text-amber-500" />
                      <CardTitle className="text-sm">cabinet-config.json</CardTitle>
                    </div>
                    <CardDescription className="text-[11px]">
                      Конфигурационный файл, управляющий отображением кабинета.
                      Измените тип кабинета, чтобы увидеть, как меняется файл.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="bg-slate-900 text-slate-100 p-4 overflow-x-auto max-h-[400px] overflow-y-auto">
                      <pre className="text-[11px] leading-relaxed font-mono">
                        <code>{configJson}</code>
                      </pre>
                    </div>
                  </CardContent>
                </Card>

                {/* ── Detailed Spec ── */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Детали конфигурации
                  </h3>

                  {/* Routes */}
                  <CollapsibleSection
                    title={`Роуты (${currentSpec.routes.filter((r) => r.allowed).length}/${currentSpec.routes.length} доступны)`}
                    icon={<GitBranch className="h-4 w-4 text-emerald-600" />}
                    defaultOpen={true}
                  >
                    {currentSpec.routes.map((route, i) => (
                      <div
                        key={route.path}
                        className={`flex items-center gap-2 py-1.5 px-3 rounded-md text-sm ${
                          compareMode
                            ? route.allowed !== baseSpec.routes[i].allowed
                              ? route.allowed
                                ? "bg-green-50 text-green-800 border border-green-200"
                                : "bg-red-50 text-red-800 border border-red-200"
                              : "bg-muted/50 text-muted-foreground"
                            : route.allowed
                            ? "text-foreground"
                            : "bg-muted/50 text-muted-foreground"
                        }`}
                      >
                        {route.allowed ? (
                          <Unlock className="h-3.5 w-3.5 text-green-600 shrink-0" />
                        ) : (
                          <Lock className="h-3.5 w-3.5 text-red-500 shrink-0" />
                        )}
                        <code className="text-xs font-mono flex-1 truncate">{route.path}</code>
                        <span className="text-xs opacity-70 shrink-0">{route.label}</span>
                      </div>
                    ))}
                  </CollapsibleSection>

                  {/* Sections */}
                  <CollapsibleSection
                    title={`Секции страницы (${currentSpec.sections.filter((s) => s.visible).length}/${currentSpec.sections.length} видимых)`}
                    icon={<Layers className="h-4 w-4 text-sky-600" />}
                    defaultOpen={true}
                  >
                    {currentSpec.sections.map((section, i) => (
                      <DiffIndicator
                        key={section.id}
                        current={section.visible}
                        base={compareMode ? baseSpec.sections[i].visible : section.visible}
                        label={section.label}
                      />
                    ))}
                  </CollapsibleSection>

                  {/* UI Elements */}
                  <CollapsibleSection
                    title={`UI-элементы (${currentSpec.uiElements.filter((u) => u.visible).length}/${currentSpec.uiElements.length} видимых)`}
                    icon={<Zap className="h-4 w-4 text-amber-600" />}
                    defaultOpen={false}
                  >
                    {currentSpec.uiElements.map((el, i) => (
                      <Tooltip key={el.id}>
                        <TooltipTrigger asChild>
                          <div>
                            <DiffIndicator
                              current={el.visible}
                              base={compareMode ? baseSpec.uiElements[i].visible : el.visible}
                              label={el.label}
                            />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="left" className="max-w-[250px] text-xs">
                          {el.description}
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </CollapsibleSection>
                </div>

                {/* ── Matrix Visualization ── */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <LayoutDashboard className="h-4 w-4" />
                      Матрица кабинетов
                    </CardTitle>
                    <CardDescription className="text-[11px]">
                      Биллинг-тип × Сегмент = Конфигурация кабинета
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-3">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 px-2 font-medium text-muted-foreground">
                              Биллинг \ Сегмент
                            </th>
                            <th className="text-center py-2 px-2 font-medium text-muted-foreground">
                              Самозанятые
                            </th>
                            <th className="text-center py-2 px-2 font-medium text-muted-foreground">
                              Микробизнес
                            </th>
                            <th className="text-center py-2 px-2 font-medium text-muted-foreground">
                              Бизнес
                            </th>
                          </tr>
                        </thead>
                        <tbody className="font-mono">
                          <tr className="border-b">
                            <td className="py-2 px-2 font-sans font-medium">Постпейд</td>
                            <td className="text-center py-2 px-2">
                              <Badge
                                className={`text-[10px] cursor-pointer transition-opacity ${
                                  activeCabinet === "postpaid"
                                    ? "opacity-100"
                                    : "opacity-60 hover:opacity-100"
                                } bg-emerald-600 text-white border-0`}
                                onClick={() => setActiveCabinet("postpaid")}
                              >
                                {activeCabinet === "postpaid" && <Check className="h-2.5 w-2.5 mr-1" />}
                                Постпейд
                              </Badge>
                            </td>
                            <td className="text-center py-2 px-2 text-muted-foreground">—</td>
                            <td className="text-center py-2 px-2 text-muted-foreground">—</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 px-2 font-sans font-medium">Препейд</td>
                            <td className="text-center py-2 px-2">
                              <Badge
                                className={`text-[10px] cursor-pointer transition-opacity ${
                                  activeCabinet === "prepaid"
                                    ? "opacity-100"
                                    : "opacity-60 hover:opacity-100"
                                } bg-sky-600 text-white border-0`}
                                onClick={() => setActiveCabinet("prepaid")}
                              >
                                {activeCabinet === "prepaid" && <Check className="h-2.5 w-2.5 mr-1" />}
                                Препейд
                              </Badge>
                            </td>
                            <td className="text-center py-2 px-2">
                              <Badge
                                className={`text-[10px] cursor-pointer transition-opacity ${
                                  activeCabinet === "micro_prepaid"
                                    ? "opacity-100"
                                    : "opacity-60 hover:opacity-100"
                                } bg-amber-600 text-white border-0`}
                                onClick={() => setActiveCabinet("micro_prepaid")}
                              >
                                {activeCabinet === "micro_prepaid" && (
                                  <Check className="h-2.5 w-2.5 mr-1" />
                                )}
                                Микро Препейд
                              </Badge>
                            </td>
                            <td className="text-center py-2 px-2 text-muted-foreground">—</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 px-2 font-sans font-medium">Контракт</td>
                            <td className="text-center py-2 px-2 text-muted-foreground">—</td>
                            <td className="text-center py-2 px-2 text-muted-foreground">—</td>
                            <td className="text-center py-2 px-2 text-muted-foreground">—</td>
                          </tr>
                          <tr className="bg-violet-50/50">
                            <td className="py-2 px-2 font-sans font-medium text-violet-700">Все (демо)</td>
                            <td colSpan={3} className="text-center py-2 px-2">
                              <Badge
                                className={`text-[10px] cursor-pointer transition-opacity gap-1 ${
                                  activeCabinet === "full"
                                    ? "opacity-100"
                                    : "opacity-60 hover:opacity-100"
                                } bg-violet-600 text-white border-0`}
                                onClick={() => setActiveCabinet("full")}
                              >
                                {activeCabinet === "full" && <Check className="h-2.5 w-2.5 mr-1" />}
                                <Sparkles className="h-2.5 w-2.5" />
                                Полный кабинет
                              </Badge>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {/* ── Benefits Card ── */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <ArrowRight className="h-4 w-4 text-emerald-600" />
                      Преимущества подхода
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-muted-foreground space-y-2">
                    <div className="flex gap-2">
                      <Check className="h-3.5 w-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span>
                        <strong className="text-foreground">Единая точка правки</strong> — вместо 244
                        файлов все условия в одном конфиге
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Check className="h-3.5 w-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span>
                        <strong className="text-foreground">Масштабируемость</strong> — новый тип кабинета
                        = новый файл конфигурации, без изменения кода
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Check className="h-3.5 w-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span>
                        <strong className="text-foreground">Автотесты</strong> — конфиг используется для
                        генерации тест-кейсов
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Check className="h-3.5 w-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span>
                        <strong className="text-foreground">Бэк-офис</strong> — конфиг можно вынести в
                        админку для менеджеров
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Check className="h-3.5 w-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span>
                        <strong className="text-foreground">Низкая когнитивная нагрузка</strong> —
                        разработчику не нужно вникать в логику if-else
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* ── Interactive Toggles: Direct Config Editing ── */}
          <div className="mt-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Интерактивная конфигурация
                </CardTitle>
                <CardDescription className="text-[11px]">
                  Переключайте элементы, чтобы увидеть, как конфигурационный файл
                  управляет отображением. Наведите на элемент, чтобы увидеть его описание.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Routes toggles */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                      Доступ к роутам
                    </h4>
                    {currentSpec.routes.map((route) => (
                      <div
                        key={route.path}
                        className="flex items-center justify-between gap-3 py-1.5"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {route.allowed ? (
                            <Unlock className="h-3.5 w-3.5 text-green-600 shrink-0" />
                          ) : (
                            <Lock className="h-3.5 w-3.5 text-red-400 shrink-0" />
                          )}
                          <span className="text-sm truncate">{route.label}</span>
                        </div>
                        <Badge
                          variant={route.allowed ? "default" : "outline"}
                          className="text-[10px] shrink-0"
                        >
                          {route.allowed ? "открыт" : "закрыт"}
                        </Badge>
                      </div>
                    ))}
                  </div>

                  {/* Sections toggles */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                      Секции страницы
                    </h4>
                    {currentSpec.sections.map((section) => (
                      <div
                        key={section.id}
                        className="flex items-center justify-between gap-3 py-1.5"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {section.visible ? (
                            <Eye className="h-3.5 w-3.5 text-green-600 shrink-0" />
                          ) : (
                            <EyeOff className="h-3.5 w-3.5 text-red-400 shrink-0" />
                          )}
                          <span className="text-sm truncate">{section.label}</span>
                        </div>
                        <Badge
                          variant={section.visible ? "default" : "outline"}
                          className="text-[10px] shrink-0"
                        >
                          {section.visible ? "видима" : "скрыта"}
                        </Badge>
                      </div>
                    ))}
                  </div>

                  {/* UI Elements toggles */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                      UI-элементы
                    </h4>
                    {currentSpec.uiElements.map((el) => (
                      <Tooltip key={el.id}>
                        <TooltipTrigger asChild>
                          <div className="flex items-center justify-between gap-3 py-1.5 cursor-default">
                            <div className="flex items-center gap-2 min-w-0">
                              {el.visible ? (
                                <Eye className="h-3.5 w-3.5 text-green-600 shrink-0" />
                              ) : (
                                <EyeOff className="h-3.5 w-3.5 text-red-400 shrink-0" />
                              )}
                              <span className="text-sm truncate">{el.label}</span>
                            </div>
                            <Badge
                              variant={el.visible ? "default" : "outline"}
                              className="text-[10px] shrink-0"
                            >
                              {el.visible ? "вкл" : "выкл"}
                            </Badge>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="left" className="max-w-[220px] text-xs">
                          {el.description}
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>

        {/* ── Footer ── */}
        <footer className="border-t bg-white mt-auto">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>Прототип на основе концепции Анатолия Тукова · 26.06.2026</span>
            <span>ЛК ОАТС · Архитектура фронтенда</span>
          </div>
        </footer>
      </div>
    </TooltipProvider>
  );
}