import { Metadata } from "next";

export const metadata: Metadata = {
  title: "關於我們",
  description: "了解結城安全帽的成立理念、創辦人的騎士故事，以及我們對日本安全帽的堅持與熱愛。",
  keywords: ["結城安全帽", "日本安全帽", "關於我們", "騎士", "安全帽推薦"],
  openGraph: {
    title: "關於我們 | 結城安全帽",
    description: "為台灣騎士提供值得信賴的日本安全帽",
    url: "/about",
    siteName: "結城安全帽",
  },
};

export default async function AboutPage() {
  return (
    <div className="w-[90%] md:w-[66%] max-w-[var(--container-max, 1200px)] mx-auto py-8">
        <h1 className="text-3xl font-bold text-primary mb-8 text-center">關於我們</h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">為什麼成立結城安全帽</h2>
        <div className="prose max-w-none text-gray-600 leading-relaxed space-y-2">
          <p>許多台灣騎士喜愛日本安全帽，卻經常面臨價格偏高、資訊不透明，或是不確定商品來源是否可靠等問題。</p>
          <p>因此，我們成立了「結城安全帽」。</p>
          <p>希望透過長期居住日本的優勢，協助台灣騎士以合理、公道且透明的方式，購買日本國內正規通路販售的安全帽，讓每位車友都能更安心地找到適合自己的裝備。</p>
          <p>我們相信，購買安全帽不應該是一場資訊不對等的交易，而應該是一個值得信賴、令人安心的過程。</p>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 mt-12">創辦人的騎士故事</h2>
        <div className="prose max-w-none text-gray-600 leading-relaxed space-y-2">
          <p>「結城安全帽」由一位定居日本的台灣騎士創立。</p>
          <p>從 BMW S1000RR 到 Triumph Bobber TFC，我始終相信，騎車不只是移動，而是一種生活方式。</p>
          <p>旅居日本期間，我曾騎著重機從東京一路前往靜岡、伊勢志摩、京都與琵琶湖，完成超過 1,200 公里的旅程。一路上經歷高速公路、山路、海岸線與各種天候變化，也更加體會到安全帽對騎士的重要性。</p>
          <p>對我而言，安全帽不只是保護裝備，更是陪伴騎士穿越風雨、迎向未知風景的重要夥伴。</p>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 mt-12">我們對日本安全帽的熱愛</h2>
        <div className="prose max-w-none text-gray-600 leading-relaxed space-y-2">
<p>長年騎乘與使用日本品牌安全帽的經驗，讓我深深喜歡日本品牌對於安全性、舒適度與細節品質的堅持。</p>
<p>從帽體設計、內襯工藝到配戴體驗，日本品牌總是不斷追求更高的完成度。</p>
<p>曾陪伴我無數旅程的 X-11 Daijiro TC-3，不只是收藏，更承載著許多珍貴的騎乘回憶。</p>
<p>也正因如此，我希望將自己認同的產品與價值分享給更多同樣熱愛騎車的朋友。</p>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 mt-12">我們的堅持</h2>
        <div className="prose max-w-none text-gray-600 leading-relaxed space-y-2">
<p>結城安全帽重視的不只是商品本身，更重視每位車友的信任。</p>
<p>因此，我們堅持：</p>
<ul className="list-disc list-inside space-y-2">
<li>日本正規通路協助購入</li>
<li>商品來源透明清楚</li>
<li>公道合理的價格</li>
<li>誠實且完整的商品資訊</li>
<li>以騎士角度提供建議與服務</li>
<li>用心協助每位車友找到適合自己的安全帽</li>
</ul>
<p>我們不追求華麗的包裝，而是希望透過真誠的服務與長期累積的信任，成為車友在選購日本安全帽時值得依靠的夥伴。</p>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 mt-12">我們相信</h2>
        <div className="prose max-w-none text-gray-600 leading-relaxed space-y-2">
<p>一頂安全帽的價值，不只在於保護頭部。</p>
<p>它陪伴騎士迎接清晨的第一道曙光，也陪伴騎士穿越長途旅程中的風雨與夕陽。</p>
<p>對真正熱愛騎車的人而言，安全帽不只是裝備，更是每段旅程不可或缺的一部分。</p>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 mt-12">結城安全帽</h2>
        <div className="prose max-w-none text-gray-600 leading-relaxed space-y-2">
<p>以合理的價格，提供值得信賴的日本安全帽。</p>
<p>獻給每一位熱愛騎乘，也珍惜旅程的騎士。</p>
<p className="font-semibold">Ride Safe, Ride Your Story.</p>
        </div>
    </div>
  );
}