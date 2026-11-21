import ItemDetails from "@/components/menu/ItemDetails";
import { requireLogin } from "@/lib/session";

export default async function MenuDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireLogin(`/menu/${id}`);
  return <ItemDetails id={id} />;
}