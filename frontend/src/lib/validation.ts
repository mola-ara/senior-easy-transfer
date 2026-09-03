export function validateAccountNumber(value: string): string | null {
  const digits = value.replace(/\D/g, "");
  if (digits.length < 10) return "계좌번호를 10자리 이상 입력해 주세요.";
  if (digits.length > 14) return "계좌번호가 너무 길어요. 다시 확인해 주세요.";
  return null;
}
