"use client";

import type { Category } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface MenuCategoriesProps {
  categories: Category[];
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
  isMobile?: boolean;
}

export default function MenuCategories({
  categories,
  selectedCategoryId,
  onSelectCategory,
  isMobile = false,
}: MenuCategoriesProps) {
  if (isMobile) {
    return (
      <ScrollArea className="w-full whitespace-nowrap rounded-md">
        <div className="flex w-max space-x-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategoryId === category.id ? "default" : "outline"}
              onClick={() => onSelectCategory(category.id)}
              className="flex-shrink-0"
            >
              {category.name}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    );
  }

  return (
    <div className="flex h-full flex-col p-4">
      <h2 className="mb-4 font-headline text-2xl font-semibold">Categorías</h2>
      <ScrollArea className="h-[350px] max-h-full rounded-md pr-2">
        <nav className="flex flex-col gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategoryId === category.id ? "secondary" : "ghost"}
              size="lg"
              onClick={() => onSelectCategory(category.id)}
              className="justify-start text-base"
            >
              {category.name}
            </Button>
          ))}
        </nav>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
}
