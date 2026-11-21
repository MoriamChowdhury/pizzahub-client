import PaymentSuccess from "@/components/payment/PaymentSuccess";
import { requireRole } from "@/lib/session";

export default async function PaymentSuccessPage() {
  await requireRole(["vendor"]);
  return <PaymentSuccess />;
}