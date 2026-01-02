
import { ChartData, PillarData, EnergyBalance, TenGodsDistribution } from "../types";

const ELEMENT_MAP: Record<string, string> = {
  '甲': 'wood', '乙': 'wood', '寅': 'wood', '卯': 'wood', '木': 'wood', '나무': 'wood',
  '丙': 'fire', '丁': 'fire', '巳': 'fire', '午': 'fire', '火': 'fire', '불': 'fire',
  '戊': 'earth', '己': 'earth', '辰': 'earth', '戌': 'earth', '丑': 'earth', '未': 'earth', '土': 'earth', '흙': 'earth',
  '庚': 'metal', '辛': 'metal', '申': 'metal', '酉': 'metal', '金': 'metal', '金': 'metal', '쇠': 'metal',
  '壬': 'water', '癸': 'water', '亥': 'water', '子': 'water', '水': 'water', '물': 'water'
};

const YIN_YANG_MAP: Record<string, string> = {
  '甲': 'yang', '丙': 'yang', '戊': 'yang', '庚': 'yang', '壬': 'yang',
  '寅': 'yang', '辰': 'yang', '午': 'yang', '申': 'yang', '戌': 'yang',
  '乙': 'yin', '丁': 'yin', '己': 'yin', '辛': 'yin', '癸': 'yin',
  '卯': 'yin', '巳': 'yin', '未': 'yin', '酉': 'yin', '亥': 'yin', '子': 'yin', '丑': 'yin'
};

