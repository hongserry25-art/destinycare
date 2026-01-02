
import React from 'react';
import { Chapter, SajuData, PillarData, TenGodsDistribution, FateFlowData, FatePillarInfo } from '../types';
import { MountainGraphic, CloudPattern, LogoStamp, RedStamp } from './Graphics';

interface PageProps {
  data: SajuData;
}

// 오행별 텍스트 색상 반환 함수
const getElementColor = (char: string) => {
  if (!char || char === '-' || char === '?') return 'text-gray-300';
  const wood = ['甲', '乙', '寅', '卯', '木', '목', '나무'];
  const fire = ['丙', '丁', '巳', '午', '火', '화', '불'];
  const earth = ['戊', '己', '辰', '戌', '丑', '未', '토', '土', '흙'];
  const metal = ['庚', '辛', '申', '酉', '金', '금', '金', '쇠'];
  const water = ['壬', '癸', '亥', '子', '수', '水', '물'];

  const c = char.trim();
  if (wood.some(val => c.includes(val))) return 'text-[#2D5A27]'; 
  if (fire.some(val => c.includes(val))) return 'text-[#C62828]'; 
  if (earth.some(val => c.includes(val))) return 'text-[#8D6E63]'; 
  if (metal.some(val => c.includes(val))) return 'text-[#757575]'; 
  if (water.some(val => c.includes(val))) return 'text-[#1A237E]'; 
  return 'text-[#333]';
};

const ELEMENT_BG_LIGHT: Record<string, string> = {
  wood: 'bg-[#E8F5E9]',
  fire: 'bg-[#FFEBEE]',
  earth: 'bg-[#FFF9C4]',
  metal: 'bg-[#F5F5F5]',
  water: 'bg-[#E3F2FD]',
  none: 'bg-[#F8F9FA]'
};

const ELEMENT_BORDER: Record<string, string> = {
  wood: 'border-[#C8E6C9]',
  fire: 'border-[#FFCDD2]',
  earth: 'border-[#FFF59D]',
  metal: 'border-[#E0E0E0]',
  water: 'border-[#BBDEFB]',
  none: 'border-[#E9ECEF]'
};

const ELEMENT_HANJA_ONLY: Record<string, string> = {
  wood: '木',
  fire: '火',
  earth: '土',
  metal: '金',
  water: '水'
};

const getElementKey = (char: string): string => {
  if (!char || char === '-' || char === '?') return 'none';
  const c = char.trim();
  if (['木', '목', '나무', '甲', '乙', '寅', '卯'].some(v => c.includes(v))) return 'wood';
  if (['火', '화', '불', '丙', '丁', '巳', '午'].some(v => c.includes(v))) return 'fire';
  if (['土', '토', '흙', '戊', '己', '辰', '戌', '丑', '未'].some(v => c.includes(v))) return 'earth';
  if (['金', '금', '金', '쇠', '庚', '辛', '申', '酉'].some(v => c.includes(v))) return 'metal';
  if (['水', '수', '물', '壬', '癸', '亥', '子'].some(v => c.includes(v))) return 'water';
  return 'none';
};

// 표지 페이지
export const CoverPage: React.FC<PageProps> = ({ data }) => (
  <div className="w-[210mm] h-[297mm] bg-[#FDFBF7] p-20 flex flex-col items-center justify-between shadow-xl paper-texture relative overflow-hidden print:shadow-none print:w-full">
    <CloudPattern className="absolute top-10 left-10 w-32 opacity-20" />
    <CloudPattern className="absolute top-20 right-10 w-40 opacity-20" />
    <div className="z-10 text-center mt-20">
      <div className="mb-12">
        <LogoStamp />
      </div>
      <h1 className="text-6xl font-bold tracking-[0.3em] text-[#1A1A1A] mb-6">운명 리포트</h1>
      <div className="w-24 h-1 bg-[#D4AF37] mx-auto mb-12"></div>
      <p className="text-2xl text-[#8B7E66] font-medium tracking-widest uppercase">Personal Destiny Archive</p>
    </div>
    <div className="z-10 text-center mb-20">
      <p className="text-4xl font-bold mb-4">{data.name} 님의 사주 분석</p>
      <p className="text-xl text-gray-500">{new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })} 발행</p>
    </div>
    <RedStamp className="absolute bottom-20 right-20" />
    <MountainGraphic className="opacity-40" />
  </div>
);

