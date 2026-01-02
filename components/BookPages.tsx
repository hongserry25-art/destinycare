
import React from 'react';
import { Chapter, SajuData, PillarData, TenGodsDistribution, FateFlowData, FatePillarInfo } from '../types';
import { MountainGraphic, CloudPattern, LogoStamp, RedStamp } from './Graphics';

interface PageProps {
  data: SajuData;
}

const getElementColor = (char: string) => {
  if (!char || char === '-') return 'text-gray-300';
  const wood = ['甲', '乙', '寅', '卯', '木', '목'];
  const fire = ['丙', '丁', '巳', '午', '火', '화'];
  const earth = ['戊', '己', '辰', '戌', '丑', '未', '토', '土'];
  const metal = ['庚', '辛', '申', '酉', '金', '금', '金'];
  const water = ['壬', '癸', '亥', '子', '수', '水', 'water'];

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

const ELEMENT_TEXT_KOR: Record<string, string> = {
  wood: '나무',
  fire: '불',
  earth: '흙',
  metal: '금',
  water: '물'
};

const ELEMENT_HANJA_ONLY: Record<string, string> = {
  wood: '木',
  fire: '火',
  earth: '土',
  metal: '金',
  water: '水'
};

const getElementKey = (char: string): string => {
  if (!char || char === '-') return 'none';
  const c = char.trim();
  if (['木', '목'].includes(c)) return 'wood';
  if (['火', '화'].includes(c)) return 'fire';
  if (['土', '토', '地', '土'].includes(c)) return 'earth';
  if (['金', '금', '金'].includes(c)) return 'metal';
  if (['水', '수'].includes(c)) return 'water';
  return 'none';
};

// 운명의 흐름 시각화 페이지
export const FateFlowPage: React.FC<PageProps> = ({ data }) => {
  if (!data.chartData?.fateFlow) return null;
  const flow = data.chartData.fateFlow;
  
  const pillars: Array<{ key: keyof FateFlowData; label: string; han: string }> = [
    { key: 'year', label: '년주', han: '年' },
    { key: 'month', label: '월주', han: '月' },
    { key: 'day', label: '일주', han: '日' },
    { key: 'hour', label: '시주', han: '時' },
  ];

  return (
    <div className="w-[210mm] h-[297mm] bg-[#FDFBF7] px-16 py-12 flex flex-col shadow-xl paper-texture relative print:shadow-none print:w-full overflow-hidden">
      <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-100">
        <span className="text-[10px] font-bold text-[#D4AF37]">특별 분석 : 운명의 흐름</span>
        <span className="text-[10px] text-gray-400">{data.name}님의 사주 분석서</span>
      </div>

      <div className="flex-1 flex flex-col">
        <h3 className="text-2xl font-bold text-center mb-10 text-[#111] tracking-widest">운명의 흐름 (四柱時流)</h3>
        <div className="relative flex flex-col items-center flex-1">
          {/* 중앙 연결선 - 노드 크기에 맞춰 위치 조정 */}
          <div className="absolute top-8 bottom-8 left-[32px] w-[1px] bg-gray-200"></div>

          <div className="w-full space-y-6">
            {pillars.map((p) => {
              const isDay = p.key === 'day';
              const pData = flow[p.key];
              
              return (
                <div key={p.key} className="flex items-start gap-8 relative z-10">
                  {/* 노드 아이콘 - 크기 축소 (64px) */}
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center border flex-shrink-0 transition-all ${isDay ? 'bg-[#C62828] border-[#C62828] text-white shadow-md' : 'bg-white border-gray-200 text-[#999]'}`}>
                    <span className="text-2xl font-serif font-medium">{p.han}</span>
                  </div>
                  
                  {/* 내용 박스 */}
                  <div className="flex-1">
                     <div className="flex items-center gap-2 mb-2">
                       <span className="text-xl font-bold text-[#111]">{p.label}</span>
                     </div>
                     
                     {isDay ? (
                       <div className="rounded-2xl p-4 border border-red-100 bg-white shadow-sm">
                          <div className="mb-3">
                            <span className="text-[10px] font-bold text-red-500 mb-2 block">핵심 기운</span>
                            <div className="flex flex-wrap gap-1.5 pb-3 border-b border-gray-50">
                              {(pData.mainStars || []).map((s, idx) => (
                                <span key={idx} className="px-3 py-1 rounded-lg border border-red-100 text-red-600 font-bold bg-red-50/20 text-xs">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="pt-1">
                            <span className="text-[10px] font-bold text-gray-300 mb-2 block uppercase tracking-wider">상세 분석</span>
                            <div className="flex flex-wrap gap-1.5">
                              {(pData.detailStars || []).map((s, idx) => {
                                const isLong = s.length > 15;
                                return isLong ? (
                                  <div key={idx} className="w-full text-xs text-gray-600 leading-normal py-0.5 flex gap-2">
                                    <span className="text-red-300 flex-shrink-0">•</span>
                                    <span>{s}</span>
                                  </div>
                                ) : (
                                  <span key={idx} className="px-2 py-0.5 rounded-md border border-gray-100 bg-gray-50/30 text-gray-500 text-[10px] font-medium">
                                    #{s}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                       </div>
                     ) : (
                       <div className="rounded-2xl p-4 border border-gray-100 bg-[#F9FAFB]/50">
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {(pData.mainStars || []).map((s, idx) => (
                              <span key={idx} className="px-3 py-1 rounded-lg border border-gray-100 bg-white text-gray-600 font-bold shadow-sm text-xs">
                                {s}
                              </span>
                            ))}
                          </div>
                          <div className="flex flex-col gap-1">
                            {(pData.detailStars || []).map((s, idx) => (
                              <div key={idx} className="flex items-start gap-2">
                                <span className="text-xs text-gray-300 font-bold flex-shrink-0 mt-0.5">•</span>
                                <span className="text-xs text-gray-500 leading-snug font-medium">{s}</span>
                              </div>
                            ))}
                          </div>
                       </div>
                     )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="mt-4 pt-2 flex justify-center border-t border-gray-50">
        <span className="text-gray-300 font-mono text-[9px]">Destiny Flow Analysis</span>
      </div>
    </div>
  );
};

export const CoverPage: React.FC<PageProps> = ({ data }) => {
  return (
    <div className="w-[210mm] h-[297mm] bg-[#FDFBF7] relative flex flex-col items-center justify-between py-20 overflow-hidden shadow-xl paper-texture print:shadow-none print:w-full">
      <div className="absolute top-10 right-10 text-[#8B7E66] font-medium tracking-widest text-sm">운명케어연구소 : 사주분석지</div>
      <CloudPattern className="absolute top-32 left-10 w-24 opacity-50" />
      <CloudPattern className="absolute top-20 right-32 w-20 opacity-40" />
      <div className="mt-20 text-center z-10">
        <LogoStamp />
        <h2 className="text-[#8B7E66] text-xl tracking-[0.3em] mb-2 font-light uppercase">운명케어연구소</h2>
      </div>
      <div className="z-10 text-center mb-10">
        <h1 className="text-6xl text-[#5D5D5D] tracking-widest font-bold mb-16">심층 사주 분석지</h1>
        <div className="bg-[#DBCFB0] bg-opacity-40 border border-[#C8A97E] px-16 py-10 rounded-sm inline-block shadow-sm">
          <div className="text-4xl text-[#3E3E3E] font-medium tracking-widest">{data.name} <span className="text-xl">귀하</span></div>
          <div className="mt-4 text-[#8B7E66] text-lg tracking-tighter">{data.birthDate} / {data.gender === 'male' ? '乾命' : '坤命'}</div>
        </div>
      </div>
      <div className="relative w-full z-10"><MountainGraphic /><div className="absolute bottom-10 right-10"><RedStamp /></div></div>
    </div>
  );
};

export const IntroPage: React.FC<PageProps> = ({ data }) => {
  return (
    <div className="w-[210mm] h-[297mm] bg-[#FDFBF7] px-16 py-20 flex flex-col justify-center shadow-xl paper-texture print:shadow-none print:w-full">
      <div className="max-w-2xl mx-auto space-y-10 w-full">
        <h2 className="text-4xl text-[#3E3E3E] leading-[1.4] font-bold break-keep">
          <span className="block">"사람의 명(命)은 하늘이 정하고,</span>
          <span className="block">운(運)은 자신이 개척하는 것입니다."</span>
        </h2>
        <div className="space-y-6 text-[#5D5D5D] leading-[1.8] text-xl font-serif break-keep">
          <p>안녕하십니까, {data.name}님.</p>
          <p>우리는 누구나 자신만의 독특한 삶의 지도를 가지고 태어납니다. 사주(四柱)는 바로 그 지도를 읽어내는 오래된 지혜입니다.</p>
          <p>본 분석지는 {data.name}님의 생년월일시를 바탕으로 음양오행의 조화를 살피고, 다가올 운의 흐름을 분석하여 더 나은 미래를 준비할 수 있도록 돕기 위해 제작되었습니다.</p>
          <p>이 분석서가 {data.name}님의 삶에 작은 등불이 되어 풍요로운 결실을 맺는 밑거름이 되기를 기원합니다.</p>
        </div>
        <div className="pt-16 text-right"><p className="text-[#8B7E66] text-2xl tracking-widest font-bold">운명케어연구소 일동</p></div>
      </div>
    </div>
  );
};

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
        
        <RowLabel label="십성" /><Cell content={chartData.hourPillar.tenGod} /><Cell content="일간(나)" className="text-gray-400" /><Cell content={chartData.monthPillar.tenGod} /><Cell content={chartData.yearPillar.tenGod} />
        <RowLabel label="천간" /><Cell content={chartData.hourPillar.stem} isHanja className={getElementColor(chartData.hourPillar.stem)} /><Cell content={chartData.dayPillar.stem} isHanja className={getElementColor(chartData.dayPillar.stem)} /><Cell content={chartData.monthPillar.stem} isHanja className={getElementColor(chartData.monthPillar.stem)} /><Cell content={chartData.yearPillar.stem} isHanja className={getElementColor(chartData.yearPillar.stem)} />
        <RowLabel label="지지" /><Cell content={chartData.hourPillar.branch} isHanja className={getElementColor(chartData.hourPillar.branch)} /><Cell content={chartData.dayPillar.branch} isHanja className={getElementColor(chartData.dayPillar.branch)} /><Cell content={chartData.monthPillar.branch} isHanja className={getElementColor(chartData.monthPillar.branch)} /><Cell content={chartData.yearPillar.branch} isHanja className={getElementColor(chartData.yearPillar.branch)} />
        <RowLabel label="십성" /><Cell content={chartData.hourPillar.branchTenGod} /><Cell content={chartData.dayPillar.branchTenGod} /><Cell content={chartData.monthPillar.branchTenGod} /><Cell content={chartData.yearPillar.branchTenGod} />
        <RowLabel label="운성" /><Cell content={chartData.hourPillar.lifeStage} /><Cell content={chartData.dayPillar.lifeStage} /><Cell content={chartData.monthPillar.lifeStage} /><Cell content={chartData.yearPillar.lifeStage} />
        <RowLabel label="신살" /><Cell content={chartData.hourPillar.symbolicStars} /><Cell content={chartData.dayPillar.symbolicStars} /><Cell content={chartData.monthPillar.symbolicStars} /><Cell content={chartData.yearPillar.symbolicStars} />
      </div>

      <div className="bg-[#FAF9F6] p-12 rounded-[40px] border border-[#F2F0E9] shadow-sm">
        <div className="flex items-baseline gap-4 mb-10">
          <h3 className="text-4xl font-bold text-[#333]">용신분석</h3>
          <span className="text-[#8B7E66] text-lg font-medium opacity-60">오행의 조화와 균형</span>
        </div>
        <div className="grid grid-cols-5 gap-6">
          {(Object.entries(chartData.usefulGods) as [string, string][]).map(([key, value]) => {
            const elKey = getElementKey(value);
            const label = key === 'yong' ? '용신' : key === 'hui' ? '희신' : key === 'gi' ? '기신' : key === 'gu' ? '구신' : '한신';
            return (
              <div key={key} className="flex flex-col items-center">
                <span className="text-lg text-gray-400 mb-4 font-bold">{label}</span>
                <div className={`w-full aspect-square max-w-[140px] ${ELEMENT_BG_LIGHT[elKey]} border-2 ${ELEMENT_BORDER[elKey]} rounded-[28px] flex items-center justify-center shadow-sm transition-all hover:scale-[1.02]`}>
                  <span className={`text-5xl font-serif font-bold ${getElementColor(value)}`}>{value}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const EnergyBalancePage: React.FC<PageProps> = ({ data }) => {
  if (!data.chartData?.energyBalance) return null;
  const { energyBalance } = data.chartData;
  return (
    <div className="w-[210mm] h-[297mm] bg-[#FDFBF7] p-16 flex flex-col shadow-xl paper-texture print:shadow-none print:w-full">
      <div className="text-center mb-12">
        <p className="text-[#8B7E66] tracking-widest text-sm mb-2">음양오행</p>
        <h2 className="text-5xl font-bold text-[#333]">에너지의 균형 분석</h2>
      </div>

      <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100 mb-8">
        <h3 className="text-xl font-bold mb-6 text-[#333]">음양의 조화</h3>
        <div className="flex h-12 rounded-full overflow-hidden shadow-inner border border-gray-100">
          <div className="bg-[#444C5C] flex items-center justify-center text-white text-sm font-bold" style={{ width: `${energyBalance.yang.percent}%` }}>陽 {energyBalance.yang.count}개 ({energyBalance.yang.percent}%)</div>
          <div className="bg-[#7B7B7B] flex items-center justify-center text-white text-sm font-bold" style={{ width: `${energyBalance.yin.percent}%` }}>陰 {energyBalance.yin.count}개 ({energyBalance.yin.percent}%)</div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100 flex-1">
        <h3 className="text-xl font-bold mb-8 text-[#333]">오행 분포도</h3>
        <div className="space-y-6 px-4">
          {(Object.entries(energyBalance.elements) as [string, { count: number; percent: number }][]).map(([key, value]) => (
            <div key={key} className="flex items-center gap-6">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-sm ${key==='wood'?'bg-[#769A86]':key==='fire'?'bg-[#D87F71]':key==='earth'?'bg-[#B79268]':key==='metal'?'bg-[#B5BAA1]':'bg-[#4F5B73]'}`}>
                {ELEMENT_HANJA_ONLY[key]}
              </div>
              <div className="w-16 font-medium text-gray-600 text-lg">{ELEMENT_TEXT_KOR[key]}</div>
              <div className="flex-1 bg-gray-100 h-10 rounded-full relative overflow-hidden shadow-inner border border-gray-50">
                <div 
                  className={`h-full transition-all duration-1000 flex items-center justify-end pr-4 text-xs font-bold text-white shadow-sm ${key==='wood'?'bg-[#769A86]':key==='fire'?'bg-[#D87F71]':key==='earth'?'bg-[#B79268]':key==='metal'?'bg-[#B5BAA1]':'bg-[#4F5B73]'}`} 
                  style={{ width: `${value.percent}%` }}
                >
                  {value.percent > 10 && `${value.percent}%`}
                </div>
              </div>
              <div className="w-16 text-right font-bold text-lg text-[#333]">{value.count}개</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-10 mt-10 pt-8 border-t border-gray-100">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full bg-[#D87F71]" />
            <h4 className="font-bold text-[#333]">음양이란</h4>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed font-light">세상 만물을 이루는 두 가지 상반된 기운입니다. 양(陽)은 빛, 발산, 활동적인 에너지를 의미하며, 음(陰)은 어둠, 수렴, 차분한 에너지를 뜻합니다.</p>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full bg-[#769A86]" />
            <h4 className="font-bold text-[#333]">오행이란</h4>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed font-light">목화토금수 다섯 가지 기운의 분포입니다. 많은 기운은 나의 핵심 성향을, 적은 기운은 보완이 필요한 부분을 나타냅니다.</p>
        </div>
      </div>
    </div>
  );
};

export const TenGodsDistributionPage: React.FC<PageProps> = ({ data }) => {
  if (!data.chartData?.tenGodsDistribution) return null;
  const { tenGodsDistribution } = data.chartData;

  const getTenGodIcon = (key: string) => {
    switch (key) {
      case 'bigeop': return { han: '比', color: '#3B82F6', bg: '#EFF6FF' };
      case 'siksang': return { han: '食', color: '#9CA3AF', bg: '#F9FAFB' };
      case 'jaeseong': return { han: '財', color: '#EF4444', bg: '#FEF2F2' };
      case 'gwanseong': return { han: '官', color: '#8B5CF6', bg: '#F5F3FF' };
      case 'inseong': return { han: '印', color: '#EAB308', bg: '#FEFCE8' };
      default: return { han: '', color: '#333', bg: '#fff' };
    }
  };

  return (
    <div className="w-[210mm] h-[297mm] bg-[#FDFBF7] p-16 flex flex-col shadow-xl paper-texture print:shadow-none print:w-full">
      <div className="text-center mb-12">
        <h2 className="text-5xl font-bold text-[#333] mb-4">십신(十神) 분포 분석</h2>
      </div>

      <div className="bg-[#F8F9FA] rounded-xl p-8 border border-gray-100 mb-8 text-gray-600 leading-relaxed text-lg">
        귀하의 사주 원국에 나타난 오행의 기운을 분석한 결과입니다. 이 데이터는 타고난 기질의 강약을 나타내며, 그래프의 채워진 정도는 해당 성분의 영향력을 의미합니다.
      </div>

      <div className="flex-1 flex flex-col">
        <div className="border-t-2 border-[#333] mb-4"></div>
        {(Object.entries(tenGodsDistribution) as Array<[string, { count: number; label: string; description: string }]>).map(([key, item], idx) => {
          const icon = getTenGodIcon(key);
          const isActive = item.count > 0;
          return (
            <div key={key} className={`flex items-center py-6 border-b border-gray-200 transition-opacity ${isActive ? 'opacity-100' : 'opacity-40'}`}>
              <div 
                className="w-16 h-16 rounded-full border-2 flex items-center justify-center mr-8 flex-shrink-0" 
                style={{ borderColor: isActive ? icon.color : '#E5E7EB', backgroundColor: icon.bg }}
              >
                <span className="text-2xl font-serif font-bold" style={{ color: isActive ? icon.color : '#9CA3AF' }}>{icon.han}</span>
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-bold text-[#333] mb-1">{item.label}</h4>
                <p className="text-gray-500 text-sm leading-snug">{item.description}</p>
              </div>
              <div className="flex items-baseline ml-6">
                <span className="text-5xl font-serif font-bold mr-1" style={{ color: isActive ? icon.color : '#E5E7EB' }}>{item.count}</span>
                <span className="text-gray-400 text-sm font-medium">개</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const TableOfContents: React.FC<{ data: SajuData, pageMap: Map<number, number> }> = ({ data, pageMap }) => {
  return (
    <div className="w-[210mm] h-[297mm] bg-[#FDFBF7] p-20 flex flex-col shadow-xl paper-texture print:shadow-none print:w-full">
      <h2 className="text-4xl font-bold text-[#333] mb-16 tracking-widest text-center">차례</h2>
      <div className="space-y-6 max-w-xl mx-auto w-full">
        <div className="flex justify-between items-end border-b border-dotted border-gray-300 pb-2">
          <span className="text-xl text-[#333]">사주원국 분석</span>
          <span className="text-gray-400">03</span>
        </div>
        <div className="flex justify-between items-end border-b border-dotted border-gray-300 pb-2">
          <span className="text-xl text-[#333]">음양오행 균형</span>
          <span className="text-gray-400">04</span>
        </div>
        <div className="flex justify-between items-end border-b border-dotted border-gray-300 pb-2">
          <span className="text-xl text-[#333]">십성 기질 분석</span>
          <span className="text-gray-400">05</span>
        </div>
        {data.chapters.filter(ch => ch.active !== false).map((ch, idx) => (
          <div key={ch.id} className="flex justify-between items-end border-b border-dotted border-gray-300 pb-2">
            <span className="text-xl text-[#333]">제 {idx + 1}장. {ch.title.replace('\n', ' ')}</span>
            <span className="text-gray-400">{String(pageMap.get(ch.id)).padStart(2, '0')}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const SectionTitlePage: React.FC<{ chapter: Chapter, index: number }> = ({ chapter, index }) => {
  return (
    <div className="w-[210mm] h-[297mm] bg-[#3E3E3E] flex flex-col items-center justify-center p-16 shadow-xl paper-texture print:shadow-none print:w-full">
      <div className="text-[#D4AF37] text-2xl font-bold mb-6 tracking-widest">제 {index + 1}장</div>
      <h2 className="text-white text-6xl font-bold text-center leading-tight whitespace-pre-line mb-10">{chapter.title}</h2>
      <p className="text-gray-400 mt-10 text-xl tracking-widest text-center">{chapter.subtitle}</p>
    </div>
  );
};

export const ContentPage: React.FC<{ 
  chapter: Chapter, 
  data: SajuData, 
  index: number, 
  pageIndex?: number, 
  totalPages?: number, 
  contentOverride?: string 
}> = ({ chapter, data, index, pageIndex = 0, totalPages = 1, contentOverride }) => {
  return (
    <div className="w-[210mm] h-[297mm] bg-[#FDFBF7] px-20 py-12 flex flex-col shadow-xl paper-texture relative print:shadow-none print:w-full overflow-hidden">
      <div className="flex justify-between items-center mb-10 pb-3 border-b border-gray-100">
        <span className="text-xs font-bold text-[#D4AF37]">제 {index + 1}장 : {chapter.title.replace('\n', ' ')}</span>
        <span className="text-xs text-gray-400">{data.name}님의 사주 분석서</span>
      </div>
      
      <div className="flex-1 overflow-hidden relative">
        <p className="text-[#333] text-[17px] leading-[1.65] font-serif whitespace-pre-line text-justify break-keep">
          {contentOverride || chapter.content}
        </p>
      </div>

      <div className="mt-8 pt-3 flex justify-center border-t border-gray-50">
        <span className="text-gray-400 font-mono text-xs">{pageIndex + 1} / {totalPages}</span>
      </div>
    </div>
  );
};
