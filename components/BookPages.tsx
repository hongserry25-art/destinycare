
import React from 'react';
import { Chapter, SajuData, PillarData, TenGodsDistribution, FateFlowData, FatePillarInfo } from '../types';
import { MountainGraphic, CloudPattern, PremiumLogo, HummingBirdGraphic, LeafDecoration, RedStamp } from './Graphics';

interface PageProps {
  data: SajuData;
}

const getElementColor = (char: string) => {
  if (!char || char === '-' || char === '?') return 'text-gray-300';
  const wood = ['甲', '乙', '寅', '卯', '木', '목', '나무'];
  const fire = ['丙', '丁', '巳', '午', '火', '화', '불'];
  const earth = ['戊', '己', '辰', '戌', '丑', '未', '토', '도', '흙'];
  const metal = ['庚', '辛', '申', '酉', '金', '금', '金', '쇠'];
  const water = ['壬', '癸', '亥', '子', '수', '水', '물'];

  const c = char.trim();
  if (wood.some(val => c.includes(val))) return 'text-[#6B8E6D]'; 
  if (fire.some(val => c.includes(val))) return 'text-[#C08282]'; 
  if (earth.some(val => c.includes(val))) return 'text-[#B99D75]'; 
  if (metal.some(val => c.includes(val))) return 'text-[#9292A1]'; 
  if (water.some(val => c.includes(val))) return 'text-[#6D8E9F]'; 
  return 'text-[#333]';
};

const ELEMENT_HANJA_ONLY: Record<string, string> = {
  wood: '木',
  fire: '火',
  earth: '土',
  metal: '金',
  water: '水'
};

const ELEMENT_KOREAN: Record<string, string> = {
  wood: '나무',
  fire: '불',
  earth: '흙',
  metal: '금',
  water: '물'
};

const ELEMENT_BAR_COLORS: Record<string, string> = {
  wood: 'bg-[#6B8E6D]',
  fire: 'bg-[#C08282]',
  earth: 'bg-[#B99D75]',
  metal: 'bg-[#9292A1]',
  water: 'bg-[#6D8E9F]'
};

// 십신용 메타데이터
const TENGOD_META: Record<string, { hanja: string; subLabel: string; bgColor: string; barColor: string; textColor: string }> = {
  bigeop: { hanja: '比', subLabel: '비견·겁재', bgColor: 'bg-[#F0F2F5]', barColor: 'bg-[#B8CAD4]', textColor: 'text-[#8499A5]' },
  siksang: { hanja: '食', subLabel: '식신·상관', bgColor: 'bg-[#E8F2E9]', barColor: 'bg-[#9CB8A0]', textColor: 'text-[#7A967F]' },
  jaeseong: { hanja: '財', subLabel: '편재·정재', bgColor: 'bg-[#F2E8E8]', barColor: 'bg-[#C29292]', textColor: 'text-[#A67575]' },
  gwanseong: { hanja: '官', subLabel: '편관·정관', bgColor: 'bg-[#E9E8F2]', barColor: 'bg-[#9C9AB8]', textColor: 'text-[#7B7996]' },
  inseong: { hanja: '印', subLabel: '편인·정인', bgColor: 'bg-[#F2EFE8]', barColor: 'bg-[#B8A68B]', textColor: 'text-[#96846B]' },
};

