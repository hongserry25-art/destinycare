
import { ChartData, PillarData, EnergyBalance, TenGodsDistribution, FateFlowData } from "../types";

const ELEMENT_MAP: Record<string, string> = {
  '甲': 'wood', '乙': 'wood', '寅': 'wood', '卯': 'wood',
  '丙': 'fire', '丁': 'fire', '巳': 'fire', '午': 'fire',
  '戊': 'earth', '己': 'earth', '辰': 'earth', '戌': 'earth', '丑': 'earth', '未': 'earth',
  '庚': 'metal', '辛': 'metal', '申': 'metal', '酉': 'metal',
  '壬': 'water', '癸': 'water', '亥': 'water', '子': 'water'
};

const YIN_YANG_MAP: Record<string, string> = {
  '甲': 'yang', '丙': 'yang', '戊': 'yang', '庚': 'yang', '壬': 'yang',
  '寅': 'yang', '辰': 'yang', '午': 'yang', '申': 'yang', '戌': 'yang',
  '乙': 'yin', '丁': 'yin', '己': 'yin', '辛': 'yin', '癸': 'yin',
  '卯': 'yin', '巳': 'yin', '未': 'yin', '酉': 'yin', '亥': 'yin', '子': 'yin', '丑': 'yin'
};

const calculateEnergy = (pillars: PillarData[]): EnergyBalance => {
  const elements = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  const yinYang = { yang: 0, yin: 0 };

  pillars.forEach(p => {
    if (ELEMENT_MAP[p.stem]) elements[ELEMENT_MAP[p.stem] as keyof typeof elements]++;
    if (ELEMENT_MAP[p.branch]) elements[ELEMENT_MAP[p.branch] as keyof typeof elements]++;
    if (YIN_YANG_MAP[p.stem]) yinYang[YIN_YANG_MAP[p.stem] as keyof typeof yinYang]++;
    if (YIN_YANG_MAP[p.branch]) yinYang[YIN_YANG_MAP[p.branch] as keyof typeof yinYang]++;
  });

  const totalElements = Object.values(elements).reduce((a, b) => a + b, 0);
  const totalYinYang = yinYang.yang + yinYang.yin;

  return {
    yang: { count: yinYang.yang, percent: Math.round((yinYang.yang / totalYinYang) * 100) || 0 },
    yin: { count: yinYang.yin, percent: Math.round((yinYang.yin / totalYinYang) * 100) || 0 },
    elements: {
      wood: { count: elements.wood, percent: Math.round((elements.wood / totalElements) * 100) || 0 },
      fire: { count: elements.fire, percent: Math.round((elements.fire / totalElements) * 100) || 0 },
      earth: { count: elements.earth, percent: Math.round((elements.earth / totalElements) * 100) || 0 },
      metal: { count: elements.metal, percent: Math.round((elements.metal / totalElements) * 100) || 0 },
      water: { count: elements.water, percent: Math.round((elements.water / totalElements) * 100) || 0 },
    }
  };
};

const calculateTenGods = (pillars: PillarData[]): TenGodsDistribution => {
  const counts: Record<string, number> = { bigeop: 0, siksang: 0, jaeseong: 0, gwanseong: 0, inseong: 0 };
  
  const mapTenGod = (tg: string) => {
    if (['비견', '겁재'].includes(tg)) return 'bigeop';
    if (['식신', '상관'].includes(tg)) return 'siksang';
    if (['편재', '정재'].includes(tg)) return 'jaeseong';
    if (['편관', '정관'].includes(tg)) return 'gwanseong';
    if (['편인', '정인'].includes(tg)) return 'inseong';
    return null;
  };

  pillars.forEach(p => {
    const key1 = mapTenGod(p.tenGod);
    const key2 = mapTenGod(p.branchTenGod);
    if (key1) counts[key1]++;
    if (key2) counts[key2]++;
  });

  return {
    bigeop: { count: counts.bigeop, label: "비겁 (주체성)", description: "나의 기운을 돕고 자아를 확립하는 기운입니다." },
    siksang: { count: counts.siksang, label: "식상 (표현력)", description: "재능을 발휘하고 결과를 만들어내는 기운입니다." },
    jaeseong: { count: counts.jaeseong, label: "재성 (결실/재물)", description: "현실적인 성취와 재물을 다루는 기운입니다." },
    gwanseong: { count: counts.gwanseong, label: "관성 (명예/절제)", description: "사회적 규율과 나를 다스리는 기운입니다." },
    inseong: { count: counts.inseong, label: "인성 (수용/학문)", description: "배움과 인덕, 수용하는 기운입니다." },
  };
};

