import { Header, Page } from "@/components/ui";
import { formatDate, formatWon } from "@/lib/format";
import { initialHistory } from "@/mocks/data";

export default function HistoryPage() {
  return (
    <>
      <Header backHref="/" title="최근 내역" />
      <Page>
        <h1>최근 송금 내역</h1>
        <div className="history-list">
          {initialHistory.map((item) => (
            <div className="history-card" key={item.id}>
              <span>
                <strong>{item.recipient.name}</strong>
                <small>{formatDate(item.transferredAt)}</small>
              </span>
              <span className="history-amount">
                <strong>{formatWon(item.amount)}</strong>
                <small>{item.mode === "practice" ? "연습" : "실제"}</small>
              </span>
            </div>
          ))}
        </div>
      </Page>
    </>
  );
}
