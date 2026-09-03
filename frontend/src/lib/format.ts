const digitWords = ["", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구"];
const smallUnits = ["", "십", "백", "천"];
const bigUnits = ["", "만", "억", "조"];

function readGroup(num: number): string {
  const str = String(num);
  let result = "";
  for (let i = 0; i < str.length; i++) {
    const digit = Number(str[i]);
    const unitIndex = str.length - i - 1;
    if (digit === 0) continue;
    const digitWord = digit === 1 && unitIndex > 0 ? "" : digitWords[digit];
    result += digitWord + smallUnits[unitIndex];
  }
  return result;
}

export function formatKoreanAmount(amount: number): string {
  if (amount <= 0) return "영 원";
  let remaining = Math.floor(amount);
  const groups: number[] = [];
  while (remaining > 0) {
    groups.unshift(remaining % 10000);
    remaining = Math.floor(remaining / 10000);
  }
  const offset = groups.length - 1;
  const result = groups
    .map((group, index) =>
      group === 0 ? "" : readGroup(group) + bigUnits[offset - index],
    )
    .join("");
  return `${result} 원`;
}

export function formatWon(amount: number): string {
  return `${amount.toLocaleString("ko-KR")}원`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
