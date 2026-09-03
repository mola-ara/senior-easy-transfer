"use client";

import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { Header, Page } from "@/components/ui";
import { recipients } from "@/mocks/data";
import { useAppStore } from "@/store/app-store";
import type { Recipient } from "@/domain/types";

export default function FavoritesPage() {
  const router = useRouter();
  const { setRecipient, startTransfer } = useAppStore();
  const favorites = recipients.filter((recipient) => recipient.isFavorite);

  const send = (recipient: Recipient) => {
    startTransfer("real");
    setRecipient(recipient);
    router.push("/transfer/amount");
  };

  return (
    <>
      <Header backHref="/" title="자주 보내는 분" />
      <Page>
        <h1>자주 보내는 분</h1>
        <p className="lead">눌러서 바로 송금을 시작해요.</p>
        <div className="person-list">
          {favorites.length === 0 && (
            <p className="lead">아직 자주 보내는 분이 없어요.</p>
          )}
          {favorites.map((recipient) => (
            <button
              type="button"
              key={recipient.id}
              className="person-card"
              onClick={() => send(recipient)}
            >
              <span
                className="avatar"
                style={{ background: recipient.avatarColor }}
              >
                {recipient.name[0]}
              </span>
              <span className="person-info">
                <strong>{recipient.name}</strong>
                <span>
                  {recipient.bankName} · {recipient.accountNumber}
                </span>
              </span>
              <Heart className="chevron" />
            </button>
          ))}
        </div>
      </Page>
    </>
  );
}