export const parseSajuText = (text: string): { name: string, gender: 'male' | 'female', chartData: ChartData } => {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  
  let name = "분석 대상";
  let gender: 'male' | 'female' = 'female';
  let solarDate = "-";
  let lunarDate = "-";
  
  const pillars: Record<string, PillarData> = { 
    hour: { tenGod: '-', stem: '-', branch: '-', branchTenGod: '-', lifeStage: '-', symbolicStars: '-' },
    day: { tenGod: '-', stem: '-', branch: '-', branchTenGod: '-', lifeStage: '-', symbolicStars: '-' },
    month: { tenGod: '-', stem: '-', branch: '-', branchTenGod: '-', lifeStage: '-', symbolicStars: '-' },
    year: { tenGod: '-', stem: '-', branch: '-', branchTenGod: '-', lifeStage: '-', symbolicStars: '-' }
  };

  // 1. 기본 정보 추출 (이름, 성별, 날짜)
  const nameMatch = text.match(/([가-힣a-zA-Z]+)\s*\((여|남|坤|乾)\)/);
  if (nameMatch) {
    name = nameMatch[1];
    gender = (nameMatch[2] === '여' || nameMatch[2] === '坤') ? 'female' : 'male';
  }
  
  const solarMatch = text.match(/양력\s*(\d{4}년\s*\d{1,2}월\s*\d{1,2}일(?:\s*\d{1,2}시\s*\d{1,2}분)?)/);
  if (solarMatch) solarDate = solarMatch[1];
  
  const lunarMatch = text.match(/음력\s*(\d{4}년\s*\d{1,2}월\s*\d{1,2}일)/);
  if (lunarMatch) lunarDate = lunarMatch[1];

  // 2. 사주 그리드 추출
  // 형식: "레이블 값 값 값 값" 구조를 찾음
  const extractRow = (label: string): string[] => {
    const line = lines.find(l => l.startsWith(label) || l.includes(label));
    if (!line) return [];
    // 레이블 제거 후 공백으로 분리
    const values = line.replace(label, '').trim().split(/\s+/).filter(v => v.length > 0);
    return values;
  };

  const mapPillars = (values: string[], field: keyof PillarData) => {
    if (values.length >= 4) {
      // 일반적인 만세력 텍스트는 시-일-월-년 순서임
      pillars.hour[field] = values[0];
      pillars.day[field] = values[1];
      pillars.month[field] = values[2];
      pillars.year[field] = values[3];
    } else if (values.length === 3 && field === 'tenGod') {
      // 일간은 보통 생략됨 (일간(나) 형태)
      pillars.hour[field] = values[0];
      pillars.day[field] = '일간(나)';
      pillars.month[field] = values[1];
      pillars.year[field] = values[2];
    }
  };

  mapPillars(extractRow('천간'), 'stem');
  mapPillars(extractRow('지지'), 'branch');
  mapPillars(extractRow('십성'), 'tenGod');
  
  // 지지십성(십성(지지)) 처리
  const branchTenGods = extractRow('십성(지지)') || extractRow('지지십성');
  if (branchTenGods.length > 0) mapPillars(branchTenGods, 'branchTenGod');

  mapPillars(extractRow('운성'), 'lifeStage');
  mapPillars(extractRow('신살'), 'symbolicStars');

  // 3. 용신 분석 데이터 추출
  const usefulGods = { yong: '?', hui: '?', gi: '?', gu: '?', han: '?' };
  const yongRow = lines.find(l => l.includes('오행') && (l.includes('火') || l.includes('水') || l.includes('木')));
  if (yongRow) {
    const vals = yongRow.replace('오행', '').trim().split(/\s+/);
    if (vals.length >= 5) {
      usefulGods.yong = vals[0]; usefulGods.hui = vals[1]; usefulGods.gi = vals[2]; usefulGods.gu = vals[3]; usefulGods.han = vals[4];
    }
  }

  // 4. 오행 개수 직접 추출 (텍스트 하단에 "木 나무 0% 0개" 형태가 있는 경우)
  const elements = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  lines.forEach(line => {
    const elMatch = line.match(/(木|火|土|金|金|水)\s+\w+\s+\d+%\s+(\d+)개/);
    if (elMatch) {
      const key = ELEMENT_MAP[elMatch[1]];
      if (key) (elements as any)[key] = parseInt(elMatch[2], 10);
    }
  });

  // 5. 십신 분포 개수 추출
  const tenGodCounts: Record<string, number> = { bigeop: 0, siksang: 0, jaeseong: 0, gwanseong: 0, inseong: 0 };
  lines.forEach(line => {
    if (line.includes('비겁')) tenGodCounts.bigeop = parseInt(line.match(/(\d+)개/)?.[1] || '0', 10);
    if (line.includes('식상')) tenGodCounts.siksang = parseInt(line.match(/(\d+)개/)?.[1] || '0', 10);
    if (line.includes('재성')) tenGodCounts.jaeseong = parseInt(line.match(/(\d+)개/)?.[1] || '0', 10);
    if (line.includes('관성')) tenGodCounts.gwanseong = parseInt(line.match(/(\d+)개/)?.[1] || '0', 10);
    if (line.includes('인성')) tenGodCounts.inseong = parseInt(line.match(/(\d+)개/)?.[1] || '0', 10);
  });

  // 데이터 보완 (텍스트에 개수 정보가 없으면 원국표 기반 계산)
  const pillarList = [pillars.hour, pillars.day, pillars.month, pillars.year];
  const totalElements = Object.values(elements).reduce((a, b) => a + b, 0);
  
  const finalEnergy: EnergyBalance = {
    yang: { count: 0, percent: 0 }, // 텍스트에서 추출이 어려우면 0으로 둠
    yin: { count: 0, percent: 0 },
    elements: {
      wood: { count: elements.wood, percent: Math.round((elements.wood / (totalElements || 8)) * 100) },
      fire: { count: elements.fire, percent: Math.round((elements.fire / (totalElements || 8)) * 100) },
      earth: { count: elements.earth, percent: Math.round((elements.earth / (totalElements || 8)) * 100) },
      metal: { count: elements.metal, percent: Math.round((elements.metal / (totalElements || 8)) * 100) },
      water: { count: elements.water, percent: Math.round((elements.water / (totalElements || 8)) * 100) },
    }
  };

  // 음양 조화 텍스트 추출 (예: "陰 음 8개 (100%)")
  const yinMatch = text.match(/陰\s+\w+\s+(\d+)개\s+\((\d+)%\)/);
  const yangMatch = text.match(/陽\s+\w+\s+(\d+)개\s+\((\d+)%\)/);
  if (yinMatch) {
    finalEnergy.yin = { count: parseInt(yinMatch[1]), percent: parseInt(yinMatch[2]) };
  }
  if (yangMatch) {
    finalEnergy.yang = { count: parseInt(yangMatch[1]), percent: parseInt(yangMatch[2]) };
  }

  return {
    name, gender,
    chartData: {
      solarDate, lunarDate,
      hourPillar: pillars.hour,
      dayPillar: pillars.day,
      monthPillar: pillars.month,
      yearPillar: pillars.year,
      usefulGods,
      energyBalance: finalEnergy,
      tenGodsDistribution: {
        bigeop: { count: tenGodCounts.bigeop, label: "비겁 (주체성)", description: "자아를 확립하고 독립성을 유지하는 기운입니다." },
        siksang: { count: tenGodCounts.siksang, label: "식상 (표현력)", description: "재능을 발산하고 풍요를 일구는 기운입니다." },
        jaeseong: { count: tenGodCounts.jaeseong, label: "재성 (결실/재물)", description: "현실적인 성취와 목표를 달성하는 기운입니다." },
        gwanseong: { count: tenGodCounts.gwanseong, label: "관성 (명예/절제)", description: "사회적 질서와 자기를 통제하는 기운입니다." },
        inseong: { count: tenGodCounts.inseong, label: "인성 (수용/학문)", description: "지식을 습득하고 인덕을 쌓는 기운입니다." },
      }
    }
  };
};