// 서문 페이지
export const IntroPage: React.FC<PageProps> = ({ data }) => (
  <div className="w-[210mm] h-[297mm] bg-[#FDFBF7] p-20 flex flex-col shadow-xl paper-texture print:shadow-none print:w-full">
    <div className="mb-16">
      <h2 className="text-4xl font-bold text-[#1A1A1A] mb-8 border-b-2 border-[#D4AF37] pb-4 inline-block">서문: 운명의 흐름을 읽다</h2>
    </div>
    <div className="text-lg leading-relaxed text-gray-700 space-y-6 font-medium">
      <p>사주(四柱)는 사람이 태어난 연(年), 월(月), 일(日), 시(時)의 네 기둥을 의미합니다. 이 네 기둥은 여덟 글자로 이루어져 있어 '사주팔자'라고도 불립니다.</p>
      <p>이 리포트는 귀하께서 태어난 순간 우주가 간직했던 오행(五行)의 기운을 분석하여, 삶의 방향성과 잠재력을 탐구하는 여정입니다. 사주는 결코 정해진 결말이 아닙니다. 오히려 우리가 어떤 기운을 타고났으며, 어떤 시기에 어떤 노력을 기울여야 하는지를 알려주는 인생의 지도와 같습니다.</p>
      <p>대한민국 최고의 명리학적 통찰과 인공지능 기술의 결합을 통해 도출된 이 분석 결과가 귀하의 앞날에 밝은 등불이 되기를 진심으로 기원합니다.</p>
    </div>
    <div className="mt-auto flex justify-end items-center gap-4">
      <div className="text-right">
        <p className="text-sm text-gray-400">명리학 전문가 그룹</p>
        <p className="text-xl font-bold text-[#D4AF37]">DESTINY CARE LABS</p>
      </div>
      <div className="w-12 h-12 border-2 border-[#D4AF37] flex items-center justify-center font-bold text-[#D4AF37]">印</div>
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

// 사주 원국표 페이지
export const SajuChartPage: React.FC<PageProps> = ({ data }) => {
  if (!data.chartData) return null;
  const { chartData } = data;
  
  const RowLabel = ({ label }: { label: string }) => (
    <div className="flex items-center justify-center bg-[#F8F9FA] border-b border-r border-gray-200 py-4 text-sm text-gray-500 font-medium text-center px-2">
      {label}
    </div>
  );
  
  const Cell = ({ content, className = "", isHanja = false }: { content: string, className?: string, isHanja?: boolean }) => (
    <div className={`flex items-center justify-center border-b border-r border-gray-200 py-4 text-base font-medium ${className} ${isHanja ? 'text-3xl font-serif' : ''}`}>
      {content || '-'}
    </div>
  );

  return (
    <div className="w-[210mm] h-[297mm] bg-[#FDFBF7] p-16 flex flex-col shadow-xl paper-texture print:shadow-none print:w-full">
      <div className="text-center mb-12">
        <h2 className="text-5xl font-bold text-[#333] mb-4 tracking-widest">사주원국표</h2>
      </div>
      
      <div className="text-center mb-10">
        <p className="text-3xl font-bold mb-2">{data.name} ({data.gender === 'male' ? '남' : '여'})</p>
        <p className="text-lg text-gray-500 font-medium">양력 {chartData.solarDate} / 음력 {chartData.lunarDate}</p>
      </div>

      <div className="border-t-2 border-l-2 border-[#333] grid grid-cols-[100px_1fr_1fr_1fr_1fr] mb-12 shadow-sm bg-white overflow-hidden rounded-sm">
        <div className="bg-[#F8F9FA] border-b border-r border-gray-200 py-4 text-center text-sm font-bold text-gray-700">구분</div>
        <div className="bg-[#F8F9FA] border-b border-r border-gray-200 py-4 text-center text-lg font-bold">시주</div>
        <div className="bg-[#F8F9FA] border-b border-r border-gray-200 py-4 text-center text-lg font-bold">일주</div>
        <div className="bg-[#F8F9FA] border-b border-r border-gray-200 py-4 text-center text-lg font-bold">월주</div>
        <div className="bg-[#F8F9FA] border-b border-r border-gray-200 py-4 text-center text-lg font-bold">년주</div>
        
        <RowLabel label="십성" /><Cell content={chartData.hourPillar.tenGod} /><Cell content={chartData.dayPillar.tenGod} /><Cell content={chartData.monthPillar.tenGod} /><Cell content={chartData.yearPillar.tenGod} />
        <RowLabel label="천간" /><Cell content={chartData.hourPillar.stem} isHanja className={getElementColor(chartData.hourPillar.stem)} /><Cell content={chartData.dayPillar.stem} isHanja className={getElementColor(chartData.dayPillar.stem)} /><Cell content={chartData.monthPillar.stem} isHanja className={getElementColor(chartData.monthPillar.stem)} /><Cell content={chartData.yearPillar.stem} isHanja className={getElementColor(chartData.yearPillar.stem)} />
        <RowLabel label="지지" /><Cell content={chartData.hourPillar.branch} isHanja className={getElementColor(chartData.hourPillar.branch)} /><Cell content={chartData.dayPillar.branch} isHanja className={getElementColor(chartData.dayPillar.branch)} /><Cell content={chartData.monthPillar.branch} isHanja className={getElementColor(chartData.monthPillar.branch)} /><Cell content={chartData.yearPillar.branch} isHanja className={getElementColor(chartData.yearPillar.branch)} />
        <RowLabel label="십성" /><Cell content={chartData.hourPillar.branchTenGod} /><Cell content={chartData.dayPillar.branchTenGod} /><Cell content={chartData.monthPillar.branchTenGod} /><Cell content={chartData.yearPillar.branchTenGod} />
        <RowLabel label="운성" /><Cell content={chartData.hourPillar.lifeStage} /><Cell content={chartData.dayPillar.lifeStage} /><Cell content={chartData.monthPillar.lifeStage} /><Cell content={chartData.yearPillar.lifeStage} />
        <RowLabel label="신살" /><Cell content={chartData.hourPillar.symbolicStars} /><Cell content={chartData.dayPillar.symbolicStars} /><Cell content={chartData.monthPillar.symbolicStars} /><Cell content={chartData.yearPillar.symbolicStars} />
      </div>

      <div className="bg-[#FAF9F6] p-10 rounded-[40px] border border-[#F2F0E9] shadow-sm">
        <div className="flex items-baseline gap-4 mb-8">
          <h3 className="text-3xl font-bold text-[#333]">용신분석</h3>
          <span className="text-[#8B7E66] text-base font-medium opacity-60">오행의 조화와 균형</span>
        </div>
        <div className="grid grid-cols-5 gap-4">
          {(Object.entries(chartData.usefulGods) as [string, string][]).map(([key, value]) => {
            const elKey = getElementKey(value);
            const label = key === 'yong' ? '용신' : key === 'hui' ? '희신' : key === 'gi' ? '기신' : key === 'gu' ? '구신' : '한신';
            return (
              <div key={key} className="flex flex-col items-center">
                <span className="text-sm text-gray-400 mb-3 font-bold">{label}</span>
                <div className={`w-full aspect-square ${ELEMENT_BG_LIGHT[elKey]} border-2 ${ELEMENT_BORDER[elKey]} rounded-2xl flex items-center justify-center shadow-sm`}>
                  <span className={`text-4xl font-serif font-bold ${getElementColor(value)}`}>{value}</span>
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
    <div className="w-[210mm] h-[297mm] bg-[#FDFBF7] p-16 flex flex-col shadow-xl paper-texture print:shadow-none print:w-full">
      <h2 className="text-4xl font-bold mb-12 text-center">오행 및 음양 분석</h2>
      
      <div className="grid grid-cols-2 gap-10 mb-16">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#F2F0E9]">
          <h3 className="text-xl font-bold mb-6 text-center">음양(陰陽) 조화</h3>
          <div className="flex items-center gap-4">
            <div className="flex-1 text-center">
              <div className="text-3xl font-bold text-gray-800 mb-1">{balance.yang.count}</div>
              <div className="text-sm text-gray-400 font-bold">陽 (양)</div>
              <div className="h-2 bg-gray-100 rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-[#D4AF37]" style={{ width: `${balance.yang.percent}%` }}></div>
              </div>
              <div className="text-xs mt-1 text-[#D4AF37] font-bold">{balance.yang.percent}%</div>
            </div>
            <div className="flex-1 text-center">
              <div className="text-3xl font-bold text-gray-800 mb-1">{balance.yin.count}</div>
              <div className="text-sm text-gray-400 font-bold">陰 (음)</div>
              <div className="h-2 bg-gray-100 rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-gray-800" style={{ width: `${balance.yin.percent}%` }}></div>
              </div>
              <div className="text-xs mt-1 text-gray-800 font-bold">{balance.yin.percent}%</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#F2F0E9]">
          <h3 className="text-xl font-bold mb-6 text-center">오행 구성</h3>
          <div className="space-y-4">
            {Object.entries(balance.elements).map(([key, value]) => (
              <div key={key} className="flex items-center gap-4">
                <span className={`w-8 font-bold text-sm ${getElementColor(ELEMENT_HANJA_ONLY[key])}`}>{ELEMENT_HANJA_ONLY[key]}</span>
                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                   <div className={`h-full ${
                     key === 'wood' ? 'bg-[#2D5A27]' : 
                     key === 'fire' ? 'bg-[#C62828]' : 
                     key === 'earth' ? 'bg-[#8D6E63]' : 
                     key === 'metal' ? 'bg-[#757575]' : 
                     'bg-[#1A237E]'
                   }`} style={{ width: `${value.percent}%`, opacity: 0.6 }}></div>
                </div>
                <span className="text-xs font-bold w-10 text-right">{value.count}개</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// 십성 분포 페이지
export const TenGodsDistributionPage: React.FC<PageProps> = ({ data }) => {
  const dist = data.chartData?.tenGodsDistribution;
  if (!dist) return null;
  return (
     <div className="w-[210mm] h-[297mm] bg-[#FDFBF7] p-16 flex flex-col shadow-xl paper-texture print:shadow-none print:w-full">
      <h2 className="text-4xl font-bold mb-12 text-center">십성(十星) 분포 분석</h2>
      <div className="space-y-6">
        {Object.entries(dist).map(([key, value]) => (
          <div key={key} className="bg-white p-8 rounded-3xl shadow-sm border border-[#F2F0E9] flex items-center gap-8">
            <div className="w-24 h-24 rounded-2xl bg-[#F8F9FA] border-2 border-gray-100 flex flex-col items-center justify-center shrink-0">
               <span className="text-3xl font-bold text-gray-800">{value.count}</span>
               <span className="text-xs text-gray-400 font-bold">개</span>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2 text-[#D4AF37]">{value.label}</h3>
              <p className="text-gray-600 leading-relaxed font-medium">{value.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 섹션 타이틀 페이지 (챕터 구분)
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

// 본문 내용 페이지
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