// 표지 페이지
export const CoverPage: React.FC<PageProps> = ({ data }) => (
  <div className="w-[210mm] h-[297mm] bg-[#063B43] flex flex-col items-center shadow-xl relative overflow-hidden print:shadow-none print:w-full">
    <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay paper-texture"></div>
    <div className="absolute top-0 right-0 w-80 h-96 opacity-40">
      <LeafDecoration className="w-full h-full scale-x-[-1] brightness-125" />
    </div>
    <div className="absolute bottom-0 left-0 w-full h-[400px] opacity-30">
       <LeafDecoration className="w-full h-full brightness-150 rotate-90 scale-150 translate-y-1/2" />
    </div>
    <div className="absolute top-[35%] right-[15%] w-48 h-48 bg-[#D4AF37]/20 rounded-full blur-2xl"></div>
    <div className="absolute top-[38%] right-[18%] w-32 h-32 bg-[#D4AF37]/30 rounded-full border border-white/10 flex items-center justify-center">
       <div className="w-full h-full rounded-full paper-texture opacity-20"></div>
    </div>
    <div className="mt-24 z-20">
      <PremiumLogo />
    </div>
    <div className="flex-1 flex flex-col items-center justify-center z-20 -mt-10">
      <h1 className="text-6xl font-bold tracking-[0.2em] text-white mb-6 drop-shadow-lg">
        프리미엄 사주 분석서
      </h1>
      <div className="text-white/60 text-xl tracking-[0.5em] font-light">
        심층 운명 분석
      </div>
    </div>
    <div className="mb-32 z-20">
      <div className="bg-white/5 backdrop-blur-md border border-white/10 px-12 py-6 rounded-2xl flex flex-col items-center gap-1 shadow-2xl min-w-[300px]">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-medium text-white tracking-widest">{data.name}</span>
          <span className="text-white/40 text-sm font-light">님</span>
        </div>
        <div className="h-[1px] w-12 bg-[#D4AF37]/40 my-2"></div>
      </div>
    </div>
    <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-white/10 to-transparent"></div>
  </div>
);

// 서문 페이지
export const IntroPage: React.FC<PageProps> = ({ data }) => (
  <div className="w-[210mm] h-[297mm] bg-[#FDFBF7] p-24 flex flex-col shadow-xl paper-texture print:shadow-none print:w-full relative">
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent opacity-50"></div>
    <div className="mt-32 mb-20">
      <h2 className="text-[2.6rem] font-bold text-[#333] leading-snug mb-2 font-serif">
        "사람의 명(命)은 하늘이 정하고,<br />
        운(運)은 자신이 개척하는 것입니다."
      </h2>
    </div>
    <div className="space-y-10 text-[1.15rem] leading-[2] text-[#555] font-medium">
      <p>안녕하십니까, {data.name}님.</p>
      <p>
        우리는 누구나 자신만의 독특한 삶의 지도를 가지고 태어납니다. 사주(四柱)는 바로 그 지도를 읽어내는 오래된 지혜입니다.
      </p>
      <p>
        본 분석지는 {data.name}님의 생년월일시를 바탕으로 음양오행의 조화를 살피고, 다가올 운의 흐름을 분석하여 더 나은 미래를 준비할 수 있도록 돕기 위해 제작되었습니다.
      </p>
      <p>
        이 분석서가 {data.name}님의 삶에 작은 등불이 되어 풍요로운 결실을 맺는 밑거름이 되기를 기원합니다.
      </p>
    </div>
    <div className="mt-auto flex flex-col items-end gap-6 pb-12">
      <div className="w-16 h-[1px] bg-[#D4AF37]/40"></div>
      <div className="text-right">
        <p className="text-2xl font-bold text-[#8B7E66] tracking-widest font-serif">운명케어연구소 일동</p>
      </div>
    </div>
  </div>
);

// 목차 페이지
export const TableOfContents: React.FC<{ data: SajuData; pageMap: Map<number, number> }> = ({ data, pageMap }) => (
  <div className="w-[210mm] h-[297mm] bg-[#FDFBF7] p-20 flex flex-col shadow-xl paper-texture print:shadow-none print:w-full">
    <h2 className="text-4xl font-bold text-[#1A1A1A] mb-16 text-center tracking-widest">목 차</h2>
    <div className="space-y-8 max-w-2xl mx-auto w-full">
      <div className="flex justify-between items-end border-b border-dotted border-gray-300 pb-2">
        <span className="text-xl font-bold">1. 사주 원국 정보</span>
        <span className="text-lg font-medium text-gray-400">04</span>
      </div>
      <div className="flex justify-between items-end border-b border-dotted border-gray-300 pb-2">
        <span className="text-xl font-bold">2. 오행 및 음양 분석</span>
        <span className="text-lg font-medium text-gray-400">05</span>
      </div>
      {data.chapters.filter(ch => ch.active).map((ch, idx) => (
        <div key={ch.id} className="flex justify-between items-end border-b border-dotted border-gray-300 pb-2">
          <div className="flex flex-col">
            <span className="text-sm text-[#D4AF37] font-bold">CHAPTER {idx + 1}</span>
            <span className="text-xl font-bold">{ch.title.replace('\n', ' ')}</span>
          </div>
          <span className="text-lg font-medium text-gray-400">{String(pageMap.get(ch.id) || 0).padStart(2, '0')}</span>
        </div>
      ))}
    </div>
  </div>
);

