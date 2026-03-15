"use client"

interface CategoryFilterProps {
    categories: string[];
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
}

export function CategoryFilter({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) {
    const allCategories = ["All", ...categories];

    return (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
            {allCategories.map((category) => (
                <button
                    key={category}
                    onClick={() => onSelectCategory(category)}
                    className={`
                        whitespace-nowrap px-6 py-2.5 rounded-xl font-bold transition-all border
                        ${selectedCategory === category
                            ? "bg-primary-500 border-primary-400 text-white shadow-lg shadow-primary-500/20"
                            : "bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10 hover:text-white"
                        }
                    `}
                >
                    {category}
                </button>
            ))}
        </div>
    );
}
