"use client";

import { StockItem } from "@/lib/models/stock";
import { Package, TrendingUp, AlertCircle, CheckCircle, Info } from "lucide-react";

interface StockItemViewProps {
  item?: StockItem;
}

export const StockItemView = ({ item }: StockItemViewProps) => {
  if (!item) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span className="text-red-800 font-medium">Ürün bulunamadı</span>
        </div>
        <p className="text-red-700 mt-2">Aradığınız ürün database&apos;de kayıtlı değil.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-4 border-b">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">{item.malzemeTanimi}</h2>
              {item.kalemGrup && (
                <p className="text-gray-600">Grup: {item.kalemGrup}</p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-sm font-medium">
                  Kod: {item.stokKodu}
                </span>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-600">{item.kategori}</span>
              </div>
            </div>
            <div className="px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
              ✅ Database Kaydı
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Product Information */}
            <div className="space-y-3">
              <h3 className="font-semibold text-amber-800 flex items-center gap-2">
                <Package className="w-4 h-4" />
                Ürün Bilgileri
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Stok Kodu:</span>
                  <span className="font-medium">{item.stokKodu}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ürün Adı:</span>
                  <span className="font-medium">{item.malzemeTanimi}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Kategori:</span>
                  <span className="font-medium">{item.kategori}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ölçü Birimi:</span>
                  <span className="font-medium">{item.olcuBirimi}</span>
                </div>
                {item.kalemGrup && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Kalem Grubu:</span>
                    <span className="font-medium">{item.kalemGrup}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Database Information */}
            <div className="space-y-3">
              <h3 className="font-semibold text-amber-800 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Database Bilgisi
              </h3>
              <div className="space-y-2">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-green-800 font-medium">✅ Kayıt Mevcut</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    Bu ürün database&apos;de kayıtlı.
                  </p>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-amber-600" />
                    <span className="text-amber-800 font-medium">ℹ️ Not</span>
                  </div>
                  <p className="text-amber-700 text-sm mt-1">
                    Database&apos;de fiyat ve stok seviyesi bilgisi bulunmuyor.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 