# Specification

## Summary
**Goal:** Build a mobile-optimized inventory management system for a mobile accessories shop with product management, sales tracking, reporting, and PIN security.

**Planned changes:**
- Create backend data models for products (with 7 predefined categories: Cable/Charger/Handsfree/Power Bank/Cover/Tempered Glass/Other) and sales records with profit calculation
- Implement CRUD operations for products with quantity tracking and stock validation
- Build sale recording functionality that decrements inventory and stores transaction history
- Create query functions for low stock alerts (quantity < 5), expected profit, and daily/monthly sales aggregations
- Add PIN security settings management with lock toggle and 4-digit PIN
- Design dashboard with statistics cards (total products, stock quantity, low stock alert, expected profit) and low stock product list
- Build add product form with bilingual placeholders and real-time profit calculation
- Implement search functionality with real-time filtering by product name
- Create sales recording interface with product selection, stock validation, quantity input, and recent sales list
- Add quick sale functionality accessible from product cards
- Build product edit modal with update and delete capabilities
- Create reports screen showing daily sales and monthly profit with proper currency formatting
- Implement data export functionality for full inventory and low stock reports as text files
- Build PIN lock screen with 4-digit input, visual pin dots, and forgot PIN reset option
- Create settings screen with lock toggle, change PIN, backup/restore data (JSON), and reset all data with confirmation
- Design mobile-optimized navigation with sticky header ("Mobile Best - Cash Point Inventory System") and 6-tab bar (Dashboard 📊, Add ➕, Search 🔍, Sales 💰, Reports 📈, Settings ⚙️)
- Apply consistent green color scheme (#16a34a) with gradient header, green accents for profit, red alerts for low stock
- Ensure mobile-first responsive design with max-width 480px, touch-friendly targets (44px minimum), and bottom toast notifications

**User-visible outcome:** Users can manage their mobile accessories inventory on a mobile device, add and edit products, record sales with automatic stock updates, view low stock alerts, track daily/monthly profits, export reports, and secure the app with a PIN lock.
