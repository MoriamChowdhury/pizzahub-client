import { Suspense } from "react";
import MenuBrowser from "@/components/menu/MenuBrowser";
import SectionHeading from "@/components/shared/SectionHeading";

export default function MenuPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <SectionHeading
        title="Browse Menu"
        subtitle="Search, filter and find your perfect pizza"
      />
      <Suspense fallback={null}>
        <MenuBrowser />
      </Suspense>
    </div>
  );
}
