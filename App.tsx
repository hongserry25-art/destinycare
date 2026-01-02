
import React, { useState, useMemo } from 'react';
import { parseSajuText, parseFateFlowOnly } from './services/parserService';
import { generateSajuContent } from './services/geminiService';
import { CoverPage, IntroPage, SajuChartPage, EnergyBalancePage, TenGodsDistributionPage, TableOfContents, SectionTitlePage, ContentPage, FateFlowPage } from './components/BookPages';
import { Sparkles, Edit2, Loader2, Download, X, Plus, FileText, Trash2, Wand2, ChevronDown, ChevronUp } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { SajuData, DEFAULT_CHAPTERS, Chapter, FateFlowData } from './types';

const splitContentIntoPages = (text: string): string[] => {
  if (!text || !text.trim()) return ["분석 내용을 생성하거나 입력해주세요."];
  const pages: string[] = [];
  const paragraphs = text.split('\n');
  const CHARS_PER_LINE = 45;
  const MAX_LINES_PER_PAGE = 32;
  let currentPageText: string[] = [];
  let currentLines = 0;

  paragraphs.forEach((para, idx) => {
    const paraLines = para.trim().length === 0 ? 1 : Math.ceil(para.length / CHARS_PER_LINE);
    if (currentLines + paraLines > MAX_LINES_PER_PAGE && currentPageText.length > 0) {
      pages.push(currentPageText.join('\n'));
      currentPageText = [para];
      currentLines = paraLines;
    } else {
      currentPageText.push(para);
      currentLines += paraLines;
    }
    if (idx === paragraphs.length - 1) {
      pages.push(currentPageText.join('\n'));
    }
  });
  return pages;
};

