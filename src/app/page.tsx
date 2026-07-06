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

// ─── Full Cabinet Preview (composite) ───────────────────────────────────────

function FullCabinetPreview() {
  return (
    <div className="bg-gradient-to-b from-slate-50 to-white p-0">
      {/* Simulated header bar */}
      <div className="bg-slate-800 text-white px-4 py-2.5 flex items-center gap-3">
        <div className="h-6 w-6 rounded bg-violet-500 flex items-center justify-center">
          <LayoutDashboard className="h-3.5 w-3.5 text-white" />
        </div>
        <span className="text-sm font-medium">Личный кабинет</span>
        <div className="flex-1" />
        <Badge className="bg-violet-500 text-white border-0 text-[10px] gap-1">
          <Sparkles className="h-3 w-3" /> Все возможности
        </Badge>
      </div>

      <div className="p-4 space-y-3">
        {/* Balance + Usage row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
            <p className="text-[10px] text-emerald-600 font-medium uppercase tracking-wider mb-1">Баланс</p>
            <p className="text-lg font-bold text-emerald-800">12 450 ₽</p>
            <p className="text-[10px] text-emerald-600/70 mt-0.5">Задолженность: 0 ₽</p>
          </div>
          <div className="bg-sky-50 border border-sky-200 rounded-lg p-3">
            <p className="text-[10px] text-sky-600 font-medium uppercase tracking-wider mb-1">Потребление</p>
            <div className="grid grid-cols-3 gap-1 mt-1">
              <div className="text-center">
                <p className="text-sm font-bold text-sky-800">87</p>
                <p className="text-[9px] text-sky-500">мин</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-sky-800">4.2</p>
                <p className="text-[9px] text-sky-500">ГБ</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-sky-800">23</p>
                <p className="text-[9px] text-sky-500">СМС</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: "Пополнить", color: "bg-amber-100 text-amber-700 border-amber-200" },
            { label: "Автоплатёж", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
            { label: "Счета", color: "bg-sky-100 text-sky-700 border-sky-200" },
            { label: "Статистика", color: "bg-violet-100 text-violet-700 border-violet-200" },
          ].map((action) => (
            <div
              key={action.label}
              className={`rounded-lg border p-2 text-center text-[10px] font-medium ${action.color}`}
            >
              {action.label}
            </div>
          ))}
        </div>

        {/* Traffic chart placeholder */}
        <div className="bg-white border border-slate-200 rounded-lg p-3">
          <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-2">График трафика</p>
          <div className="h-20 flex items-end gap-1.5 px-2">
            {[40, 65, 45, 80, 55, 70, 90, 60, 75, 50, 85, 95].map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-gradient-to-t from-violet-400 to-violet-200 rounded-t-sm"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>

        {/* Promo banner */}
        <div className="bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg p-3 text-white">
          <p className="text-[10px] font-medium opacity-80">Промо-акция</p>
          <p className="text-xs font-bold">Подключите автоплатёж и получите +500 ₽ на счёт</p>
        </div>

        {/* Services grid */}
        <div className="bg-white border border-slate-200 rounded-lg p-3">
          <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-2">Услуги и тарифы</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { name: "Тариф «Оптимальный»", price: "590 ₽/мес", active: true },
              { name: "Доп. пакет минут", price: "200 ₽", active: true },
              { name: "Доп. пакет ГБ", price: "150 ₽", active: true },
              { name: "API-доступ", price: "Бесплатно", active: true },
            ].map((svc) => (
              <div key={svc.name} className="flex items-center justify-between bg-slate-50 rounded-md px-2.5 py-1.5">
                <span className="text-[10px] text-slate-700">{svc.name}</span>
                <Badge variant="outline" className="text-[9px] px-1 py-0 text-green-600 border-green-200 bg-green-50">
                  {svc.price}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Payment history */}
        <div className="bg-white border border-slate-200 rounded-lg p-3">
          <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-2">История платежей</p>
          {[
            { date: "26.06.2026", desc: "Пополнение", amount: "+1 000 ₽", color: "text-green-600" },
            { date: "20.06.2026", desc: "Абонентская плата", amount: "-590 ₽", color: "text-red-500" },
            { date: "15.06.2026", desc: "Пополнение", amount: "+2 000 ₽", color: "text-green-600" },
          ].map((p) => (
            <div key={p.date + p.desc} className="flex items-center justify-between py-1 border-b border-slate-50 last:border-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground">{p.date}</span>
                <span className="text-[10px]">{p.desc}</span>
              </div>
              <span className={`text-[10px] font-medium ${p.color}`}>{p.amount}</span>
            </div>
          ))}
        </div>

        {/* Legend badge */}
        <div className="text-center">
          <Badge variant="outline" className="text-[10px] gap-1 bg-violet-50 border-violet-200 text-violet-700">
            <Sparkles className="h-3 w-3" />
            Все виджеты всех кабинетов активны в cabinet-config.json
          </Badge>
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

  // Count differences
  const diffCount = useMemo(() => {
    if (!compareMode) return 0;
    let count = 0;
    currentSpec.sections.forEach((s, i) => {
      if (s.visible !== baseSpec.sections[i].visible) count++;
    });
    currentSpec.uiElements.forEach((u, i) => {
      if (u.visible !== baseSpec.uiElements[i].visible) count++;
    });
    currentSpec.routes.forEach((r, i) => {
      if (r.allowed !== baseSpec.routes[i].allowed) count++;
    });
    return count;
  }, [currentSpec, baseSpec, compareMode]);

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
                <Badge variant="outline" className="text-xs">
                  {diffCount} {diffCount === 1 ? "различие" : diffCount < 5 ? "различия" : "различий"}
                </Badge>
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