
import { ChartData, PillarData, EnergyBalance, TenGodsDistribution, FateFlowData, FatePillarInfo } from "../types";

const ELEMENT_MAP: Record<string, string> = {
  '甲': 'wood', '乙': 'wood', '寅': 'wood', '卯': 'wood', '木': 'wood', '목': 'wood',
  '丙': 'fire', '丁': 'fire', '巳': 'fire', '午': 'fire', '火': 'fire', '화': 'fire',
  '戊': 'earth', '己': 'earth', '辰': 'earth', '戌': 'earth', '丑': 'earth', '未': 'earth', '토': 'earth', '土': 'earth',
  '庚': 'metal', '辛': 'metal', '申': 'metal', '酉': 'metal', '金': 'metal', '금': 'metal', '金': 'metal',
  '壬': 'water', '癸': 'water', '亥': 'water', '子': 'water', '수': 'water', '水': 'water'
};

const TEN_GODS = ['비견', '겁재', '식신', '상관', '편재', '정재', '편관', '정관', '편인', '정인', '일간(나)'];

export const parseFateFlowOnly = (text: string): FateFlowData => {
  const lines = text.split(/\r?\n|\r|\u2028/).map(l => l.trim()).filter(l => l.length > 0);
  const fateFlow: FateFlowData = {
    year: { mainStars: [], detailStars: [] },
    month: { mainStars: [], detailStars: [] },
    day: { mainStars: [], detailStars: [] },
    hour: { mainStars: [], detailStars: [] }
  };

  let currentPillar: keyof FateFlowData | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const cleanLine = line.replace(/\s+/g, '');

    // 섹션 감지 (년주, 월주, 일주, 시주 단독행 또는 시작어)
    if (cleanLine === '년주' || (cleanLine.startsWith('년') && cleanLine.endsWith('주') && cleanLine.length <= 3)) currentPillar = 'year';
    else if (cleanLine === '월주' || (cleanLine.startsWith('월') && cleanLine.endsWith('주') && cleanLine.length <= 3)) currentPillar = 'month';
    else if (cleanLine === '일주' || (cleanLine.startsWith('일') && cleanLine.endsWith('주') && cleanLine.length <= 3)) currentPillar = 'day';
    else if (cleanLine === '시주' || (cleanLine.startsWith('시') && cleanLine.endsWith('주') && cleanLine.length <= 3)) currentPillar = 'hour';
    else if (currentPillar) {
      // 1. 상세 신살 라인 (콜론 기준)
      if (line.includes('상세')) {
        const parts = line.split(':');
        if (parts.length > 1) {
          const vals = parts[1].split(',').map(s => s.trim()).filter(Boolean);
          fateFlow[currentPillar].detailStars.push(...vals);
        }
      } 
      // 2. 불렛 포인트 라인 (설명문)
      else if (line.startsWith('•')) {
        fateFlow[currentPillar].detailStars.push(line.replace('•', '').trim());
      }
      // 3. '핵심' 키워드 단독 라인 (무시)
      else if (cleanLine === '핵심기운' || cleanLine === '핵심') {
        continue;
      }
      // 4. 나머지 - 주요 신살로 간주 (공백이나 콤마로 분리)
      else {
        const vals = line.split(/[\s,]+/).map(s => s.trim()).filter(s => s.length > 0);
        if (vals.length > 0) {
          fateFlow[currentPillar].mainStars.push(...vals);
        }
      }
    }
  }

  return fateFlow;
};