const PillarCard = ({ pillar, label, isMe = false }: { pillar: PillarData, label: string, isMe?: boolean }) => (
  <div className="flex flex-col items-center">
    <span className="text-gray-400 font-bold mb-4 text-sm tracking-widest">{label}</span>
    <div className={`w-40 bg-[#FAF9F6] border-2 ${isMe ? 'border-[#8B7E66] shadow-xl scale-105 z-10' : 'border-[#F2F0E9]'} rounded-3xl p-6 flex flex-col items-center gap-2 mb-4 transition-all`}>
      <span className="text-xs text-gray-400 font-bold">{pillar.tenGod}</span>
      <span className={`text-6xl font-serif font-medium ${getElementColor(pillar.stem)}`}>{pillar.stem}</span>
      <div className="w-10 h-[1px] bg-gray-200 my-1" />
      <span className={`text-6xl font-serif font-medium ${getElementColor(pillar.branch)}`}>{pillar.branch}</span>
      <span className="text-xs text-gray-400 font-bold">{pillar.branchTenGod}</span>
    </div>
    <div className="flex flex-col items-center gap-1">
      <span className="text-gray-500 text-sm font-medium">{pillar.lifeStage}</span>
      <span className="text-gray-400 text-xs">{pillar.symbolicStars}</span>
    </div>
  </div>
);