const App: React.FC = () => {
  const [manualText, setManualText] = useState('');
  const [fateFlowText, setFateFlowText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [sajuData, setSajuData] = useState<SajuData>({ name: '', birthDate: '', gender: 'female', chapters: DEFAULT_CHAPTERS });
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');
  const [isDownloading, setIsDownloading] = useState(false);

  const chapterPageMap = useMemo(() => {
    let currentPage = 7; 
    const map = new Map<number, number>();
    sajuData.chapters.filter(ch => ch.active !== false).forEach(ch => {
      map.set(ch.id, currentPage);
      const pages = splitContentIntoPages(ch.content);
      const extraPages = 1; 
      currentPage += (pages.length + extraPages);
      
      if (ch.id === 6) {
        currentPage += 1;
      }
    });
    return map;
  }, [sajuData.chapters]);

  const renderBookPages = (data: SajuData, activeChapters: Chapter[]) => {
    const pages: React.ReactNode[] = [
      <CoverPage key="cover" data={data} />,
      <IntroPage key="intro" data={data} />,
      <TableOfContents key="toc" data={data} pageMap={chapterPageMap} />,
      <SajuChartPage key="chart" data={data} />,
      <EnergyBalancePage key="energy" data={data} />,
      <TenGodsDistributionPage key="tengods" data={data} />,
    ];

    activeChapters.forEach((ch, idx) => {
      pages.push(<SectionTitlePage key={`title-${ch.id}`} chapter={ch} index={idx} />);
      const contentPages = splitContentIntoPages(ch.content);
      contentPages.forEach((content, pIdx) => {
        pages.push(
          <ContentPage 
            key={`content-${ch.id}-${pIdx}`} 
            chapter={ch} 
            data={data} 
            index={idx} 
            pageIndex={pIdx} 
            totalPages={contentPages.length} 
            contentOverride={content}
          />
        );
      });

      if (ch.id === 6) {
        pages.push(<FateFlowPage key="fateflow" data={data} />);
      }
    });

    return pages;
  };

  const handleManualParse = () => {
    if (!manualText.trim()) return alert("데이터를 입력해주세요.");
    try {
      const parsed = parseSajuText(manualText);
      const flowParsed = fateFlowText.trim() ? parseFateFlowOnly(fateFlowText) : parsed.chartData.fateFlow;
      
      setSajuData({ 
        name: parsed.name, 
        birthDate: parsed.chartData.solarDate, 
        gender: parsed.gender, 
        chapters: sajuData.chapters,
        chartData: {
          ...parsed.chartData,
          fateFlow: flowParsed
        }
      });
      setActiveTab('preview');
    } catch (err) { 
      alert("데이터 파싱 실패. 형식에 맞게 입력되었는지 확인해주세요."); 
    }
  };

  const handleAIGenerate = async () => {
    if (!sajuData.name || !sajuData.chartData) {
      alert("먼저 사주 기초 데이터를 입력하고 파싱해주세요.");
      return;
    }
    setIsGenerating(true);
    try {
      const result = await generateSajuContent(sajuData.name, sajuData.birthDate, sajuData.gender);
      setSajuData(prev => ({
        ...prev,
        chapters: result.chapters
      }));
      alert("AI 심층 분석 리포트 생성이 완료되었습니다!");
    } catch (err) {
      alert("AI 생성 중 오류가 발생했습니다. API 키 설정을 확인하세요.");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadPDF = async () => {
    setIsDownloading(true);
    const container = document.getElementById('print-container');
    if (!container) return;
    try {
      const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4', compress: true });
      const pages = Array.from(container.children);
      for (let i = 0; i < pages.length; i++) {
        const canvas = await html2canvas(pages[i] as HTMLElement, { 
            scale: 2, useCORS: true, backgroundColor: '#FDFBF7', logging: false,
        });
        if (i > 0) pdf.addPage();
        const imgData = canvas.toDataURL('image/jpeg', 0.85);
        pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
      }
      pdf.save(`${sajuData.name}_심층사주분석리포트.pdf`);
    } catch (e) { 
      alert("저장 중 오류가 발생했습니다."); 
    } finally { 
      setIsDownloading(false); 
    }
  };

  const activeChapters = sajuData.chapters.filter(ch => ch.active !== false);

  const loadSample = () => {
    const sample = `김지현 (여)
양력 1992년 5월 15일 14:30
음력 1992년 4월 13일

구분   시주   일주   월주   년주
십성   정관   일간   정인   식신
천간   己     壬     乙     壬
지지   酉     申     巳     申
십성   정인   편인   편재   편인
운성   목욕   장생   절     장생
신살   문창   천을   망신   천을

용신분석
용신: 水, 희신: 金, 기신: 土, 구신: 火, 한신: 木

음양오행 분포
陽 양: 5개 (62%)
陰 음: 3개 (38%)
木: 1개 (12%)
火: 1개 (12%)
土: 1개 (12%)
金: 3개 (38%)
수: 2개 (25%)

십신 분포
비겁 (비견·겁재): 2개
식상 (식신·상관): 1개
재성 (편재·정재): 1개
관성 (편관·정관): 1개
인성 (편인·정인): 3개`;
    
    const flowSample = `년주
핵심기운: 천을귀인, 문창귀인
상세분석: 초년에 학문적 성취가 높고 조상의 덕이 큼
• 예술적 재능이 일찍 발현되는 시기입니다.

월주
핵심기운: 망신살, 편재
상세분석: 사회 활동이 왕성하며 재물에 대한 감각이 발달
• 부모의 가업을 잇거나 전문직으로 성공할 운입니다.

일주
핵심기운: 천을귀인, 장생
상세분석: 일생 동안 귀인의 도움이 따르며 생명력이 강함
• 배우자 자리에 귀인이 있어 원만한 가정을 이룹니다.

시주
핵심기운: 정인, 목욕
상세분석: 말년에 학문과 교육에 종사하거나 명예를 얻음
• 자녀가 현달하고 본인은 예술적인 말년을 보냅니다.`;

    setManualText(sample);
    setFateFlowText(flowSample);
  };

  const updateFateFlow = (pillar: keyof FateFlowData, field: 'mainStars' | 'detailStars', value: string) => {
    if (!sajuData.chartData?.fateFlow) return;
    const newFlow = { ...sajuData.chartData.fateFlow };
    if (field === 'mainStars') {
        newFlow[pillar].mainStars = value.split(',').map(s => s.trim());
    } else {
        newFlow[pillar].detailStars = value.split('\n').map(s => s.trim());
    }
    setSajuData({
        ...sajuData,
        chartData: {
            ...sajuData.chartData,
            fateFlow: newFlow
        }
    });
  };

  return (
    <div className="min-h-screen bg-[#F4F1EA] pb-20 font-serif text-[#333]">
      <nav className="bg-[#2C2C2C] text-[#D4AF37] px-8 py-4 sticky top-0 z-50 flex justify-between items-center shadow-2xl border-b border-[#D4AF37]/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 border-2 border-[#D4AF37] flex items-center justify-center font-bold text-xl">命</div>
          <span className="text-xl font-bold tracking-widest uppercase">Destiny Care Labs</span>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setActiveTab('form')} className={`px-6 py-2 rounded-full transition-all font-medium ${activeTab === 'form' ? 'bg-[#D4AF37] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>정보 입력</button>
          <button onClick={() => setActiveTab('preview')} className={`px-6 py-2 rounded-full transition-all font-medium ${activeTab === 'preview' ? 'bg-[#D4AF37] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>분석지 미리보기</button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto mt-12 px-6">
        {activeTab === 'form' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-8 space-y-8">
              <div className="bg-white p-10 rounded-2xl shadow-2xl border border-gray-200">
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <h2 className="text-3xl font-bold text-[#1a1a1a] mb-2">기본 사주 데이터 입력</h2>
                    <p className="text-gray-500 font-sans">분석 소프트웨어에서 추출된 사주 원국 텍스트를 입력하세요.</p>
                  </div>
                  <button onClick={loadSample} className="text-[#D4AF37] text-sm font-bold hover:underline flex items-center gap-1">
                    <FileText size={16} /> 샘플 데이터 불러오기
                  </button>
                </div>
                <textarea 
                  className="w-full h-[300px] border-2 border-[#F0E6D2] p-8 rounded-xl bg-[#FDFBF7] mb-4 focus:border-[#D4AF37] outline-none transition-all text-lg leading-relaxed shadow-inner" 
                  value={manualText} 
                  onChange={(e) => setManualText(e.target.value)} 
                  placeholder="여기에 사주 분석 텍스트를 입력하세요..." 
                />
              </div>

              <div className="bg-white p-10 rounded-2xl shadow-2xl border border-gray-200">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-[#1a1a1a] mb-2">운명의 흐름 입력 (선택)</h2>
                  <p className="text-gray-500 font-sans">년/월/일/시주별 핵심 기운과 상세 분석 텍스트를 입력하세요.</p>
                </div>
                <textarea 
                  className="w-full h-[250px] border-2 border-[#F0E6D2] p-8 rounded-xl bg-[#FDFBF7] focus:border-[#D4AF37] outline-none transition-all text-lg leading-relaxed shadow-inner" 
                  value={fateFlowText} 
                  onChange={(e) => setFateFlowText(e.target.value)} 
                  placeholder="예: 년주 핵심: 천을귀인 상세: 초년 성취가 높음..." 
                />
                <div className="mt-8 grid grid-cols-2 gap-4">
                  <button onClick={() => { setManualText(''); setFateFlowText(''); }} className="py-5 rounded-xl font-bold text-gray-400 hover:bg-gray-50 transition flex items-center justify-center gap-2">
                    <Trash2 size={20} /> 초기화
                  </button>
                  <button onClick={handleManualParse} className="bg-[#2C2C2C] text-[#D4AF37] py-5 rounded-xl font-bold text-xl hover:bg-black transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95">
                    <Sparkles size={24} /> 분석지 데이터 로드
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <div className="bg-[#D4AF37] p-8 rounded-2xl text-white shadow-xl relative overflow-hidden group">
                <Wand2 className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Sparkles size={20} /> AI 심층 분석 엔진
                </h3>
                <p className="text-sm opacity-90 leading-relaxed mb-8 font-sans">
                  입력된 사주 원국을 바탕으로 Gemini AI가 10개 챕터의 상세 리포트를 작성합니다.
                </p>
                <button 
                  onClick={handleAIGenerate}
                  disabled={isGenerating || !sajuData.chartData}
                  className="w-full py-4 bg-white text-[#D4AF37] rounded-xl font-bold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isGenerating ? <Loader2 className="animate-spin" /> : "AI 리포트 생성"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="w-full lg:w-[450px] bg-white rounded-2xl shadow-2xl h-[82vh] overflow-hidden flex flex-col border border-gray-200 sticky top-28">
              <div className="p-6 border-b bg-gray-50 flex justify-between items-center">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Edit2 size={18} className="text-[#D4AF37]" /> 리포트 및 흐름 편집
                </h3>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
                {/* 운명의 흐름 수동 편집 섹션 */}
                {sajuData.chartData?.fateFlow && (
                    <div className="p-5 rounded-xl border-2 bg-red-50/20 border-red-100 shadow-sm mb-4">
                         <h4 className="font-bold mb-4 text-[#C62828] flex items-center gap-2">
                             <Sparkles size={16} /> 운명의 흐름 직접 수정
                         </h4>
                         {(['year', 'month', 'day', 'hour'] as const).map(p => (
                             <div key={p} className="mb-6 last:mb-0 border-b border-red-50 pb-4 last:border-0 last:pb-0">
                                 <div className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-tighter">
                                     {p === 'year' ? '년주' : p === 'month' ? '월주' : p === 'day' ? '일주' : '시주'}
                                 </div>
                                 <div className="space-y-3">
                                     <div>
                                        <label className="text-[10px] text-gray-400 mb-1 block">핵심 기운 (쉼표 구분)</label>
                                        <input 
                                            type="text" 
                                            className="w-full p-2 text-xs border border-gray-200 rounded-md bg-white"
                                            value={sajuData.chartData?.fateFlow?.[p].mainStars.join(', ')}
                                            onChange={(e) => updateFateFlow(p, 'mainStars', e.target.value)}
                                        />
                                     </div>
                                     <div>
                                        <label className="text-[10px] text-gray-400 mb-1 block">상세 분석 (줄바꿈 구분)</label>
                                        <textarea 
                                            className="w-full p-2 text-xs border border-gray-200 rounded-md bg-white h-20"
                                            value={sajuData.chartData?.fateFlow?.[p].detailStars.join('\n')}
                                            onChange={(e) => updateFateFlow(p, 'detailStars', e.target.value)}
                                        />
                                     </div>
                                 </div>
                             </div>
                         ))}
                    </div>
                )}

                {/* AI 리포트 편집 섹션 */}
                {sajuData.chapters.map(ch => (
                  <div key={ch.id} className={`p-5 rounded-xl border-2 transition-all ${ch.active === false ? 'opacity-40 grayscale' : 'bg-[#FDFBF7] border-[#F0E6D2] shadow-sm'}`}>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-bold text-[#D4AF37] tracking-wider uppercase">Chapter {ch.id}</span>
                      <button 
                        onClick={() => setSajuData(prev => ({ ...prev, chapters: prev.chapters.map(c => c.id === ch.id ? { ...c, active: !c.active } : c) }))}
                        className="text-gray-400 hover:text-red-500"
                      >
                        {ch.active === false ? <Plus size={16} /> : <X size={16} />}
                      </button>
                    </div>
                    <h4 className="font-bold mb-3 text-sm">{ch.title.replace('\n', ' ')}</h4>
                    <textarea 
                      className="w-full h-40 text-sm p-3 border border-[#E8DCC4] rounded-lg focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all no-scrollbar bg-white" 
                      value={ch.content}
                      onChange={(e) => setSajuData(prev => ({ ...prev, chapters: prev.chapters.map(c => c.id === ch.id ? { ...c, content: e.target.value } : c) }))}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center gap-10">
              <div className="w-full flex justify-between items-center bg-white px-8 py-5 rounded-2xl shadow-xl border border-gray-100 sticky top-28 z-40">
                <div className="flex items-center gap-4">
                  <div className="text-sm">
                    <span className="text-gray-400 font-sans">대상:</span> <span className="font-bold">{sajuData.name}</span>
                  </div>
                  <div className="h-4 w-[1px] bg-gray-200"></div>
                  <div className="text-sm">
                    <span className="text-gray-400 font-sans">페이지:</span> <span className="font-bold">{activeChapters.length + 7} P</span>
                  </div>
                </div>
                <button 
                  onClick={downloadPDF} 
                  disabled={isDownloading} 
                  className="bg-[#2C2C2C] text-[#D4AF37] px-10 py-4 rounded-xl font-bold shadow-2xl flex items-center gap-3 hover:bg-black transition-all active:scale-95 disabled:opacity-50"
                >
                  {isDownloading ? <Loader2 className="animate-spin" /> : <Download size={20} />} 
                  전문 분석지 PDF 저장
                </button>
              </div>
              
              <div className="scale-[0.5] sm:scale-[0.6] lg:scale-[0.8] xl:scale-100 origin-top flex flex-col gap-16 items-center pb-40">
                 {renderBookPages(sajuData, activeChapters)}
              </div>
            </div>
          </div>
        )}

        <div id="print-container" className="fixed top-0 left-[-9999px]">
             {renderBookPages(sajuData, activeChapters)}
        </div>
      </main>
    </div>
  );
};

export default App;
