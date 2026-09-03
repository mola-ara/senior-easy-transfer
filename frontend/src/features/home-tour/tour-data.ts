export type HomeTourTarget =
  "welcome" | "balance" | "transfer" | "shortcuts" | "complete";

export interface HomeTourStep {
  target: HomeTourTarget;
  title: string;
  description: string;
}

export const HOME_TOUR_STORAGE_KEY = "bada-home-tour-completed";

export const homeTourSteps: HomeTourStep[] = [
  {
    target: "welcome",
    title: "안녕하세요, 김바다 님",
    description:
      "여기는 송금을 연습하는 곳이에요. 실제 돈은 움직이지 않아요. 안심하고 따라 해보세요.",
  },
  {
    target: "balance",
    title: "연습에 사용할 잔액이에요",
    description:
      "화면의 돈은 연습용이에요. 송금해도 실제 통장에서는 돈이 빠져나가지 않아요.",
  },
  {
    target: "transfer",
    title: "여기에서 송금을 시작해요",
    description:
      "처음이라면 연습 송금을 누르세요. 받는 분 선택부터 천천히 알려드려요.",
  },
  {
    target: "shortcuts",
    title: "자주 쓰는 기능은 여기 있어요",
    description:
      "최근 내역을 다시 볼 수 있어요. 자주 보내는 분도 빠르게 찾을 수 있어요.",
  },
  {
    target: "complete",
    title: "처음 화면 설명을 모두 마쳤어요",
    description:
      "잘하셨어요. 이제 연습 송금을 시작해 보세요. 실제 돈은 움직이지 않아요.",
  },
];
