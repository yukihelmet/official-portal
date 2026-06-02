import { Metadata } from "next";

export const metadata: Metadata = {
  title: "結城安全帽",
  description: "結城安全帽服務條款",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 font-oswald text-3xl font-bold">服務條款</h1>

      <div className="space-y-6 text-sm leading-relaxed text-muted-foreground font-serif">
        <section>
          <h2 className="mb-3 font-oswald text-lg font-semibold text-foreground">
            服務說明
          </h2>
          <p>
            結城安全帽透過網站提供線上安全帽銷售服務。使用本網站即表示您同意遵守以下條款。我們保留隨時修改這些條款的權利，修改後的條款於網站上公布時生效。
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-oswald text-lg font-semibold text-foreground">
            帳戶註冊
          </h2>
          <p>
            您須提供真實、完整及最新的帳戶資料，並妥善保管您的帳戶密碼。您須對帳戶下所有活動負完全責任，如發現任何未經授權使用，請立即通知我們。
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-oswald text-lg font-semibold text-foreground">
            訂購與付款
          </h2>
          <p>
            所有訂單以我們系統確認接受後生效。商品價格以新台幣計價。如有任何付款問題，我們有權取消訂單。
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-oswald text-lg font-semibold text-foreground">
            配送與運送
          </h2>
          <p>
            訂單確認後，我們將於3-5個工作日內出貨。實際到貨時間依物流狀況而定。運費計算方式請參考結帳頁面說明。我們不對物流延遲負責。
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-oswald text-lg font-semibold text-foreground">
            責任限制
          </h2>
          <p>
            在法律允許範圍內，我們不對任何間接、特定或附帶的損害負責。我們的總賠償責任不超過您就相關服務所支付的金額。
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-oswald text-lg font-semibold text-foreground">
            準據法與管轄
          </h2>
          <p>
            本條款適用日本法律。若有任何爭議，雙方應本於誠信原則優先透過電子郵件友好協商解決；如仍無法達成共識，雙方同意以日本東京地方裁判所為第一審管轄法院。
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-oswald text-lg font-semibold text-foreground">
            聯絡我們
          </h2>
          <p>
            如對本服務條款有任何疑問，請聯絡我們：<br />
            電子郵件：info@yuki-helmet.com
          </p>
        </section>

        <section>
          <p className="text-xs">
            最後更新日期：2026年
          </p>
        </section>
      </div>
    </div>
  );
}