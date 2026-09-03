import { Header, Page } from "@/components/ui";

const steps = [
  "가장 먼저 받는 분에게 전화나 문자로 알려주세요.",
  "이용하시는 은행 고객센터에 오송금 사실을 알려주세요.",
  "은행 창구나 앱에서 반환 요청 절차를 안내받으세요.",
];

export default function HelpPage() {
  return (
    <>
      <Header backHref="/transfer/complete" title="잘못 보냈어요" />
      <Page>
        <h1>
          당황하지 마세요.
          <br />
          이렇게 해보세요
        </h1>
        <p className="lead">
          이 화면은 연습이라 실제로 신고가 접수되지는 않아요.
        </p>
        <ol className="timeline">
          {steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </Page>
    </>
  );
}
