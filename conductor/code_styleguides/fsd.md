# FSD Architecture Guide - Lotter

This project follows the **Feature-Sliced Design (FSD)** architectural methodology.

## 🧱 Strict Layering Rules
To maintain high maintainability and prevent circular dependencies, we enforce the following rules:

1. **One-Way Flow**: Higher layers can import from lower layers, but never the reverse.
   - `app` → `pages` → `widgets` → `features` → `entities` → `shared`
2. **No Cross-Imports**: A slice in a layer cannot import from another slice in the **same** layer.
   - ❌ `features/search` imports from `features/cart`
   - ✅ Both import from `entities/product` or `shared/ui`
3. **Public API**: Only import from a slice via its `index.ts` (Public API). Never import internal files directly.
   - ❌ `import { Item } from "@/features/cart/ui/Item"`
   - ✅ `import { CartItem } from "@/features/cart"`

## 📂 Layer Definitions
- **app**: Bootstrapping, providers, global styles.
- **pages**: Main routes of the application.
- **widgets**: Large UI components composed of features and entities (e.g., Header, Sidebar).
- **features**: User actions that bring business value (e.g., AddToCart, SearchProduct).
- **entities**: Domain objects (e.g., Product, Organization, Order).
- **shared**: Reusable UI, helpers, and base configuration.
