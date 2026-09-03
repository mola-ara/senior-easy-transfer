"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronRight,
  History,
  Home,
  Heart,
  Volume2,
  X,
} from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useAppStore } from "@/store/app-store";

export function AppShell({ children }: { children: ReactNode }) {
  const { settings } = useAppStore();
  return (
    <div className={settings.largeText ? "app large-text" : "app"}>
      {children}
    </div>
  );
}

export function Header({
  backHref,
  title = "바다송금",
  cancel = false,
}: {
  backHref?: string;
  title?: string;
  cancel?: boolean;
}) {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        {backHref ? (
          <Link href={backHref} className="icon-link" aria-label="이전 화면">
            <ArrowLeft />
            <span>이전</span>
          </Link>
        ) : (
          <Link href="/" className="brand">
            <span className="brand-mark">바</span>
            {title}
          </Link>
        )}
        {backHref && <strong className="topbar-title">{title}</strong>}
        {cancel ? (
          <Link href="/" className="icon-link cancel">
            <X />
            <span>그만두기</span>
          </Link>
        ) : (
          <Link href="/settings/accessibility" className="icon-link">
            <Volume2 />
            <span>접근성</span>
          </Link>
        )}
      </div>
    </header>
  );
}

export function Page({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <main className={`page ${className}`}>{children}</main>;
}

export function Step({ current }: { current: 1 | 2 | 3 | 4 }) {
  const labels = ["받는 분", "금액", "안전 확인", "최종 확인"];
  return (
    <div
      className="step-wrap"
      aria-label={`송금 ${current}단계, ${labels[current - 1]}`}
    >
      <div className="step-top">
        <span>송금 {current}단계</span>
        <span>전체 4단계</span>
      </div>
      <div className="step-track">
        {labels.map((label, index) => (
          <span key={label} className={index < current ? "active" : ""} />
        ))}
      </div>
    </div>
  );
}

export function PrimaryLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className="button primary">
      {children}
      <ChevronRight aria-hidden />
    </Link>
  );
}

export function SecondaryLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className="button secondary">
      {children}
    </Link>
  );
}

export function PrimaryButton({
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className="button primary" {...props}>
      {children}
      {!props.disabled && <ChevronRight aria-hidden />}
    </button>
  );
}

export function VoiceButton({ text }: { text: string }) {
  const { speak } = useAppStore();
  return (
    <button type="button" className="voice-button" onClick={() => speak(text)}>
      <Volume2 aria-hidden />이 내용을 소리로 듣기
    </button>
  );
}

export function Notice({
  children,
  tone = "green",
}: {
  children: ReactNode;
  tone?: "green" | "amber" | "blue";
}) {
  return (
    <div className={`notice ${tone}`}>
      <span className="notice-icon">
        <Check aria-hidden />
      </span>
      <div>{children}</div>
    </div>
  );
}

export function StartCue() {
  return (
    <div className="start-cue" aria-hidden>
      {[0, 1, 2].map((item) => (
        <ChevronDown key={item} style={{ animationDelay: `${item * 180}ms` }} />
      ))}
    </div>
  );
}

export function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="주요 메뉴">
      <Link href="/history">
        <History />
        최근 내역
      </Link>
      <Link href="/" className="nav-home" aria-current="page">
        <Home />
        처음 화면
      </Link>
      <Link href="/favorites">
        <Heart />
        자주 보내는 분
      </Link>
    </nav>
  );
}
