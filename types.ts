
export interface PillarData {
  tenGod: string;      // 십성 (상단)
  stem: string;        // 천간
  branch: string;      // 지지
  branchTenGod: string; // 지지 십성 (하단)
  lifeStage: string;   // 12운성
  symbolicStars: string; // 신살 (기존)
}

export interface FatePillarInfo {
  mainStars: string[];   // 주요 신살
  detailStars: string[]; // 상세 신살
}

export interface FateFlowData {
  year: FatePillarInfo;
  month: FatePillarInfo;
  day: FatePillarInfo;
  hour: FatePillarInfo;
}

export interface EnergyBalance {
  yang: { count: number; percent: number };
  yin: { count: number; percent: number };
  elements: {
    wood: { count: number; percent: number };
    fire: { count: number; percent: number };
    earth: { count: number; percent: number };
    metal: { count: number; percent: number };
    water: { count: number; percent: number };
  };
}

export interface TenGodsDistribution {
  bigeop: { count: number; label: string; description: string };
  siksang: { count: number; label: string; description: string };
  jaeseong: { count: number; label: string; description: string };
  gwanseong: { count: number; label: string; description: string };
  inseong: { count: number; label: string; description: string };
}

export interface ChartData {
  solarDate: string;
  lunarDate: string;
  hourPillar: PillarData;
  dayPillar: PillarData;
  monthPillar: PillarData;
  yearPillar: PillarData;
  usefulGods: {
    yong: string; // 용신
    hui: string;  // 희신
    gi: string;   // 기신
    gu: string;   // 구신
    han: string;  // 한신
  };
  energyBalance?: EnergyBalance;
  tenGodsDistribution?: TenGodsDistribution;
  fateFlow?: FateFlowData; // 추가된 필드
}

export interface Chapter {
  id: number;
  title: string;
  subtitle: string;
  content: string;
  active?: boolean;
}

export interface SajuData {
  name: string;
  birthDate: string;
  gender: 'male' | 'female';
  chapters: Chapter[];
  chartData?: ChartData;
}

export const DEFAULT_CHAPTERS: Chapter[] = [
  { id: 1, active: true, title: "나의 사주팔자\n상세분석", subtitle: "사주원국 심층 해석", content: "" },
  { id: 2, active: true, title: "내 인생의 황금기", subtitle: "인생의 고점과 저점 분석", content: "" },
  { id: 3, active: true, title: "연애운과 배우자운", subtitle: "천생연분을 만나는 시기", content: "" },
  { id: 4, active: true, title: "나의 재물운 분석", subtitle: "내 사주 속에 숨겨진 재물", content: "" },
  { id: 5, active: true, title: "직업과 성공의 운명", subtitle: "나에게 적합한 직업", content: "" },
  { id: 6, active: true, title: "사주로 보는\n건강과 체질", subtitle: "타고난 건강 체질 관리", content: "" },
  { id: 7, active: true, title: "당신을 도와줄\n운명의 귀인", subtitle: "나를 돕는 귀인의 특징", content: "" },
  { id: 8, active: true, title: "운명을 바꾸는 방법", subtitle: "개운법과 인생 전략", content: "" },
  { id: 9, active: true, title: "나의 2026년 월별 상세 운명분석", subtitle: "월별 상세 운세", content: "" },
  { id: 10, active: true, title: "앞으로의 10년간 운명 분석", subtitle: "대운의 흐름", content: "" },
];
