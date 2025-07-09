"use client";

import { motion } from "framer-motion";
import { 
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle, 
  Package, BarChart3, Clock, Activity 
} from "lucide-react";

interface StockStats {
  totalItems: number;
  lowStockItems: number;
  outOfStockItems: number;
  recentlyUpdated: number;
}

interface StockDashboardProps {
  onQuickAction: (query: string) => void;
}

export const StockDashboard = ({ onQuickAction }: StockDashboardProps) => {
  // Mock data - bu gerçek API'den gelecek
  const stats: StockStats = {
    totalItems: 247,
    lowStockItems: 12,
    outOfStockItems: 3,
    recentlyUpdated: 8
  };

  const quickStats = [
    {
      title: "Toplam Ürün",
      value: stats.totalItems,
      change: "+5%",
      isPositive: true,
      icon: Package,
      color: "blue",
      query: "Tüm ürün listesini göster"
    },
    {
      title: "Kritik Stok",
      value: stats.lowStockItems,
      change: "+2",
      isPositive: false,
      icon: AlertTriangle,
      color: "red",
      query: "Stoku azalan ürünleri göster"
    },
    {
      title: "Stokta Yok",
      value: stats.outOfStockItems,
      change: "-1",
      isPositive: true,
      icon: TrendingDown,
      color: "orange",
      query: "Stokta olmayan ürünleri göster"
    },
    {
      title: "Son Güncellenen",
      value: stats.recentlyUpdated,
      change: "bugün",
      isPositive: true,
      icon: Clock,
      color: "green",
      query: "Son güncellemeler"
    }
  ];

  const categoryStats = [
    { name: "Balık & Deniz Ürünleri", count: 12, status: "normal" },
    { name: "Et Ürünleri", count: 8, status: "low" },
    { name: "Sebze & Meyve", count: 15, status: "normal" },
    { name: "Temizlik", count: 6, status: "critical" },
    { name: "Yatak Takımları", count: 22, status: "normal" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-zinc-700/50 shadow-xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-amber-600 to-yellow-600 p-2 rounded-xl">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Stok Dashboard</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Anlık stok durumu özeti</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-green-500 animate-pulse" />
          <span className="text-xs text-green-600 dark:text-green-400 font-medium">Canlı</span>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {quickStats.map((stat, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onQuickAction(stat.query)}
            className={`p-4 rounded-xl text-left transition-all group ${
              stat.color === 'blue' ? 'bg-gradient-to-br from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 dark:from-amber-900/20 dark:to-amber-800/20' :
              stat.color === 'red' ? 'bg-gradient-to-br from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 dark:from-red-900/20 dark:to-red-800/20' :
              stat.color === 'orange' ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-200 dark:from-yellow-900/20 dark:to-yellow-800/20' :
              'bg-gradient-to-br from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 dark:from-emerald-900/20 dark:to-emerald-800/20'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={`w-5 h-5 ${
                stat.color === 'blue' ? 'text-amber-600' :
                stat.color === 'red' ? 'text-red-600' :
                stat.color === 'orange' ? 'text-yellow-600' :
                'text-emerald-600'
              }`} />
              <div className={`flex items-center gap-1 text-xs font-medium ${
                stat.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white group-hover:scale-105 transition-transform">
              {stat.value}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</div>
          </motion.button>
        ))}
      </div>

      {/* Category Status */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-sm">Kategori Durumu</h3>
        <div className="space-y-2">
          {categoryStats.map((category, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.01 }}
              onClick={() => onQuickAction(`${category.name} kategorisini göster`)}
              className="w-full p-3 bg-white/60 dark:bg-zinc-700/60 rounded-lg hover:bg-white/90 dark:hover:bg-zinc-700/90 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    category.status === 'critical' ? 'bg-red-500' :
                    category.status === 'low' ? 'bg-orange-500' :
                    'bg-green-500'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {category.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {category.count} ürün
                  </span>
                  {category.status === 'normal' && <CheckCircle className="w-4 h-4 text-green-500" />}
                  {category.status === 'low' && <AlertTriangle className="w-4 h-4 text-orange-500" />}
                  {category.status === 'critical' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Quick Actions Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200/50 dark:border-zinc-700/50">
        <div className="flex flex-wrap gap-2">
          {[
            "Detaylı rapor al",
            "Excel'e aktar", 
            "Stok uyarı ayarları",
            "Geçmiş analizi"
          ].map((action, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onQuickAction(action)}
              className="px-3 py-1 text-xs bg-gradient-to-r from-gray-100 to-gray-200 dark:from-zinc-700 dark:to-zinc-600 text-gray-700 dark:text-gray-200 rounded-full hover:from-amber-100 hover:to-amber-200 dark:hover:from-amber-900/30 dark:hover:to-amber-800/30 transition-all"
            >
              {action}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}; 