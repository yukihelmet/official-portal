import { MgntOrdersClient } from "@/components/pages/order/MgntOrdersClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Management - 結城安全帽",
};

export default function MgntOrdersPage() {
  return <MgntOrdersClient />;
}