export const parseSajuText = (text: string): { name: string, gender: 'male' | 'female', chartData: ChartData } => {
  const lines = text.split(/\r?\n|\r|\u2028/).map(l => l.trim()).filter(l => l.length > 0);
  
  let name = "이름없음";
  let gender: 'male' | 'female' = 'female';
  let solarDate = "";
  let lunarDate = "";
  
  const hour: Partial<PillarData> = {};
  const day: Partial<PillarData> = {};
  const month: Partial<PillarData> = {};
  const year: Partial<PillarData> = {};
  
  const usefulGods = { yong: '-', hui: '-', gi: '-', gu: '-', han: '-' };

  // 1. 이름 및 성별 추출
  const nameLine = lines.find(l => l.includes('('));
  if (nameLine) {
    const match = nameLine.match(/(.+)\s\((.+)\)/);
    if (match) {
      name = match[1].trim();
      gender = match[2].includes('여') ? 'female' : 'male';
    } else {
      name = nameLine.split('(')[0].trim();
      gender = nameLine.includes('남') ? 'male' : 'female';
    }
  }

  // 2. 날짜 추출
  lines.forEach(line => {
    if (line.includes('양력')) solarDate = line.split(/[:\s]+/)[1]?.trim() || line.replace('양력', '').replace(':', '').trim();
    if (line.includes('음력')) lunarDate = line.split(/[:\s]+/)[1]?.trim() || line.replace('음력', '').replace(':', '').trim();
  });

  // 3. 컬럼 순서 판별
  let reverseOrder = false; 
  const headerLine = lines.find(l => l.includes('구분') && (l.includes('년주') || l.includes('시주')));
  if (headerLine) {
    const nPos = headerLine.indexOf('년주');
    const sPos = headerLine.indexOf('시주');
    if (nPos !== -1 && sPos !== -1 && nPos < sPos) reverseOrder = true;
  }

  // 4. 사주 원국 데이터 행 추출
  let foundTenGodsTop = false;
  lines.forEach(line => {
    const parts = line.split(/\s+/).filter(p => !['구분','시주','일주','월주','년주',':'].includes(p));
    
    if (line.startsWith('십성') && !foundTenGodsTop) {
      const vals = parts.filter(p => TEN_GODS.includes(p) || p === '십성').slice(-4);
      if (vals.length === 4) {
        const sorted = reverseOrder ? [...vals].reverse() : vals;
        hour.tenGod = sorted[0]; day.tenGod = sorted[1]; month.tenGod = sorted[2]; year.tenGod = sorted[3];
        foundTenGodsTop = true;
      }
    } 
    else if (line.startsWith('천간')) {
      const vals = line.match(/[甲乙丙丁戊己庚辛壬癸]/g);
      if (vals && vals.length >= 4) {
        const sorted = reverseOrder ? [...vals.slice(0,4)].reverse() : vals.slice(0,4);
        hour.stem = sorted[0]; day.stem = sorted[1]; month.stem = sorted[2]; year.stem = sorted[3];
      }
    }
    else if (line.startsWith('지지')) {
      const vals = line.match(/[子丑寅卯辰巳午未申酉戌亥]/g);
      if (vals && vals.length >= 4) {
        const sorted = reverseOrder ? [...vals.slice(0,4)].reverse() : vals.slice(0,4);
        hour.branch = sorted[0]; day.branch = sorted[1]; month.branch = sorted[2]; year.branch = sorted[3];
      }
    }
    else if (line.startsWith('십성') && foundTenGodsTop) {
      const vals = parts.filter(p => TEN_GODS.includes(p)).slice(-4);
      if (vals.length === 4) {
        const sorted = reverseOrder ? [...vals].reverse() : vals;
        hour.branchTenGod = sorted[0]; day.branchTenGod = sorted[1]; month.branchTenGod = sorted[2]; year.branchTenGod = sorted[3];
      }
    }
    else if (line.startsWith('운성')) {
      const vals = parts.slice(-4);
      if (vals.length === 4) {
        const sorted = reverseOrder ? [...vals].reverse() : vals;
        hour.lifeStage = sorted[0]; day.lifeStage = sorted[1]; month.lifeStage = sorted[2]; year.lifeStage = sorted[3];
      }
    }
    else if (line.startsWith('신살')) {
      const vals = parts.slice(-4);
      if (vals.length === 4) {
        const sorted = reverseOrder ? [...vals].reverse() : vals;
        hour.symbolicStars = sorted[0]; day.symbolicStars = sorted[1]; month.symbolicStars = sorted[2]; year.symbolicStars = sorted[3];
      }
    }
  });

  // 5. 용신 분석 추출 (표 형식 및 리스트 형식 지원)
  const mapElement = (char: string) => {
    const map: Record<string, string> = {
        '목':'木', '화':'火', '토':'土', '금':'金', '수':'水', 
        '金':'金', '金':'金', '木':'木', '火':'火', '土':'土', '水':'水'
    };
    return map[char] || char;
  };

  // 5-1. 표 형식 감지
  const yHeaderIdx = lines.findIndex(l => l.includes('용신') && l.includes('희신') && l.includes('기신'));
  if (yHeaderIdx !== -1 && yHeaderIdx < lines.length - 1) {
    const valLine = lines[yHeaderIdx + 1];
    const elementPattern = /[木火土金水목화토금수金]/g;
    const matches = valLine.match(elementPattern);
    if (matches && matches.length >= 5) {
      usefulGods.yong = mapElement(matches[0]);
      usefulGods.hui = mapElement(matches[1]);
      usefulGods.gi = mapElement(matches[2]);
      usefulGods.gu = mapElement(matches[3]);
      usefulGods.han = mapElement(matches[4]);
    }
  }

  // 5-2. 개별 라인 형식 감지 폴백
  if (usefulGods.yong === '-') {
    const getElementValue = (kw: string) => {
      const elementPattern = /[木火土金水목화토금수金]/;
      const line = lines.find(l => {
          const cleanLine = l.replace(/\s+/g, '');
          return (cleanLine.startsWith(kw) || cleanLine.includes(kw)) && elementPattern.test(l);
      });
      if (line) {
        const match = line.match(elementPattern);
        if (match) return mapElement(match[0]);
      }
      return '-';
    };
    usefulGods.yong = getElementValue('용신');
    usefulGods.hui = getElementValue('희신');
    usefulGods.gi = getElementValue('기신');
    usefulGods.gu = getElementValue('구신');
    usefulGods.han = getElementValue('한신');
  }

  // 6. 음양오행 및 십신 분포 파싱
  const energyBalance: EnergyBalance = {
    yang: { count: 0, percent: 0 }, yin: { count: 0, percent: 0 },
    elements: { wood: { count: 0, percent: 0 }, fire: { count: 0, percent: 0 }, earth: { count: 0, percent: 0 }, metal: { count: 0, percent: 0 }, water: { count: 0, percent: 0 } }
  };

  const tenGodsDistribution: TenGodsDistribution = {
    bigeop: { count: 0, label: '비겁 (비견·겁재)', description: '자의식의 힘, 독립심, 경쟁에서의 주도성을 의미합니다.' },
    siksang: { count: 0, label: '식상 (식신·상관)', description: '창의적인 표현력, 언변, 재능 발휘를 상징합니다.' },
    jaeseong: { count: 0, label: '재성 (편재·정재)', description: '현실적인 감각, 목표 달성 능력, 재물을 의미합니다.' },
    gwanseong: { count: 0, label: '관성 (편관·정관)', description: '사회적 책임, 명예, 조직 내의 규율을 의미합니다.' },
    inseong: { count: 0, label: '인성 (편인·정인)', description: '지혜, 학문적 성취, 문서운, 수용 능력을 상징합니다.' }
  };

  const fateFlow = parseFateFlowOnly(text);

  const tgKeys: Record<string, keyof typeof tenGodsDistribution> = {
    '비겁': 'bigeop', '식상': 'siksang', '재성': 'jaeseong', '관성': 'gwanseong', '인성': 'inseong'
  };
  let currentCategory: keyof typeof tenGodsDistribution | null = null;

  lines.forEach(line => {
    if (line.includes('陽 양')) {
      const m = line.match(/(\d+)개/); if(m) energyBalance.yang.count = parseInt(m[1]);
      const p = line.match(/(\d+)%/); if(p) energyBalance.yang.percent = parseInt(p[1]);
    }
    if (line.includes('陰 음')) {
      const m = line.match(/(\d+)개/); if(m) energyBalance.yin.count = parseInt(m[1]);
      const p = line.match(/(\d+)%/); if(p) energyBalance.yin.percent = parseInt(p[1]);
    }
    const elKeys: Record<string, keyof typeof energyBalance.elements> = {'木': 'wood', '火': 'fire', '土': 'earth', '金': 'metal', '水': 'water', '금': 'metal', '金': 'metal'};
    Object.entries(elKeys).forEach(([kw, key]) => {
      if (line.startsWith(kw)) {
        const m = line.match(/(\d+)개/); if(m) energyBalance.elements[key].count = parseInt(m[1]);
        const p = line.match(/(\d+)%/); if(p) energyBalance.elements[key].percent = parseInt(p[1]);
      }
    });
    for (const [kw, key] of Object.entries(tgKeys)) {
      if (line === kw || line.startsWith(kw + ' (')) {
        currentCategory = key;
        break;
      }
    }
    if (currentCategory && line.includes('개')) {
      const m = line.match(/(\d+)개/);
      if (m) {
        tenGodsDistribution[currentCategory].count = parseInt(m[1]);
      }
    }
  });

  return {
    name, gender,
    chartData: {
      solarDate, lunarDate,
      hourPillar: { tenGod: hour.tenGod || '-', stem: hour.stem || '-', branch: hour.branch || '-', branchTenGod: hour.branchTenGod || '-', lifeStage: hour.lifeStage || '-', symbolicStars: hour.symbolicStars || '-' },
      dayPillar: { tenGod: '일간(나)', stem: day.stem || '-', branch: day.branch || '-', branchTenGod: day.branchTenGod || '-', lifeStage: day.lifeStage || '-', symbolicStars: day.symbolicStars || '-' },
      monthPillar: { tenGod: month.tenGod || '-', stem: month.stem || '-', branch: month.branch || '-', branchTenGod: month.branchTenGod || '-', lifeStage: month.lifeStage || '-', symbolicStars: month.symbolicStars || '-' },
      yearPillar: { tenGod: year.tenGod || '-', stem: year.stem || '-', branch: year.branch || '-', branchTenGod: year.branchTenGod || '-', lifeStage: year.lifeStage || '-', symbolicStars: year.symbolicStars || '-' },
      usefulGods, energyBalance, tenGodsDistribution, fateFlow
    }
  };
};
