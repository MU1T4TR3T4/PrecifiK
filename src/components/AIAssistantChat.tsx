'use client';

import { useState, useRef, useEffect } from 'react';
import { useIngredients } from '@/contexts/IngredientContext';
import { useProducts } from '@/contexts/ProductContext';
import { useFixedCosts } from '@/contexts/FixedCostContext';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export default function AIAssistantChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Get business context
    const { ingredients } = useIngredients();
    const { products } = useProducts();
    const { fixedCosts, totalFixedCost, costPerSale, estimatedMonthlySales } = useFixedCosts();

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Build business context
    const getBusinessContext = () => {
        return {
            totalIngredients: ingredients.length,
            totalProducts: products.length,
            totalFixedCosts: totalFixedCost,
            costPerSale,
            estimatedMonthlySales,
            ingredients: ingredients.map(ing => ({
                name: ing.name,
                unit: ing.unit,
                pricePerBaseUnit: ing.pricePerBaseUnit
            })),
            products: products.map(prod => ({
                name: prod.name,
                profitMargin: prod.profitMargin,
                laborCost: prod.laborCost,
                packagingCost: prod.packagingCost
            })),
            fixedCosts: fixedCosts.map(cost => ({
                name: cost.name,
                value: cost.value
            }))
        };
    };

    const handleSendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;

        const userMessage: Message = {
            role: 'user',
            content: inputMessage
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: inputMessage,
                    conversationHistory: messages,
                    businessContext: getBusinessContext()
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao obter resposta da IA');
            }

            const aiMessage: Message = {
                role: 'assistant',
                content: data.message
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (error: any) {
            console.error('Chat Error:', error);
            const errorMessage: Message = {
                role: 'assistant',
                content: '❌ Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.'
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <>
            {/* Floating Chat Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    style={{
                        position: 'fixed',
                        bottom: '2rem',
                        right: '2rem',
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #EA1D2C, #ff4b59)',
                        color: 'white',
                        border: 'none',
                        fontSize: '1.5rem',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(234, 29, 44, 0.4)',
                        zIndex: 9998,
                        transition: 'transform 0.2s, box-shadow 0.2s',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.1)';
                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(234, 29, 44, 0.6)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(234, 29, 44, 0.4)';
                    }}
                >
                    💬
                </button>
            )}

            {/* Chat Popup */}
            {isOpen && (
                <div style={{
                    position: 'fixed',
                    bottom: '2rem',
                    right: '2rem',
                    width: '400px',
                    maxWidth: 'calc(100vw - 4rem)',
                    height: '600px',
                    maxHeight: 'calc(100vh - 4rem)',
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                    zIndex: 9999,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                }}>
                    {/* Header */}
                    <div style={{
                        padding: '1.5rem',
                        background: 'linear-gradient(135deg, #EA1D2C, #ff4b59)',
                        color: 'white',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>🤖 Assistente PrecifiK</h3>
                            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', opacity: 0.9 }}>
                                Consultor de Negócios IA
                            </p>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            style={{
                                background: 'rgba(255,255,255,0.2)',
                                border: 'none',
                                color: 'white',
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                cursor: 'pointer',
                                fontSize: '1.2rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            ×
                        </button>
                    </div>

                    {/* Messages */}
                    <div style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '1rem',
                        backgroundColor: '#f5f5f5'
                    }}>
                        {messages.length === 0 && (
                            <div style={{
                                textAlign: 'center',
                                padding: '2rem 1rem',
                                color: '#666'
                            }}>
                                <p style={{ fontSize: '2rem', margin: '0 0 1rem 0' }}>👋</p>
                                <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>
                                    Olá! Sou seu assistente de negócios.
                                </p>
                                <p style={{ margin: 0, fontSize: '0.9rem' }}>
                                    Posso ajudar com análise de custos, precificação, otimização de margem e muito mais!
                                </p>
                            </div>
                        )}

                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                style={{
                                    marginBottom: '1rem',
                                    display: 'flex',
                                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
                                }}
                            >
                                <div style={{
                                    maxWidth: '80%',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '12px',
                                    backgroundColor: msg.role === 'user' ? '#EA1D2C' : 'white',
                                    color: msg.role === 'user' ? 'white' : '#333',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word'
                                }}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div style={{
                                display: 'flex',
                                justifyContent: 'flex-start',
                                marginBottom: '1rem'
                            }}>
                                <div style={{
                                    padding: '0.75rem 1rem',
                                    borderRadius: '12px',
                                    backgroundColor: 'white',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }}>
                                    <span style={{ opacity: 0.6 }}>Digitando...</span>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div style={{
                        padding: '1rem',
                        borderTop: '1px solid #e0e0e0',
                        backgroundColor: 'white'
                    }}>
                        <div style={{
                            display: 'flex',
                            gap: '0.5rem'
                        }}>
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Digite sua pergunta..."
                                disabled={isLoading}
                                style={{
                                    flex: 1,
                                    padding: '0.75rem',
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '8px',
                                    fontSize: '0.95rem',
                                    outline: 'none'
                                }}
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={isLoading || !inputMessage.trim()}
                                style={{
                                    padding: '0.75rem 1.25rem',
                                    background: isLoading || !inputMessage.trim() ? '#ccc' : 'linear-gradient(135deg, #EA1D2C, #ff4b59)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: isLoading || !inputMessage.trim() ? 'not-allowed' : 'pointer',
                                    fontWeight: 'bold'
                                }}
                            >
                                {isLoading ? '...' : '➤'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
