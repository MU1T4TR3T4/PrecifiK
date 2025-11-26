'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ProductIngredient {
    ingredientId: string;
    quantityUsed: number; // in base unit (g, ml, un)
}

export interface Product {
    id: string;
    name: string;
    ingredients: ProductIngredient[];
    laborCost: number;
    packagingCost: number;
    profitMargin: number; // percentage
}

interface ProductContextType {
    products: Product[];
    addProduct: (product: Omit<Product, 'id'>) => void;
    removeProduct: (id: string) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('precifik_products');
        if (saved) {
            setProducts(JSON.parse(saved));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('precifik_products', JSON.stringify(products));
    }, [products]);

    const addProduct = (data: Omit<Product, 'id'>) => {
        const newProduct = {
            ...data,
            id: Math.random().toString(36).substr(2, 9),
        };
        setProducts((prev) => [...prev, newProduct]);
    };

    const removeProduct = (id: string) => {
        setProducts((prev) => prev.filter((p) => p.id !== id));
    };

    return (
        <ProductContext.Provider value={{ products, addProduct, removeProduct }}>
            {children}
        </ProductContext.Provider>
    );
}

export function useProducts() {
    const context = useContext(ProductContext);
    if (context === undefined) {
        throw new Error('useProducts must be used within a ProductProvider');
    }
    return context;
}
