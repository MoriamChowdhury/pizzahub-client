import MenuItemForm from "@/components/menu/MenuItemForm";

export default function AddItemPage() {
  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Add Menu Item</h1>
      <MenuItemForm />
    </div>
  );
}