export const SajuChartPage: React.FC<PageProps> = ({ data }) => {
  if (!data.chartData) return null;
  const { chartData } = data;
  return (
    <div className="w-[210mm] h-[297mm] bg-[#FDFBF7] p-20 flex flex-col shadow-xl paper-texture print:shadow-none print:w-full items-center">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-serif text-[#333] mb-4 tracking-[0.2em]">— 사주원국표 —</h2>
        <p className="text-[#BCA37F] text-sm tracking-[0.4em] font-medium uppercase mb-16">Four Pillars of Destiny</p>
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-4">
            <span className="text-3xl font-medium text-[#444]">{data.name}</span>
            <span className="text-lg text-[#D2B4B4] font-medium">{data.gender === 'male' ? '남' : '여'}</span>
          </div>
          <div className="text-gray-400 flex items-center gap-3 text-lg">
            <span>{chartData.solarDate}</span>
            <span className="opacity-30">·</span>
            <span>태어난 시</span>
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-6 mb-24 w-full">
        <PillarCard pillar={chartData.hourPillar} label="시주" />
        <PillarCard pillar={chartData.dayPillar} label="일주" isMe={true} />
        <PillarCard pillar={chartData.monthPillar} label="월주" />
        <PillarCard pillar={chartData.yearPillar} label="년주" />
      </div>
      <div className="w-full bg-[#FCF9F2] p-12 rounded-[40px] border border-[#F2F0E9] flex flex-col items-center">
        <div className="flex flex-col items-center mb-10">
          <h3 className="text-2xl font-serif text-[#8B7E66] mb-3">용신 분석</h3>
          <div className="w-16 h-[2px] bg-[#8B7E66]" />
        </div>
        <div className="flex justify-center gap-10">
          {(Object.entries(chartData.usefulGods) as [string, string][]).map(([key, value]) => {
            const label = key === 'yong' ? '용신' : key === 'hui' ? '희신' : key === 'gi' ? '기신' : key === 'gu' ? '구신' : '한신';
            return (
              <div key={key} className="flex flex-col items-center gap-4">
                <span className="text-xs text-gray-400 font-bold">{label}</span>
                <div className="w-20 h-20 rounded-full bg-white shadow-lg border border-gray-50 flex items-center justify-center">
                  <span className={`text-3xl font-serif font-bold ${getElementColor(value)}`}>{value}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// 에너지 밸런스 페이지
export const EnergyBalancePage: React.FC<PageProps> = ({ data }) => {
  const balance = data.chartData?.energyBalance;
  if (!balance) return null;

  return (
    <div className="w-[210mm] h-[297mm] bg-[#FDFBF7] p-20 flex flex-col shadow-xl paper-texture print:shadow-none print:w-full">
      <div className="text-center mb-16">
        <h2 className="text-[2.2rem] font-serif text-[#8B7E66] mb-3 tracking-[0.2em]">— 음 양 오 행 —</h2>
        <p className="text-[#C0B29A] text-xs tracking-[0.4em] font-medium uppercase">YIN YANG & FIVE ELEMENTS</p>
      </div>

      <div className="w-full bg-[#FCF9F2] p-12 rounded-[24px] border border-[#F0EAE0] mb-12 shadow-sm">
        <h3 className="text-center text-[#8B7E66] text-xl font-serif mb-8 tracking-widest">음양의 조화</h3>
        <div className="w-full h-4 bg-[#E5EFF5] rounded-full overflow-hidden flex mb-10">
          <div className="h-full bg-[#C08282]" style={{ width: `${balance.yang.percent}%` }}></div>
        </div>
        <div className="flex items-center justify-between relative px-2">
          <div className="flex flex-col">
            <span className="text-gray-400 text-xs font-bold mb-4 tracking-tighter">양 Yang</span>
            <div className="flex items-baseline gap-1">
              <span className="text-[2.8rem] font-serif text-[#C08282] leading-none">{balance.yang.percent}</span>
              <span className="text-lg text-[#C08282] font-serif">%</span>
            </div>
            <span className="text-gray-400 text-sm mt-1">{balance.yang.count}개</span>
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 top-0 h-full w-[1px] bg-[#E0D5C1]"></div>
          <div className="flex flex-col items-end">
            <span className="text-gray-400 text-xs font-bold mb-4 tracking-tighter">음 Yin</span>
            <div className="flex items-baseline gap-1">
              <span className="text-[2.8rem] font-serif text-[#6D8E9F] leading-none">{balance.yin.percent}</span>
              <span className="text-lg text-[#6D8E9F] font-serif">%</span>
            </div>
            <span className="text-gray-400 text-sm mt-1 text-right">{balance.yin.count}개</span>
          </div>
        </div>
      </div>

      <div className="w-full bg-[#FCF9F2] p-12 rounded-[24px] border border-[#F0EAE0] mb-12 shadow-sm">
        <div className="flex flex-col items-center mb-10">
           <h3 className="text-[#8B7E66] text-xl font-serif tracking-widest mb-2">오행 분포</h3>
           <div className="w-12 h-[2px] bg-[#8B7E66]/60"></div>
        </div>
        <div className="space-y-6">
          {(Object.entries(balance.elements) as [string, { count: number; percent: number }][]).map(([key, value]) => (
            <div key={key} className="flex items-center gap-6">
              <span className={`text-3xl font-serif font-medium w-10 text-center ${getElementColor(ELEMENT_HANJA_ONLY[key])}`}>
                {ELEMENT_HANJA_ONLY[key]}
              </span>
              <div className="flex-1 h-8 bg-[#F0F2F5] rounded-lg overflow-hidden relative">
                <div 
                  className={`h-full ${ELEMENT_BAR_COLORS[key]} rounded-lg transition-all duration-1000`} 
                  style={{ width: `${Math.max(5, value.percent)}%` }}
                ></div>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">
                  {value.count}개
                </span>
              </div>
              <span className="w-12 text-right text-gray-300 text-sm font-medium">{ELEMENT_KOREAN[key]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-12 px-4">
        <div>
          <h4 className="text-[#8B7E66] font-bold mb-3 text-lg">음양</h4>
          <p className="text-gray-400 text-sm leading-relaxed font-medium">
            만물을 이루는 두 가지 상반된 기운으로, 조화와 균형이 중요합니다.
          </p>
        </div>
        <div>
          <h4 className="text-[#8B7E66] font-bold mb-3 text-lg">오행</h4>
          <p className="text-gray-400 text-sm leading-relaxed font-medium">
            목화토금수 다섯 기운의 분포가 타고난 성향과 운의 흐름을 나타냅니다.
          </p>
        </div>
      </div>
    </div>
  );
};

// 십신 분포 페이지 (사용자 요청 이미지 형식 반영)
export const TenGodsDistributionPage: React.FC<PageProps> = ({ data }) => {
  const dist = data.chartData?.tenGodsDistribution;
  if (!dist) return null;

  return (
     <div className="w-[210mm] h-[297mm] bg-[#FDFBF7] p-20 flex flex-col shadow-xl paper-texture print:shadow-none print:w-full">
      {/* Header */}
      <div className="text-center mb-16">
        <h2 className="text-[2.2rem] font-serif text-[#8B7E66] mb-3 tracking-[0.2em]">— 십 신 분 포 —</h2>
        <p className="text-[#C0B29A] text-xs tracking-[0.4em] font-medium uppercase">TEN GODS DISTRIBUTION</p>
      </div>

      <div className="space-y-10">
        {(Object.entries(dist) as [string, { count: number; label: string; description: string }][]).map(([key, value]) => {
          const meta = TENGOD_META[key] || TENGOD_META.bigeop;
          // 바 비율 계산 (전체 8개 사주 원국 기준)
          const barWidth = Math.min(100, (value.count / 8) * 100);

          return (
            <div key={key} className="flex flex-col gap-4 border-b border-[#F0EAE0] pb-10 last:border-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  {/* Hanja Box */}
                  <div className={`w-20 h-20 rounded-[18px] ${meta.bgColor} flex items-center justify-center border border-gray-100/50 shadow-sm`}>
                    <span className={`text-4xl font-serif font-medium ${meta.textColor}`}>{meta.hanja}</span>
                  </div>
                  {/* Title & SubTitle */}
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-[#444] tracking-tight">{value.label.split(' ')[0]}</span>
                    <span className="text-xs text-gray-300 font-bold tracking-tight uppercase">{meta.subLabel}</span>
                  </div>
                </div>
                {/* Count */}
                <div className="flex items-baseline gap-2">
                  <span className="text-[2.8rem] font-serif text-[#B0B8C1] leading-none">{value.count}</span>
                  <span className="text-gray-300 font-bold">개</span>
                </div>
              </div>

              {/* Progress Bar Container */}
              <div className="w-full h-4 bg-[#F0F2F5] rounded-full overflow-hidden relative">
                <div 
                  className={`h-full ${meta.barColor} transition-all duration-1000`}
                  style={{ width: `${Math.max(barWidth, value.count > 0 ? 5 : 0)}%` }}
                ></div>
              </div>

              {/* Description */}
              <p className="text-[#B0B8C1] text-sm font-medium leading-relaxed tracking-tight">
                {value.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const SectionTitlePage: React.FC<{ chapter: Chapter; index: number }> = ({ chapter, index }) => (
  <div className="w-[210mm] h-[297mm] bg-[#1A1A1A] p-20 flex flex-col items-center justify-center shadow-xl relative overflow-hidden print:shadow-none print:w-full">
    <div className="text-center z-10">
      <span className="text-[#D4AF37] text-2xl font-bold tracking-[0.5em] block mb-8 uppercase">Chapter {index + 1}</span>
      <h2 className="text-white text-6xl font-bold mb-6 whitespace-pre-line leading-tight">{chapter.title}</h2>
      <div className="w-20 h-1 bg-[#D4AF37] mx-auto mb-8"></div>
      <p className="text-gray-400 text-xl tracking-widest">{chapter.subtitle}</p>
    </div>
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[30rem] font-serif font-black text-white/5 pointer-events-none">
      {index + 1}
    </div>
  </div>
);

export const ContentPage: React.FC<{ chapter: Chapter; data: SajuData; index: number; pageIndex: number; totalPages: number; contentOverride?: string }> = ({ chapter, data, index, pageIndex, totalPages, contentOverride }) => (
  <div className="w-[210mm] h-[297mm] bg-[#FDFBF7] p-20 flex flex-col shadow-xl paper-texture relative print:shadow-none print:w-full">
    <div className="flex justify-between items-center mb-16 border-b border-gray-100 pb-4">
      <span className="text-sm font-bold text-[#D4AF37]">CHAPTER {index + 1}: {chapter.title.split('\n')[0]}</span>
      <span className="text-sm font-bold text-gray-300">{data.name} 님의 운명 리포트</span>
    </div>
    <div className="flex-1">
      <div className="text-lg leading-[2] text-gray-700 font-medium whitespace-pre-wrap">
        {contentOverride || chapter.content}
      </div>
    </div>
    <div className="mt-16 flex justify-between items-end">
      <div className="w-12 h-12 border border-[#D4AF37]/30 flex items-center justify-center">
        <span className="text-[#D4AF37]/50 text-xs font-bold">DESTINY</span>
      </div>
      <div className="text-gray-400 font-bold text-sm tracking-widest">
        - {pageIndex + 1} / {totalPages} -
      </div>
    </div>
  </div>
);
