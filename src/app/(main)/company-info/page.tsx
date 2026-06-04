import { Metadata } from "next";

export const metadata: Metadata = {
  title: "公司資訊",
  description: "結城安全帽由日本東京 Azaburu 團隊營運，致力於為台灣騎士提供透明、公道的日本安全帽。",
  keywords: ["結城安全帽", "公司資訊", "Azaburu", "日本安全帽", "聯絡我們"],
  openGraph: {
    title: "公司資訊 | 結城安全帽",
    description: "結城安全帽由日本東京 Azaburu 團隊營運",
    url: "/company-info",
    siteName: "結城安全帽",
  },
};

export default async function CompanyInfoPage() {
  return (
    <div className="w-[90%] md:w-[66%] max-w-[var(--container-max, 1200px)] mx-auto py-8">
      <h1 className="text-3xl font-bold text-primary mb-8 text-center">公司資訊</h1>

      <h2 className="text-2xl font-bold text-gray-800 mb-4">關於結城安全帽</h2>
      <div className="prose max-w-none text-gray-600 leading-relaxed space-y-2">
        <p>結城安全帽由位於日本東京的 Azaburu 團隊營運。</p>
        <p>我們長期深耕日本市場，熟悉日本品牌、通路與電子商務環境，並透過在地採購資源與服務經驗，協助台灣騎士更安心地接觸日本國內正規販售的安全帽商品。</p>
        <p>我們希望成為連結日本與台灣騎士文化的橋樑，讓更多車友能夠以合理的價格、透明的資訊以及值得信賴的服務，選購到真正適合自己的安全帽。</p>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-4 mt-12">我們的服務理念</h2>
      <div className="prose max-w-none text-gray-600 leading-relaxed space-y-2">
        <p>對我們而言，販售安全帽不只是完成一筆交易。</p>
        <p>從商品資訊、尺寸建議、訂購流程到售後協助，我們都希望以騎士的角度提供服務。</p>
        <p>我們相信，信任來自於誠實與透明，而長久的品牌價值來自於每一次用心的服務。</p>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-4 mt-12">營運資訊</h2>
      <div className="prose max-w-none text-gray-600 leading-relaxed space-y-2">
        <ul className="list-disc list-inside space-y-2">
          <li>品牌名稱：結城安全帽</li>
          <li>營運公司：Azaburu（アザブル）</li>
          <li>公司所在地：東京都中央區八重洲 1-8-17 新槇町大樓 6F</li>
          <li>聯絡信箱：info@azaburu.com</li>
          <li>官方網站：https://azaburu.com</li>
        </ul>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-4 mt-12">聯絡我們</h2>
      <div className="prose max-w-none text-gray-600 leading-relaxed space-y-2">
        <p>若您對商品選購、尺寸建議、商品來源或訂購流程有任何疑問，歡迎隨時與我們聯繫。</p>
        <p>我們將秉持誠實、透明與負責任的態度，協助每一位熱愛騎乘的車友安心選購屬於自己的安全帽。</p>
      </div>
    </div>
  );
}