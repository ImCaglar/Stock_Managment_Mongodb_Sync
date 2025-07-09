import { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";

import { AI } from "./actions";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "📦 Stok Yönetim Sistemi - AI Destekli",
  description: "Yapay zeka destekli akıllı stok yönetim sistemi - Modern ve kullanıcı dostu arayüz",
  metadataBase: new URL('http://localhost:3000'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={inter.className}>
      <body className="antialiased">
        <Toaster position="top-center" />
        
        {/* Global Background */}
        <div className="fixed inset-0 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-100 -z-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGRlZnM+CjxwYXR0ZXJuIGlkPSJhIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgo8cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9Im5vbmUiLz4KPGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMSIgZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIwLjA1Ii8+CjwvcGF0dGVybj4KPC9kZWZzPgo8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2EpIi8+Cjwvc3ZnPg==')] opacity-30"></div>
          
          {/* Animated particles */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
            <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
          </div>
        </div>

        <div className="relative z-10">
          <AI>
            {children}
          </AI>
        </div>

        {/* Global Error Boundary Fallback */}
        <div id="error-boundary" className="hidden fixed inset-0 bg-red-50 flex items-center justify-center z-50">
          <div className="text-center p-8 bg-white rounded-lg shadow-lg border border-red-200">
            <h2 className="text-xl font-bold text-red-800 mb-4">Bir Hata Oluştu</h2>
            <p className="text-red-600 mb-4">Sayfa yüklenirken bir hata meydana geldi.</p>
            <div className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors cursor-pointer">
              Sayfayı Yenile
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
