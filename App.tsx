
import React, { useState, useMemo } from 'react';
import { parseSajuText } from './services/parserService';
import { generateSajuContent } from './services/geminiService';
import { CoverPage, IntroPage, SajuChartPage, EnergyBalancePage, TenGodsDistributionPage, TableOfContents, SectionTitlePage, ContentPage } from './components/BookPages';
import { Sparkles, Edit2, Loader2, Download, FileText, Trash2, Wand2, ChevronRight, CheckCircle2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { SajuData, DEFAULT_CHAPTERS } from './types';

const splitContentIntoPages = (text: string): string[] => {
  if (!text) return ["AI 분석 버튼을 눌러 내용을 생성해주세요."];
  const pages: string[] = [];
  const lines = text.split('\n');
  const MAX_LINES = 26; // 여백을 고려한 페이지당 줄 수
  for (let i = 0; i < lines.length; i += MAX_LINES) {
    pages.push(lines.slice(i, i + MAX_LINES).join('\n'));
  }
  return pages;
};

const App: React.FC = () => {
  const [manualText, setManualText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [sajuData, setSajuData] = useState<SajuData>({ name: '', birthDate: '', gender: 'female', chapters: DEFAULT_CHAPTERS });
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');
  const [isDownloading, setIsDownloading] = useState(false);
  const [step, setStep] = useState(1); // 1: 입력, 2: 분석대기, 3: 완료

  const chapterPageMap = useMemo(() => {
    let currentPage = 6; 
    const map = new Map<number, number>();
    sajuData.chapters.filter(ch => ch.active).forEach(ch => {
      map.set(ch.id, currentPage);
      const contentPages = splitContentIntoPages(ch.content).length;
      currentPage += (contentPages + 1); 
    });
    return map;
  }, [sajuData.chapters]);

  const handleManualParse = () => {
    if (!manualText.trim()) return alert("만세력 앱에서 복사한 텍스트를 붙여넣어주세요.");
    try {
      const parsed = parseSajuText(manualText);
      setSajuData(prev => ({ 
        ...prev, 
        ...parsed, 
        birthDate: parsed.chartData?.solarDate || prev.birthDate,
        chapters: DEFAULT_CHAPTERS.map(c => ({...c, content: ""}))
      }));
      setStep(2);
      setActiveTab('preview');
    } catch (err) {
      alert("데이터를 분석할 수 없습니다. 텍스트 형식을 다시 확인해주세요.");
    }
  };

  const handleAIGenerate = async () => {
    if (!sajuData.chartData) return alert("먼저 '데이터 로드'를 진행해주세요.");
    setIsGenerating(true);
    try {
      const result = await generateSajuContent(sajuData.name, sajuData.birthDate, sajuData.gender, manualText);
      setSajuData(prev => ({ ...prev, chapters: result.chapters }));
      setStep(3);
    } catch (err) {
      alert("AI 분석 생성 중 오류가 발생했습니다. API 키 설정을 확인해주세요.");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadPDF = async () => {
    setIsDownloading(true);
    const container = document.getElementById('print-container');
    if (!container) return;
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pages = Array.from(container.children);
      for (let i = 0; i < pages.length; i++) {
        const canvas = await html2canvas(pages[i] as HTMLElement, { 
          scale: 2, 
          useCORS: true,
          logging: false
        });
        if (i > 0) pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/jpeg', 0.85), 'JPEG', 0, 0, 210, 297);
      }
      pdf.save(`${sajuData.name}_운명리포트_${new Date().toISOString().slice(0,10)}.pdf`);
    } catch (e) {
      alert("PDF 생성 중 오류가 발생했습니다.");
    } finally {
      setIsDownloading(false);
    }
  };

  const activeChapters = sajuData.chapters.filter(ch => ch.active);

  return (
    <div className="min-h-screen bg-[#F8F6F2] font-serif text-[#2C2C2C]">
      {/* Header */}
      <nav className="bg-[#1A1A1A] text-[#D4AF37] px-8 py-4 sticky top-0 z-50 flex justify-between items-center shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 border-2 border-[#D4AF37] flex items-center justify-center font-bold text-xl">命</div>
          <span className="font-bold tracking-[0.2em] text-lg hidden md:block">DESTINY CARE LABS</span>
        </div>
        
        {/* Progress Steps */}
        <div className="hidden lg:flex items-center gap-4 text-xs font-bold tracking-widest uppercase">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-[#D4AF37]' : 'text-gray-600'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center border ${step >= 1 ? 'border-[#D4AF37]' : 'border-gray-600'}`}>1</span>
            데이터 입력
          </div>
          <ChevronRight size={14} className="text-gray-700" />
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-[#D4AF37]' : 'text-gray-600'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center border ${step >= 2 ? 'border-[#D4AF37]' : 'border-gray-600'}`}>2</span>
            AI 심층분석
          </div>
          <ChevronRight size={14} className="text-gray-700" />
          <div className={`flex items-center gap-2 ${step >= 3 ? 'text-[#D4AF37]' : 'text-gray-600'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center border ${step >= 3 ? 'border-[#D4AF37]' : 'border-gray-600'}`}>3</span>
            PDF 발행
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={() => setActiveTab('form')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'form' ? 'bg-[#D4AF37] text-white' : 'text-gray-400 hover:text-white'}`}>입력</button>
          <button onClick={() => setActiveTab('preview')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'preview' ? 'bg-[#D4AF37] text-white' : 'text-gray-400 hover:text-white'}`}>미리보기</button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-10 px-6">
        {activeTab === 'form' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white p-8 rounded-3xl shadow-lg border border-[#E8E2D6]">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <FileText className="text-[#D4AF37]" /> 만세력 데이터 붙여넣기
                  </h2>
                  {manualText && (
                    <button onClick={() => setManualText('')} className="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 text-sm">
                      <Trash2 size={16} /> 초기화
                    </button>
                  )}
                </div>
                <div className="relative">
                  <textarea 
                    className="w-full h-[500px] border-2 border-[#F0E6D2] p-8 rounded-2xl bg-[#FDFBF7] focus:border-[#D4AF37] outline-none transition-all text-lg leading-relaxed shadow-inner placeholder:text-gray-300" 
                    value={manualText} 
                    onChange={(e) => setManualText(e.target.value)} 
                    placeholder="천을귀인, 원광만세력 등 앱의 분석 결과 텍스트 전체를 여기에 붙여넣으세요. 이름, 생년월일, 사주팔자 데이터가 포함되어야 합니다."
                  />
                  {!manualText && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                      <div className="text-center">
                        <FileText size={80} className="mx-auto mb-4" />
                        <p className="font-bold">복사한 내용을 여기에 붙여넣으세요</p>
                      </div>
                    </div>
                  )}
                </div>
                <button 
                  onClick={handleManualParse} 
                  className="w-full mt-6 bg-[#2C2C2C] text-[#D4AF37] py-6 rounded-2xl font-bold text-xl flex items-center justify-center gap-4 shadow-xl hover:bg-black transition-all active:scale-[0.98]"
                >
                  데이터 분석 및 로드 시작 <ChevronRight />
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <div className="bg-[#D4AF37] p-8 rounded-3xl text-white shadow-xl relative overflow-hidden h-full flex flex-col justify-between">
                <Sparkles className="absolute top-[-20px] right-[-20px] w-48 h-48 opacity-10 rotate-12" />
                <div>
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                    <Wand2 size={32} />
                  </div>
                  <h3 className="text-3xl font-bold mb-4">AI 전문가 리포트</h3>
                  <p className="text-white/90 leading-relaxed mb-8 text-lg">
                    단순한 도표를 넘어, 10가지 주제별 심층 분석 리포트를 AI가 작성합니다. 실제 전문가가 쓴 듯한 기품 있는 문체로 귀하의 운명을 해석합니다.
                  </p>
                  <ul className="space-y-3 mb-10 text-sm">
                    {DEFAULT_CHAPTERS.slice(0, 5).map(c => (
                      <li key={c.id} className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-white/60" /> {c.title.replace('\n', ' ')}
                      </li>
                    ))}
                    <li className="text-white/60 italic">...외 총 10가지 주제</li>
                  </ul>
                </div>
                <button 
                  onClick={handleAIGenerate} 
                  disabled={isGenerating || !sajuData.chartData}
                  className="w-full py-6 bg-white text-[#D4AF37] rounded-2xl font-black text-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles />} 
                  {isGenerating ? "운명 분석 중..." : "AI 분석지 생성하기"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Sidebar Controls */}
            <aside className="lg:w-80 shrink-0 space-y-6">
              <div className="bg-white p-6 rounded-3xl shadow-xl border border-[#E8E2D6] sticky top-28">
                <h3 className="font-bold mb-6 text-lg border-b border-gray-100 pb-4 flex items-center gap-2 text-[#D4AF37]">
                  <Edit2 size={18} /> 리포트 설정
                </h3>
                
                <div className="space-y-3 overflow-y-auto max-h-[40vh] pr-2 no-scrollbar mb-6">
                  {sajuData.chapters.map(ch => (
                    <label key={ch.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-50 bg-gray-50/50 cursor-pointer hover:bg-gray-100 transition-colors">
                      <input 
                        type="checkbox" 
                        checked={ch.active} 
                        onChange={() => setSajuData({...sajuData, chapters: sajuData.chapters.map(c => c.id === ch.id ? {...c, active: !c.active} : c)})}
                        className="w-5 h-5 accent-[#D4AF37] rounded"
                      />
                      <span className="text-xs font-bold text-gray-700 leading-tight">{ch.title.split('\n')[0]}</span>
                    </label>
                  ))}
                </div>

                <div className="space-y-3">
                  <button 
                    onClick={downloadPDF} 
                    disabled={isDownloading || isGenerating || !sajuData.chapters[0].content}
                    className="w-full py-5 bg-[#1A1A1A] text-[#D4AF37] rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl disabled:opacity-30 hover:bg-black transition-all active:scale-[0.98]"
                  >
                    {isDownloading ? <Loader2 className="animate-spin" /> : <Download />} PDF 다운로드
                  </button>
                  <p className="text-[10px] text-center text-gray-400">PDF 생성 시 브라우저 사양에 따라<br/>최대 1분 정도 소요될 수 있습니다.</p>
                </div>
              </div>
            </aside>

            {/* Preview Area */}
            <div className="flex-1 flex flex-col items-center">
              {isGenerating && (
                <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center backdrop-blur-sm">
                  <div className="bg-white p-12 rounded-[40px] text-center max-w-sm shadow-2xl animate-in zoom-in-95 duration-300">
                    <div className="relative w-24 h-24 mx-auto mb-8">
                       <div className="absolute inset-0 border-4 border-[#D4AF37]/20 rounded-full"></div>
                       <div className="absolute inset-0 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
                       <div className="absolute inset-0 flex items-center justify-center font-bold text-[#D4AF37] text-2xl">命</div>
                    </div>
                    <h3 className="text-2xl font-bold mb-4">운명의 지도 작성 중</h3>
                    <p className="text-gray-500 leading-relaxed">
                      사주 원국의 기운을 분석하여<br/>품격 있는 분석지를 구성하고 있습니다.<br/>잠시만 기다려 주십시오.
                    </p>
                  </div>
                </div>
              )}

              <div className="scale-[0.6] sm:scale-[0.7] lg:scale-[0.85] origin-top flex flex-col gap-10 shadow-2xl p-6 lg:p-10 bg-gray-300/20 rounded-[40px] border border-white/50">
                <CoverPage data={sajuData} />
                <IntroPage data={sajuData} />
                <TableOfContents data={sajuData} pageMap={chapterPageMap} />
                <SajuChartPage data={sajuData} />
                <EnergyBalancePage data={sajuData} />
                <TenGodsDistributionPage data={sajuData} />
                {activeChapters.map((ch, idx) => (
                  <React.Fragment key={ch.id}>
                    <SectionTitlePage chapter={ch} index={idx} />
                    {splitContentIntoPages(ch.content).map((content, pIdx) => (
                      <ContentPage 
                        key={`${ch.id}-${pIdx}`} 
                        chapter={ch} 
                        data={sajuData} 
                        index={idx} 
                        pageIndex={pIdx} 
                        totalPages={splitContentIntoPages(ch.content).length} 
                        contentOverride={content} 
                      />
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Hidden container for PDF generation */}
      <div id="print-container" className="fixed left-[-9999px] top-0 pointer-events-none">
        <CoverPage data={sajuData} />
        <IntroPage data={sajuData} />
        <TableOfContents data={sajuData} pageMap={chapterPageMap} />
        <SajuChartPage data={sajuData} />
        <EnergyBalancePage data={sajuData} />
        <TenGodsDistributionPage data={sajuData} />
        {activeChapters.map((ch, idx) => (
          <React.Fragment key={ch.id}>
            <SectionTitlePage chapter={ch} index={idx} />
            {splitContentIntoPages(ch.content).map((content, pIdx) => (
              <ContentPage 
                key={`${ch.id}-${pIdx}`} 
                chapter={ch} 
                data={sajuData} 
                index={idx} 
                pageIndex={pIdx} 
                totalPages={splitContentIntoPages(ch.content).length} 
                contentOverride={content} 
              />
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default App;