export const parseSajuText = (text: string): { name: string, gender: 'male' | 'female', chartData: ChartData } => {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  
  let name = "분석 대상";
  let gender: 'male' | 'female' = 'female';
  let solarDate = "-";
  let lunarDate = "-";
  
  const pillars: Record<string, Partial<PillarData>> = { 
    hour: { tenGod: '-', stem: '-', branch: '-', branchTenGod: '-', lifeStage: '-', symbolicStars: '-' },
    day: { tenGod: '-', stem: '-', branch: '-', branchTenGod: '-', lifeStage: '-', symbolicStars: '-' },
    month: { tenGod: '-', stem: '-', branch: '-', branchTenGod: '-', lifeStage: '-', symbolicStars: '-' },
    year: { tenGod: '-', stem: '-', branch: '-', branchTenGod: '-', lifeStage: '-', symbolicStars: '-' }
  };
  const usefulGods = { yong: '-', hui: '-', gi: '-', gu: '-', han: '-' };

  // 이름 및 성별 추출
  const nameLine = lines.find(l => l.includes('(') || l.includes('명'));
  if (nameLine) {
    name = nameLine.split(/[(\s]/)[0];
    gender = (nameLine.includes('여') || nameLine.includes('坤')) ? 'female' : 'male';
  }

  // 날짜 추출
  lines.forEach(l => {
    if (l.includes('양력')) solarDate = l.replace(/양력|[:]/g, '').trim();
    if (l.includes('음력')) lunarDate = l.replace(/음력|[:]/g, '').trim();
  });

  // 사주 원국 데이터 파싱 (안전한 정규식 및 순서 보정)
  let reverseOrder = false;
  const header = lines.find(l => l.includes('년주') && l.includes('시주'));
  if (header && header.indexOf('년주') < header.indexOf('시주')) reverseOrder = true;

  lines.forEach(line => {
    const parts = line.split(/\s+/).filter(p => !['구분','시주','일주','월주','년주'].includes(p));
    if (line.startsWith('십성') && !pillars.hour.tenGod || line.includes('천간십성')) {
      const vals = reverseOrder ? [...parts].reverse() : parts;
      if (vals.length >= 3) {
        pillars.hour.tenGod = vals[0]; pillars.day.tenGod = '일간(나)'; pillars.month.tenGod = vals[1]; pillars.year.tenGod = vals[2];
      }
    } else if (line.startsWith('천간')) {
      const vals = line.match(/[甲乙丙丁戊己庚辛壬癸]/g) || [];
      const sorted = reverseOrder ? [...vals].reverse() : vals;
      if (sorted.length >= 4) {
        pillars.hour.stem = sorted[0]; pillars.day.stem = sorted[1]; pillars.month.stem = sorted[2]; pillars.year.stem = sorted[3];
      }
    } else if (line.startsWith('지지')) {
      const vals = line.match(/[子丑寅卯辰巳午未申酉戌亥]/g) || [];
      const sorted = reverseOrder ? [...vals].reverse() : vals;
      if (sorted.length >= 4) {
        pillars.hour.branch = sorted[0]; pillars.day.branch = sorted[1]; pillars.month.branch = sorted[2]; pillars.year.branch = sorted[3];
      }
    } else if (line.includes('지지십성')) {
      const vals = reverseOrder ? [...parts].reverse() : parts;
      if (vals.length >= 4) {
        pillars.hour.branchTenGod = vals[0]; pillars.day.branchTenGod = vals[1]; pillars.month.branchTenGod = vals[2]; pillars.year.branchTenGod = vals[3];
      }
    } else if (line.startsWith('운성') || line.includes('12운성')) {
      const vals = reverseOrder ? [...parts].reverse() : parts;
      if (vals.length >= 4) {
        pillars.hour.lifeStage = vals[0]; pillars.day.lifeStage = vals[1]; pillars.month.lifeStage = vals[2]; pillars.year.lifeStage = vals[3];
      }
    }
  });

  const pillarArray = [
    pillars.hour as PillarData,
    pillars.day as PillarData,
    pillars.month as PillarData,
    pillars.year as PillarData
  ];

  return {
    name, gender,
    chartData: {
      solarDate, lunarDate,
      hourPillar: pillars.hour as PillarData,
      dayPillar: pillars.day as PillarData,
      monthPillar: pillars.month as PillarData,
      yearPillar: pillars.year as PillarData,
      usefulGods,
      energyBalance: calculateEnergy(pillarArray),
      tenGodsDistribution: calculateTenGods(pillarArray)
    }
  };
};
