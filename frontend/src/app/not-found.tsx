import { Page, PrimaryLink } from "@/components/ui";
export default function NotFound() {
  return (
    <Page>
      <h1>화면을 찾지 못했어요</h1>
      <p className="lead">지금은 열 수 없는 화면이에요.</p>
      <PrimaryLink href="/">처음 화면으로 이동</PrimaryLink>
    </Page>
  );
}
