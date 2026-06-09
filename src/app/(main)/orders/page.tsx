import { listOrders } from "@/lib/official-portal-api";
import { OrdersClient } from "@/components/pages/order/OrdersClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "結城安全帽",
};

export default async function OrdersPage() {
  let orders: Awaited<ReturnType<typeof listOrders>>["orders"] = [];
  let initialNextId: string | null = null;

  try {
    const ordersResponse = await listOrders({ limit: 20 });
    orders = ordersResponse.orders;
    initialNextId = ordersResponse.nextId;
  } catch {
    // User might not be authenticated, orders will be empty
  }

  return (
    <OrdersClient
      initialOrders={orders}
      initialNextId={initialNextId}
    />
  );
}