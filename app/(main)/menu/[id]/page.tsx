import ItemDetails from "@/components/menu/ItemDetails";

export default async function MenuDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ItemDetails id={id} />;
}