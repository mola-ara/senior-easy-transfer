"use client";

import {
  useCallback,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { useSpeechGuide } from "@/hooks/use-speech-guide";
import type {
  AssistanceProfile,
  Recipient,
  TransferDraft,
  TransferRecord,
  TransferMode,
} from "@/domain/types";
import {
  DEFAULT_ASSISTANCE_PROFILE,
  loadAssistanceProfile,
  saveAssistanceProfile,
} from "@/lib/assistance-profile-storage";

const emptyDraft: TransferDraft = {
  mode: "practice",
  recipient: null,
  amount: 0,
  risks: [],
  safetyConfirmed: false,
};

interface AppStoreValue {
  draft: TransferDraft;
  assistanceProfile: AssistanceProfile;
  receipt: TransferRecord | null;
  startTransfer: (mode: TransferMode) => void;
  setRecipient: (recipient: Recipient) => void;
  setAmount: (amount: number) => void;
  setRisks: (risks: TransferDraft["risks"]) => void;
  confirmSafety: () => void;
  setReceipt: (receipt: TransferRecord | null) => void;
  updateAssistanceProfile: (profile: Partial<AssistanceProfile>) => boolean;
  resetDraft: () => void;
  speak: (text: string) => void;
}

const AppStore = createContext<AppStoreValue | null>(null);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const speak = useSpeechGuide();
  const [draft, setDraft] = useState<TransferDraft>(emptyDraft);
  const [receipt, setReceipt] = useState<TransferRecord | null>(null);
  const [assistanceProfile, setAssistanceProfile] = useState<AssistanceProfile>(
    DEFAULT_ASSISTANCE_PROFILE,
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAssistanceProfile(loadAssistanceProfile(window.localStorage));
  }, []);

  useEffect(() => {
    if (
      assistanceProfile.isVoiceGuideEnabled &&
      pathname !== "/transfer/complete"
    ) {
      const title = document.querySelector("h1")?.textContent;
      if (title) speak(`${title} 화면입니다.`);
    }
  }, [pathname, assistanceProfile.isVoiceGuideEnabled, speak]);

  const updateAssistanceProfile = useCallback(
    (next: Partial<AssistanceProfile>): boolean => {
      const updated = { ...assistanceProfile, ...next };
      const isSaved = saveAssistanceProfile(window.localStorage, updated);
      setAssistanceProfile(updated);
      return isSaved;
    },
    [assistanceProfile],
  );

  const value = useMemo<AppStoreValue>(
    () => ({
      draft,
      assistanceProfile,
      receipt,
      startTransfer: (mode) => {
        setDraft({ ...emptyDraft, mode });
        setReceipt(null);
      },
      setRecipient: (recipient) =>
        setDraft((current) => ({
          ...current,
          recipient,
          amount: 0,
          risks: [],
          safetyConfirmed: false,
        })),
      setAmount: (amount) =>
        setDraft((current) => ({
          ...current,
          amount,
          risks: [],
          safetyConfirmed: false,
        })),
      setRisks: (risks) => setDraft((current) => ({ ...current, risks })),
      confirmSafety: () =>
        setDraft((current) => ({ ...current, safetyConfirmed: true })),
      setReceipt,
      updateAssistanceProfile,
      resetDraft: () => {
        setDraft(emptyDraft);
        setReceipt(null);
      },
      speak,
    }),
    [assistanceProfile, draft, receipt, speak, updateAssistanceProfile],
  );

  return <AppStore.Provider value={value}>{children}</AppStore.Provider>;
}

export function useAppStore(): AppStoreValue {
  const value = useContext(AppStore);
  if (!value)
    throw new Error("useAppStore는 AppStoreProvider 안에서 사용해야 합니다.");
  return value;
}
