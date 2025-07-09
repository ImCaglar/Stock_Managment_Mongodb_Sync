"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Sparkles, Search, Send, MessageCircle, AlertTriangle, BarChart3 } from "lucide-react";
import { Message } from "@/components/message";
import { actions } from "./actions";

export const dynamic = 'force-dynamic';

export default function Home() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  
  const chatAreaRef = useRef<HTMLDivElement>(null);

  const [criticalStockItems, setCriticalStockItems] = useState<any[]>([]);
  const [overallStats, setOverallStats] = useState<any>({
    totalProducts: 0,
    categories: [],
    topUnits: [],
    summary: { totalCategories: 0, mostPopularCategory: '', leastStockedCategory: '' }
  });
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsDataLoading(true);
        const response = await fetch('/api/stats');
        if (!response.ok) {
          throw new Error(`API hatası: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
          setCriticalStockItems(result.data.criticalItems || []);
          setOverallStats(result.data.overallStats || {
            totalProducts: 0,
            categories: [],
            topUnits: [],
            summary: { totalCategories: 0, mostPopularCategory: 'Bilinmeyen', leastStockedCategory: 'Bilinmeyen' }
          });
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        console.error('Panel verisi yükleme hatası:', error);
        setCriticalStockItems([]);
        setOverallStats({
          totalProducts: 0,
          categories: [],
          topUnits: [],
          summary: { totalCategories: 0, mostPopularCategory: 'Bilinmeyen', leastStockedCategory: 'Bilinmeyen' }
        });
      } finally {
        setIsDataLoading(false);
      }
    };

    loadInitialData();
    const interval = setInterval(loadInitialData, 300000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (chatAreaRef.current && messages.length > 0) {
      chatAreaRef.current.scrollTo({
        top: chatAreaRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

  const handleSubmit = useCallback(async (query: string) => {
    if (!query.trim() || isLoading) return;
    
    setIsLoading(true);
    setInput("");

    setMessages((prev) => [
      ...prev,
      <Message key={prev.length} role="user" content={query} />
    ]);

    try {
      const response = await actions.sendMessage(query);
      setMessages((prev) => [...prev, response]);
    } catch (error) {
      console.error('Mesaj gönderme hatası:', error);
      setMessages((prev) => [
        ...prev,
        <Message 
          key={prev.length + 1} 
          role="assistant" 
          content="❌ Bir hata oluştu. Lütfen tekrar deneyin." 
        />
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const handleQuickAction = useCallback((query: string) => {
    handleSubmit(query);
  }, [handleSubmit]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-100 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-100/30 to-yellow-100/30"></div>
        </div>
      
      <div className="relative z-10 h-screen flex flex-col">
        {/* Header */}
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="p-4 border-b border-white/20 backdrop-blur-xl bg-white/10"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-600 text-white shadow-lg">
                <Package className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-900 to-amber-600 bg-clip-text text-transparent">
                  Stock Yönetim Sistemi
                </h1>
                <p className="text-amber-700">Akıllı envanter yönetim platformu</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-emerald-700 text-sm font-medium">Canlı</span>
            </div>
          </div>
        </motion.header>

        {/* 3 Column Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* SOL PANEL - KRİTİK STOK */}
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="w-80 h-full bg-white/20 backdrop-blur-xl border-r border-white/30 flex flex-col"
          >
            <div className="p-4 border-b border-white/20">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h2 className="font-bold text-red-800">Kritik Stok</h2>
                {isDataLoading && (
                  <div className="w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin"></div>
                )}
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-3">
                {isDataLoading ? (
                  Array(4).fill(0).map((_, index) => (
                    <div key={index} className="bg-white/40 rounded-lg p-3 animate-pulse">
                      <div className="h-4 bg-gray-300 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  ))
                ) : criticalStockItems.length === 0 ? (
                  <div className="bg-green-50 rounded-lg p-3 border border-green-200 text-center">
                    <p className="text-green-700 text-sm">🎉 Şu an kritik stok yok!</p>
                  </div>
                ) : (
                  criticalStockItems.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/60 rounded-lg p-3 border border-red-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 text-sm">{item.malzemeTanimi}</h3>
                          <p className="text-xs text-amber-600 font-mono">#{item.stokKodu}</p>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                          item.mevcutStok === 0 ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'
                        }`}>
                          {item.mevcutStok === 0 ? 'YOK' : 'KRİTİK'}
                        </div>
                      </div>
                      <div className="flex gap-4 text-xs text-gray-600">
                        <span>Mevcut: <span className="font-semibold text-gray-800">{item.mevcutStok} {item.olcuBirimi}</span></span>
                        <span>Kritik: <span className="font-semibold text-gray-800">{item.kritikSeviye} {item.olcuBirimi}</span></span>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            <div className="p-4 border-t border-white/20">
              <button
                onClick={() => handleQuickAction("Kritik stok analizi")}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                disabled={isDataLoading}
              >
                {isDataLoading ? 'Yükleniyor...' : 'Detaylı Analiz'}
              </button>
            </div>
          </motion.div>

          {/* ORTA PANEL - AI CHAT */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 flex flex-col bg-white/10 backdrop-blur-xl"
          >
            <div className="p-4 border-b border-white/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-indigo-600" />
                  <div>
                    <h2 className="font-bold text-indigo-800">AI Asistan</h2>
                    <p className="text-xs text-indigo-600">Konuşma geçmişini hatırlar</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      actions.resetConversation();
                      setMessages([]);
                    }}
                    className="px-2 py-1 rounded-md bg-red-100 hover:bg-red-200 text-red-700 text-xs font-medium transition-colors"
                    title="Yeni konuşma başlat"
                  >
                    🔄 Yeni
                  </button>
                  {[
                    { name: "🥩 Et", query: "Et Ürünleri kategorisi" },
                    { name: "🐟 Deniz", query: "Deniz Ürünleri kategorisi" },
                    { name: "🍎 Meyve", query: "Meyveler kategorisi" },
                    { name: "📊 Durum", query: "Stok durumu özeti" }
                  ].map((action, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickAction(action.query)}
                      className="px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 text-xs font-medium text-gray-700 hover:text-gray-900 transition-colors"
                    >
                      {action.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div 
              ref={chatAreaRef}
              className="flex-1 p-6 overflow-y-auto"
            >
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <Sparkles className="w-12 h-12 mx-auto text-amber-500 mb-4" />
                    <h3 className="text-2xl font-bold text-amber-800 mb-2">Merhaba! 👋</h3>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 max-w-4xl mx-auto">
                  <AnimatePresence mode="popLayout">
                    {messages.map((message, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        {message}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                 
                  {isLoading && (
                    <div className="flex justify-center">
                      <div className="p-3 rounded-2xl bg-white/70 border border-white/80">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            {[0, 1, 2].map((i) => (
                              <div
                                key={i}
                                className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"
                                style={{ animationDelay: `${i * 0.2}s` }}
                              />
                            ))}
                          </div>
                          <span className="text-gray-600 text-xs">Düşünüyor...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-white/20">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit(input);
                }}
                className="flex gap-3 max-w-4xl mx-auto"
              >
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Sorunuzu yazın..."
                    disabled={isLoading}
                    className="w-full px-4 py-3 rounded-xl bg-white/70 border border-white/60 
                             focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white/90
                             text-gray-800 placeholder-gray-500 transition-all duration-300
                             disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 
                           text-white font-medium transition-all duration-300 hover:shadow-lg
                           disabled:opacity-50 disabled:cursor-not-allowed
                           flex items-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span>Gönder</span>
                </button>
              </form>
            </div>
          </motion.div>

          {/* SAĞ PANEL - GENEL İSTATİSTİKLER */}
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-80 h-full bg-white/20 backdrop-blur-xl border-l border-white/30 flex flex-col"
          >
            <div className="p-4 border-b border-white/20">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <h2 className="font-bold text-blue-800">Genel İstatistikler</h2>
                {isDataLoading && (
                  <div className="w-4 h-4 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
                )}
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                {/* Toplam Ürün */}
                <div className="bg-white/60 rounded-lg p-4 border border-white/50">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-800 text-sm">📦 Toplam Ürün</h3>
                    <span className="text-2xl font-bold text-blue-600">
                      {overallStats.totalProducts?.toLocaleString('tr-TR') || 0}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">Envanterde bulunan ürün sayısı</p>
                </div>

                {/* Kategori Durumu */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-800 text-sm">📊 Kategori Dağılımı</h3>
                  <div className="space-y-2">
                    {overallStats.categories?.slice(0, 8).map((category: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-white/60 rounded text-xs border border-white/50"
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            category.percentage > 30 ? 'bg-green-500' :
                            category.percentage > 15 ? 'bg-orange-500' : 'bg-red-500'
                          }`}></div>
                          <span className="font-medium text-gray-800">{category.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-gray-700 font-semibold">{category.count}</span>
                          <span className="text-gray-500 ml-1">({category.percentage}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Özet Bilgiler */}
                <div className="bg-white/60 rounded-lg p-3 border border-white/50">
                  <h3 className="font-semibold text-gray-800 text-sm mb-2">📈 Özet</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Toplam Kategori:</span>
                      <span className="font-semibold text-gray-800">{overallStats.summary?.totalCategories || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">En Popüler:</span>
                      <span className="font-semibold text-gray-800">{overallStats.summary?.mostPopularCategory || 'Bilinmeyen'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">En Az Stok:</span>
                      <span className="font-semibold text-gray-800">{overallStats.summary?.leastStockedCategory || 'Bilinmeyen'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-white/20">
              <button
                onClick={() => handleQuickAction("Genel stok durumu")}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                disabled={isDataLoading}
              >
                {isDataLoading ? 'Yükleniyor...' : 'Detaylı Rapor'}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
