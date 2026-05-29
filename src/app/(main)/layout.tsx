import { Footer } from "@/components/pages/footer/Footer";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}