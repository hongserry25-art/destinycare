
import React, { useState, useMemo } from 'react';
import { parseSajuText } from './services/parserService';
import { generateSajuContent } from './services/geminiService';
import { CoverPage, IntroPage, SajuChartPage, EnergyBalancePage, TenGodsDistributionPage, TableOfContents, SectionTitlePage, ContentPage, FateFlowPage } from './components/BookPages';
import { Sparkles, Edit2, Loader2, Download, FileText, Trash2, Wand2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { SajuData, DEFAULT_CHAPTERS } from './types';

const splitContentIntoPages = (text: string): string[] => {
  if (!text) return ["데이터를 기다리고 있습니다. 'AI 분석 시작' 버튼을 눌러주세요."];
  const pages: string[] = [];
  const lines = text.split('\n');
  const MAX_LINES = 28; // 안전한 한 페이지 줄 수
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

  // 목차 기반 페이지 번호 계산
  const chapterPageMap = useMemo(() => {
    let currentPage = 6; // 차례 이후 첫 페이지
    const map = new Map<number, number>();
    sajuData.chapters.filter(ch => ch.active).forEach(ch => {
      map.set(ch.id, currentPage);
      const contentPages = splitContentIntoPages(ch.content).length;
      currentPage += (contentPages + 1); // 제목페이지 1장 + 내용페이지 N장
    });
    return map;
  }, [sajuData.chapters]);

  const handleManualParse = () => {
    if (!manualText.trim()) return alert("만세력 텍스트를 입력해주세요.");
    try {
      const parsed = parseSajuText(manualText);
      setSajuData(prev => ({ 
        ...prev, 
        ...parsed, 
        birthDate: parsed.chartData.solarDate,
        chapters: DEFAULT_CHAPTERS.map(c => ({...c, content: ""})) // 초기화
      }));
      setActiveTab('preview');
    } catch (err) {
      console.error(err);
      alert("데이터를 읽는 중 오류가 발생했습니다. 텍스트 형식을 확인해주세요.");
    }
  };

  const handleAIGenerate = async () => {
    if (!sajuData.chartData) return alert("먼저 '데이터 분석 및 로드'를 진행하세요.");
    setIsGenerating(true);
    try {
      const result = await generateSajuContent(sajuData.name, sajuData.birthDate, sajuData.gender, manualText);
      setSajuData(prev => ({ ...prev, chapters: result.chapters }));
    } catch (err) {
      alert("AI 서버와 통신 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
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
          logging: false,
          allowTaint: true
        });
        if (i > 0) pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/jpeg', 0.8), 'JPEG', 0, 0, 210, 297);
      }
      pdf.save(`${sajuData.name}_사주_심층_리포트.pdf`);
    } catch (e) {
      alert("PDF 저장 중 오류가 발생했습니다.");
    } finally {
      setIsDownloading(false);
    }
  };

  const activeChapters = sajuData.chapters.filter(ch => ch.active);

  return (
    <div className="min-h-screen bg-[#F4F1EA] pb-20 font-serif text-[#333]">
      <nav className="bg-[#1A1A1A] text-[#D4AF37] px-8 py-4 sticky top-0 z-50 flex justify-between items-center shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 border-2 border-[#D4AF37] flex items-center justify-center font-bold text-xl">命</div>
          <span className="font-bold tracking-[0.2em] text-lg">DESTINY CARE LABS</span>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setActiveTab('form')} className={`px-6 py-2 rounded-full font-medium transition-all ${activeTab === 'form' ? 'bg-[#D4AF37] text-white' : 'text-gray-400 hover:text-white'}`}>데이터 입력</button>
          <button onClick={() => setActiveTab('preview')} className={`px-6 py-2 rounded-full font-medium transition-all ${activeTab === 'preview' ? 'bg-[#D4AF37] text-white' : 'text-gray-400 hover:text-white'}`}>미리보기</button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto mt-12 px-6">
        {activeTab === 'form' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 bg-white p-10 rounded-3xl shadow-2xl border border-gray-100">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <FileText className="text-[#D4AF37]" /> 만세력 텍스트 입력
              </h2>
              <textarea 
                className="w-full h-96 border-2 border-[#F0E6D2] p-8 rounded-2xl bg-[#FDFBF7] mb-6 focus:border-[#D4AF37] outline-none transition-all text-lg leading-relaxed shadow-inner" 
                value={manualText} 
                onChange={(e) => setManualText(e.target.value)} 
                placeholder="만세력 앱(예: 천을귀인, 원광만세력 등)의 분석 결과를 복사해서 붙여넣으세요..."
              />
              <div className="flex gap-4">
                <button onClick={handleManualParse} className="flex-1 bg-[#2C2C2C] text-[#D4AF37] py-5 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl hover:bg-black transition-all active:scale-95">
                  데이터 로드 및 분석 시작
                </button>
                <button onClick={() => setManualText('')} className="px-8 py-5 bg-gray-100 text-gray-400 rounded-2xl hover:bg-gray-200 transition-colors">
                  <Trash2 size={24} />
                </button>
              </div>
            </div>
            <div className="lg:col-span-4 bg-[#D4AF37] p-10 rounded-3xl text-white shadow-2xl flex flex-col justify-between relative overflow-hidden">
              <Sparkles className="absolute top-[-20px] right-[-20px] w-40 h-40 opacity-10 rotate-12" />
              <div className="relative z-10">
                <Wand2 className="mb-6" size={48} />
                <h3 className="text-2xl font-bold mb-4">AI 전문가 심층 분석</h3>
                <p className="text-white/80 leading-relaxed mb-8">
                  단순한 데이터를 넘어, 명리학 대가의 시선으로 당신의 운명을 세밀하게 분석합니다. 10가지 주제별 맞춤 리포트가 생성됩니다.
                </p>
              </div>
              <button 
                onClick={handleAIGenerate} 
                disabled={isGenerating || !sajuData.chartData}
                className="relative z-10 w-full py-5 bg-white text-[#D4AF37] rounded-2xl font-black text-lg hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 active:scale-95"
              >
                {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles />} 
                {isGenerating ? "운명을 분석 중..." : "AI 심층 분석 생성"}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-10">
            <aside className="w-80 shrink-0 space-y-4">
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 sticky top-28">
                <h3 className="font-bold mb-6 text-xl border-b pb-4 flex items-center gap-2"><Edit2 size={20} className="text-[#D4AF37]" /> 리포트 구성</h3>
                <div className="space-y-4 overflow-y-auto max-h-[50vh] pr-2 no-scrollbar">
                  {sajuData.chapters.map(ch => (
                    <label key={ch.id} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
                      <input 
                        type="checkbox" 
                        checked={ch.active} 
                        onChange={() => setSajuData({...sajuData, chapters: sajuData.chapters.map(c => c.id === ch.id ? {...c, active: !c.active} : c)})}
                        className="w-5 h-5 accent-[#D4AF37]"
                      />
                      <span className="text-sm font-bold truncate">{ch.title.split('\n')[0]}</span>
                    </label>
                  ))}
                </div>
                <button 
                  onClick={downloadPDF} 
                  disabled={isDownloading || isGenerating}
                  className="w-full mt-8 py-5 bg-[#2C2C2C] text-[#D4AF37] rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl disabled:opacity-50 hover:bg-black transition-all"
                >
                  {isDownloading ? <Loader2 className="animate-spin" /> : <Download />} PDF로 평생 소장하기
                </button>
              </div>
            </aside>
            <div className="flex-1 flex flex-col items-center">
              <div className="scale-[0.85] origin-top flex flex-col gap-20 shadow-2xl p-10 bg-gray-200/30 rounded-[40px]">
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

      {/* 숨겨진 PDF 출력용 컨테이너 */}
      <div id="print-container" className="fixed left-[-9999px] top-0">
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
