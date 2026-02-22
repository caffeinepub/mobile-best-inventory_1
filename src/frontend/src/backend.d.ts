import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Settings {
    pin: string;
    lockEnabled: boolean;
}
export interface ProductInput {
    purchasePrice: bigint;
    name: string;
    quantity: bigint;
    category: Category;
    salePrice: bigint;
}
export interface Sale {
    id: bigint;
    purchasePrice: bigint;
    date: bigint;
    productId: bigint;
    productName: string;
    quantity: bigint;
    profit: bigint;
    salePrice: bigint;
}
export interface Product {
    id: bigint;
    purchasePrice: bigint;
    name: string;
    createdAt: bigint;
    quantity: bigint;
    category: Category;
    salePrice: bigint;
}
export enum Category {
    TemperedGlass = "TemperedGlass",
    PowerBank = "PowerBank",
    Handsfree = "Handsfree",
    Charger = "Charger",
    Other = "Other",
    Cable = "Cable",
    Cover = "Cover"
}
export interface backendInterface {
    addProduct(input: ProductInput): Promise<bigint>;
    deleteProduct(id: bigint): Promise<void>;
    getAllProducts(): Promise<Array<Product>>;
    getLowStockProducts(): Promise<Array<Product>>;
    getSalesByDateRange(start: bigint, end: bigint): Promise<Array<Sale>>;
    getSettings(): Promise<Settings>;
    recordSale(productId: bigint, quantity: bigint): Promise<bigint>;
    toggleLock(): Promise<void>;
    updatePin(newPin: string): Promise<void>;
    updateProduct(id: bigint, input: ProductInput): Promise<void>;
}
