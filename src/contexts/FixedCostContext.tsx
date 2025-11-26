'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface FixedCost {
    id: string;
    name: string;
    value: number;
}

interface FixedCostContextType {
    fixedCosts: FixedCost[];
    estimatedMonthlySales: number; // in units or orders
    addFixedCost: (cost: Omit<FixedCost, 'id'>) => void;
    removeFixedCost: (id: string) => void;
    setEstimatedMonthlySales: (value: number) => void;
    totalFixedCost: number;
    costPerSale: number;
}

const FixedCostContext = createContext<FixedCostContextType | undefined>(undefined);

export function FixedCostProvider({ children }: { children: React.ReactNode }) {
    const [fixedCosts, setFixedCosts] = useState<FixedCost[]>([]);
    const [estimatedMonthlySales, setEstimatedMonthlySalesState] = useState(1000); // Default 1000 sales

    useEffect(() => {
        const savedCosts = localStorage.getItem('precifik_fixed_costs');
        const savedSales = localStorage.getItem('precifik_estimated_sales');
        if (savedCosts) setFixedCosts(JSON.parse(savedCosts));
        if (savedSales) setEstimatedMonthlySalesState(Number(savedSales));
    }, []);

    useEffect(() => {
        localStorage.setItem('precifik_fixed_costs', JSON.stringify(fixedCosts));
        localStorage.setItem('precifik_estimated_sales', String(estimatedMonthlySales));
    }, [fixedCosts, estimatedMonthlySales]);

    const addFixedCost = (data: Omit<FixedCost, 'id'>) => {
        const newCost = {
            ...data,
            id: Math.random().toString(36).substr(2, 9),
        };
        setFixedCosts((prev) => [...prev, newCost]);
    };

    const removeFixedCost = (id: string) => {
        setFixedCosts((prev) => prev.filter((c) => c.id !== id));
    };

    const setEstimatedMonthlySales = (value: number) => {
        setEstimatedMonthlySalesState(value);
    };

    const totalFixedCost = fixedCosts.reduce((acc, curr) => acc + curr.value, 0);
    const costPerSale = estimatedMonthlySales > 0 ? totalFixedCost / estimatedMonthlySales : 0;

    return (
        <FixedCostContext.Provider value={{
            fixedCosts,
            estimatedMonthlySales,
            addFixedCost,
            removeFixedCost,
            setEstimatedMonthlySales,
            totalFixedCost,
            costPerSale
        }}>
            {children}
        </FixedCostContext.Provider>
    );
}

export function useFixedCosts() {
    const context = useContext(FixedCostContext);
    if (context === undefined) {
        throw new Error('useFixedCosts must be used within a FixedCostProvider');
    }
    return context;
}
