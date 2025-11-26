'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Ingredient {
    id: string;
    name: string;
    unit: 'kg' | 'l' | 'un';
    price: number;
    quantity: number;
    pricePerBaseUnit: number; // Price per g, ml, or unit
}

interface IngredientContextType {
    ingredients: Ingredient[];
    addIngredient: (ingredient: Omit<Ingredient, 'id' | 'pricePerBaseUnit'>) => void;
    removeIngredient: (id: string) => void;
}

const IngredientContext = createContext<IngredientContextType | undefined>(undefined);

export function IngredientProvider({ children }: { children: React.ReactNode }) {
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);

    // Load from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem('precifik_ingredients');
        if (saved) {
            setIngredients(JSON.parse(saved));
        }
    }, []);

    // Save to local storage on change
    useEffect(() => {
        localStorage.setItem('precifik_ingredients', JSON.stringify(ingredients));
    }, [ingredients]);

    const addIngredient = (data: Omit<Ingredient, 'id' | 'pricePerBaseUnit'>) => {
        let baseQuantity = data.quantity;

        // Convert to base units (g, ml)
        if (data.unit === 'kg') baseQuantity = data.quantity * 1000;
        if (data.unit === 'l') baseQuantity = data.quantity * 1000;

        const pricePerBaseUnit = data.price / baseQuantity;

        const newIngredient: Ingredient = {
            ...data,
            id: Math.random().toString(36).substr(2, 9),
            pricePerBaseUnit,
        };

        setIngredients((prev) => [...prev, newIngredient]);
    };

    const removeIngredient = (id: string) => {
        setIngredients((prev) => prev.filter((i) => i.id !== id));
    };

    return (
        <IngredientContext.Provider value={{ ingredients, addIngredient, removeIngredient }}>
            {children}
        </IngredientContext.Provider>
    );
}

export function useIngredients() {
    const context = useContext(IngredientContext);
    if (context === undefined) {
        throw new Error('useIngredients must be used within an IngredientProvider');
    }
    return context;
}
