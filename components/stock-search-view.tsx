"use client";

import { motion } from "framer-motion";
import { StockResponse } from "@/lib/models/stock";
import { Package, MapPin, AlertTriangle, TrendingUp } from "lucide-react";

export const StockSearchView = ({ 
  results, 
  searchTerm 
}: { 
  results: StockResponse;
  searchTerm: string;
}) => {
  return (
    <div className="md:max-w-[600px] max-w-[calc(100dvw-80px)] w-full pb-6">
      <motion.div
        className="flex flex-col gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Package className="w-5 h-5 text-amber-600" />
          <h3 className="font-semibold text-lg">
            &quot;{searchTerm}&quot; için {results.total} sonuç bulundu
          </h3>
        </div>
        
        {results.items.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <p className="text-yellow-800">
                Aradığınız ürün bulunamadı. Lütfen farklı bir arama terimi deneyin.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-3">
            {results.items.map((item, index) => (
              <motion.div
                key={item.stokKodu}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {item.malzemeTanimi}
                    </h4>
                    <p className="text-xs text-amber-600 font-mono">Kod: {item.stokKodu}</p>
                    <p className="text-sm text-gray-600">Kategori: {item.kategori}</p>
                  </div>
                  <div className="text-right">
                    <div className="px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                      {item.olcuBirimi}
                    </div>
                  </div>
                </div>
                
                {item.kalemGrup && (
                  <p className="text-sm text-gray-700 mb-3">
                    Grup: {item.kalemGrup}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        )}
        
        {results.hasAlternatives && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-sm text-amber-800">
              💡 Bu ürünler için alternatif seçenekler mevcut. Detaylı bilgi için ürün kodunu sorun.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}; 