import { Metadata } from "next";

export const metadata: Metadata = {
  title: "隱私權政策 - Yuki Helmet",
  description: "Yuki Helmet 隱私權政策",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 font-oswald text-3xl font-bold">隱私權政策</h1>

      <div className="space-y-6 text-sm leading-relaxed text-muted-foreground font-serif">
        <section>
          <h2 className="mb-3 font-oswald text-lg font-semibold text-foreground">
            資料收集與使用
          </h2>
          <p>
            我們僅會收集您在使用服務時主動提供的個人資料，包括但不限於：姓名、電子郵件地址、電話號碼、收件地址及付款資訊。上述資料將嚴格用於處理訂單、提供客戶服務以及優化我們的服務品質。
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-oswald text-lg font-semibold text-foreground">
            資料保護
          </h2>
          <p>
            我們嚴格遵循業界標準的安全規範以確保您的個資安全。透過高強度資料加密、安全伺服器儲存以及嚴密的存取權限控管，全方位守護您的隱私。
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-oswald text-lg font-semibold text-foreground">
            第三方服務
          </h2>
          <p>
            我們可能使用第三方服務提供商來協助營運我們的網站和服務，這些提供商可能會處理您的部分個人資料。我們要求所有第三方服務提供商遵循本隱私權政策保護您的資料。
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-oswald text-lg font-semibold text-foreground">
            COOKIE 使用
          </h2>
          <p>
            我們使用 Cookie
            來改善您的使用體驗，包括記住您的偏好設定及分析網站流量。您可以通過瀏覽器設定拒絕
            Cookie，但可能會影響部分網站功能。
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-oswald text-lg font-semibold text-foreground">
            您的權利
          </h2>
          <p>
            您有權要求查閱、更正或刪除我們持有的您的個人資料。如有任何相關要求，請透過電子郵件與我們聯絡。
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-oswald text-lg font-semibold text-foreground">
            聯絡我們
          </h2>
          <p>
            如對本隱私權政策有任何疑問，請聯絡我們：<br />
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