
import { ChartData, PillarData, EnergyBalance, TenGodsDistribution } from "../types";

const ELEMENT_MAP: Record<string, string> = {
  '甲': 'wood', '乙': 'wood', '寅': 'wood', '卯': 'wood', '木': 'wood', '나무': 'wood',
  '丙': 'fire', '丁': 'fire', '巳': 'fire', '午': 'fire', '火': 'fire', '불': 'fire',
  '戊': 'earth', '己': 'earth', '辰': 'earth', '戌': 'earth', '丑': 'earth', '未': 'earth', '土': 'earth', '흙': 'earth',
  '庚': 'metal', '辛': 'metal', '申': 'metal', '酉': 'metal', '金': 'metal', '金': 'metal', '쇠': 'metal',
  '壬': 'water', '癸': 'water', '亥': 'water', '子': 'water', '水': 'water', '물': 'water'
};

const HEADERS = ['구분', '시주', '일주', '월주', '년주', '용신', '희신', '기신', '구신', '한신'];

/**
 * 텍스트에서 특정 라벨을 포함하는 데이터 행을 추출합니다.
 */
const extractDataRow = (label: string, lines: string[]): string[] => {
  for (const line of lines) {
    if (line.includes(label)) {
      const parts = line.replace(label, '').trim().split(/\s+/).filter(v => v.length > 0);
      const isHeaderOnly = parts.length > 0 && parts.every(p => HEADERS.includes(p));
      if (!isHeaderOnly && parts.length > 0) {
        return parts;
      }
    }
  }
  return [];
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

  // 1. 기본 정보 추출
  const nameMatch = text.match(/([가-힣a-zA-Z0-9]+)\s*\((여|남|坤|乾)\)/);
  if (nameMatch) {
    name = nameMatch[1];
    gender = (nameMatch[2] === '여' || nameMatch[2] === '坤') ? 'female' : 'male';
  }
  
  const solarMatch = text.match(/양력\s*(\d{4}년\s*\d{1,2}월\s*\d{1,2}일(?:\s*\d{1,2}시\s*\d{1,2}분)?)/);
  if (solarMatch) solarDate = solarMatch[1];
  
  const lunarMatch = text.match(/음력\s*(\d{4}년\s*\d{1,2}월\s*\d{1,2}일)/);
  if (lunarMatch) lunarDate = lunarMatch[1];

  // 2. 사주 원국 데이터 추출
  const mapPillars = (label: string, field: keyof PillarData) => {
    const values = extractDataRow(label, lines);
    if (values.length >= 4) {
      pillars.hour[field] = values[0];
      pillars.day[field] = values[1];
      pillars.month[field] = values[2];
      pillars.year[field] = values[3];
    } else if (values.length === 3 && field === 'tenGod') {
      pillars.hour[field] = values[0];
      pillars.day[field] = '일간(나)';
      pillars.month[field] = values[1];
      pillars.year[field] = values[2];
    }
  };

  mapPillars('천간', 'stem');
  mapPillars('지지', 'branch');
  mapPillars('십성', 'tenGod');
  
  const branchTenGods = extractDataRow('십성(지지)', lines).length > 0 
    ? extractDataRow('십성(지지)', lines) 
    : extractDataRow('지지십성', lines);
  if (branchTenGods.length >= 4) {
    pillars.hour.branchTenGod = branchTenGods[0];
    pillars.day.branchTenGod = branchTenGods[1];
    pillars.month.branchTenGod = branchTenGods[2];
    pillars.year.branchTenGod = branchTenGods[3];
  }

  mapPillars('운성', 'lifeStage');
  mapPillars('신살', 'symbolicStars');

  // 3. 용신 분석
  const usefulGods = { yong: '?', hui: '?', gi: '?', gu: '?', han: '?' };
  const yongRow = lines.find(l => l.includes('오행') && /[木火土金金水]/.test(l));
  if (yongRow) {
    const vals = yongRow.replace('오행', '').trim().split(/\s+/).filter(v => v.length > 0);
    if (vals.length >= 5) {
      usefulGods.yong = vals[0]; usefulGods.hui = vals[1]; usefulGods.gi = vals[2]; usefulGods.gu = vals[3]; usefulGods.han = vals[4];
    }
  }

  // 4. 오행 분포 분석 (한국어 라벨 대응을 위해 정규표현식 수정)
  const elements = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  lines.forEach(line => {
    // [Hanja] [KoreanName] [Percent]% [Count]개 형식을 매칭
    const elMatch = line.match(/(木|火|土|金|金|水)\s+[가-힣]+\s+([\d.]+)%\s+(\d+)개/);
    if (elMatch) {
      const key = ELEMENT_MAP[elMatch[1]];
      if (key) (elements as any)[key] = parseInt(elMatch[3], 10);
    }
  });

  // 5. 십성 분포 분석
  const tenGodCounts: Record<string, number> = { bigeop: 0, siksang: 0, jaeseong: 0, gwanseong: 0, inseong: 0 };
  lines.forEach(line => {
    const countMatch = line.match(/(\d+)개/);
    if (countMatch) {
      const count = parseInt(countMatch[1], 10);
      if (line.includes('비겁')) tenGodCounts.bigeop = count;
      else if (line.includes('식상')) tenGodCounts.siksang = count;
      else if (line.includes('재성')) tenGodCounts.jaeseong = count;
      else if (line.includes('관성')) tenGodCounts.gwanseong = count;
      else if (line.includes('인성')) tenGodCounts.inseong = count;
    }
  });

  const totalElements = Object.values(elements).reduce((a, b) => a + b, 0) || 8;
  const finalEnergy: EnergyBalance = {
    yang: { count: 0, percent: 50 },
    yin: { count: 0, percent: 50 },
    elements: {
      wood: { count: elements.wood, percent: Math.round((elements.wood / totalElements) * 100) },
      fire: { count: elements.fire, percent: Math.round((elements.fire / totalElements) * 100) },
      earth: { count: elements.earth, percent: Math.round((elements.earth / totalElements) * 100) },
      metal: { count: elements.metal, percent: Math.round((elements.metal / totalElements) * 100) },
      water: { count: elements.water, percent: Math.round((elements.water / totalElements) * 100) },
    }
  };

  // 6. 음양 분석 (다양한 공백 및 문자 대응)
  lines.forEach(line => {
    const yinMatch = line.match(/(陰|음)\s+[가-힣]*\s*(\d+)개\s*\((\d+)%\)/);
    const yangMatch = line.match(/(陽|양)\s+[가-힣]*\s*(\d+)개\s*\((\d+)%\)/);
    if (yinMatch) finalEnergy.yin = { count: parseInt(yinMatch[2]), percent: parseInt(yinMatch[3]) };
    if (yangMatch) finalEnergy.yang = { count: parseInt(yangMatch[2]), percent: parseInt(yangMatch[3]) };
  });

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
