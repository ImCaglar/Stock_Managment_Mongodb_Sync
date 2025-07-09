# 👑 AI-Powered Stock Management System

> Modern inventory management with AI-powered chatbot interface in premium golden theme

![Dashboard Overview](screenshots/Screenshot1.png)

## 🌍 English

### 🚀 Overview
An intelligent stock management system that enables users to query inventory using natural Turkish language. Originally designed for luxury hospitality industry with premium golden theme, featuring advanced AI conversation memory and contextual analysis capabilities. Built with Next.js, MongoDB, and OpenAI GPT-4o.

### ✨ Key Features
- **🧠 AI Memory System**: Remembers conversation history for contextual analysis
- **🗣️ Natural Language Queries**: Ask "Kritik stok var mı?" in Turkish
- **🤖 Intelligent Responses**: Smart product recommendations with context awareness
- **⚠️ Critical Stock Monitoring**: Real-time critical inventory alerts and warnings
- **📊 Advanced Analytics**: Comprehensive stock distribution and risk analysis
- **📱 Responsive Design**: Modern premium UI with golden/amber theme
- **🔄 Category Management**: Meat, seafood, vegetables, dairy, cleaning supplies, etc.
- **💾 Context Persistence**: AI remembers previous queries for follow-up questions
- **🎯 Smart Recommendations**: Contextual suggestions based on conversation history

### 🛠️ Tech Stack
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Framer Motion
- **AI**: OpenAI GPT-4o with Vercel AI SDK & conversation memory
- **Database**: MongoDB Atlas with real-time data sync
- **UI**: Premium golden theme with glassmorphism effects
- **State**: React hooks with conversation context management

### ⚡ Quick Start
```bash
# Clone the repository
git clone <repo-url>
cd stock-management-system

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Add your OPENAI_API_KEY and MONGODB_URI

# Start development server
npm run dev

# Initialize database (optional)
curl -X POST http://localhost:3000/api/init-db
```

### 📷 Screenshots

#### 🔹 Category Analysis View
![Category View](screenshots/Screenshot2.png)

#### 🔹 Critical Stock Alerts
![Critical Stock](screenshots/Screenshot3.png)

#### 🔹 Overall Statistics & Risk Analysis
![Statistics](screenshots/Screenshot4.png)

#### 🔹 Chatbot AI
![Statistics](screenshots/Screenshot5.png)



### 🎯 Usage Examples
**Basic Queries:**
- "Kritik stok analizi" → Get critical stock analysis
- "Et ürünleri kategorisi" → View meat products category
- "Genel stok durumu" → Overall inventory status

**Advanced Contextual Queries:**
1. First ask: "Kritik stok analizi göster"
2. Then ask: "Hangi ürünü acilen sipariş etmeliyim?"
3. AI will analyze based on previous critical stock data

**Product Search:**
- "Somon balığı var mı?" → Search for salmon
- "STOCK001 detayları" → Product details
- "Temizlik malzemeleri" → Cleaning supplies

### 🌐 Demo
Visit: `http://localhost:3000`

---

## 🇹🇷 Türkçe

### 🚀 Genel Bakış
Kullanıcıların doğal Türkçe ile stok sorgulama yapabildiği yapay zeka destekli akıllı stok yönetim sistemi. Lüks otelcilik sektörü için tasarlanmış premium altın temalı arayüz ile gelişmiş AI konuşma hafızası ve bağlamsal analiz özelliklerine sahiptir. Next.js, MongoDB ve OpenAI GPT-4o ile geliştirilmiştir.

### ✨ Temel Özellikler
- **🧠 AI Hafıza Sistemi**: Konuşma geçmişini hatırlayarak bağlamsal analiz yapar
- **🗣️ Doğal Dil Sorguları**: "Kritik stok var mı?" şeklinde Türkçe sorular
- **🤖 Akıllı Yanıtlar**: Bağlam farkındalığı ile akıllı ürün önerileri
- **⚠️ Kritik Stok İzleme**: Gerçek zamanlı kritik stok uyarıları ve bildirimleri
- **📊 Gelişmiş Analitik**: Kapsamlı stok dağılımı ve risk analizi
- **📱 Responsive Tasarım**: Altın/amber temalı modern premium arayüz
- **🔄 Kategori Yönetimi**: Et, deniz ürünleri, sebze, süt ürünleri, temizlik vb.
- **💾 Bağlam Kalıcılığı**: AI önceki sorguları hatırlayarak takip soruları yapar
- **🎯 Akıllı Öneriler**: Konuşma geçmişine dayalı bağlamsal öneriler

### 🛠️ Teknoloji Yığını
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Framer Motion
- **AI**: OpenAI GPT-4o + Vercel AI SDK & konuşma hafızası
- **Veritabanı**: MongoDB Atlas ile gerçek zamanlı veri senkronizasyonu
- **UI**: Glassmorphism efektli premium altın tema
- **State**: Konuşma bağlamı yönetimi ile React hooks

### ⚡ Hızlı Başlangıç
```bash
# Depoyu klonla
git clone <repo-url>
cd stock-management-system

# Bağımlılıkları yükle
npm install

# Ortam değişkenlerini ayarla
cp .env.example .env.local
# OPENAI_API_KEY ve MONGODB_URI ekle

# Geliştirme sunucusunu başlat
npm run dev

# Veritabanını başlat (opsiyonel)
curl -X POST http://localhost:3000/api/init-db
```

### 🎯 Kullanım Örnekleri
**Temel Sorgular:**
- "Kritik stok analizi" → Kritik stok analizi al
- "Et ürünleri kategorisi" → Et ürünleri kategorisini görüntüle
- "Genel stok durumu" → Genel envanter durumu

**Gelişmiş Bağlamsal Sorgular:**
1. Önce sor: "Kritik stok analizi göster"
2. Sonra sor: "Hangi ürünü acilen sipariş etmeliyim?"
3. AI önceki kritik stok verilerine dayalı analiz yapacak

**Ürün Arama:**
- "Somon balığı var mı?" → Somon ara
- "STOCK001 detayları" → Ürün detaylarını göster
- "Temizlik malzemeleri" → Temizlik malzemelerini göster

### 🎨 Tema Özellikleri
- **Premium Altın Paleti**: Lüks amber/altın renk teması
- **Glassmorphism**: Modern cam efektli tasarım
- **Responsive**: Tüm cihazlarda mükemmel görünüm
- **Micro-animations**: Framer Motion ile akıcı animasyonlar
- **Accessibility**: Erişilebilirlik standartlarına uygun

### 📊 Dashboard Özellikleri
- **Gerçek Zamanlı İstatistikler**: Anlık stok durumu
- **Risk Analizi**: Kategori çeşitlilik risk değerlendirmesi
- **Kritik Stok Paneli**: Sol panelde kritik ürün listesi
- **Kategori Dağılımı**: Sağ panelde kategori istatistikleri
- **Akıllı Öneriler**: AI destekli stok önerileri

---

## 📋 Environment Variables
```env
OPENAI_API_KEY=your_openai_api_key_here
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/stock-db
```

## 🚀 Advanced Features

### 🧠 AI Conversation Memory
The system maintains conversation context for 5 minutes, allowing for:
- Follow-up questions without re-explaining context
- Contextual analysis based on previous queries
- Smart recommendations based on conversation history

### 📊 Risk Analysis System
- **High Risk**: Categories with <5% of total stock
- **Medium Risk**: Categories with 5-15% of total stock  
- **Safe**: Categories with 15%+ of total stock

### 🎯 Smart Query Processing
- Natural language understanding in Turkish
- Context-aware responses
- Multi-turn conversation support
- Critical stock detection and alerts

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
MIT License - see [LICENSE](LICENSE) file for details.

---

**Built with ❤️ for intelligent inventory management**

*Akıllı envanter yönetimi için ❤️ ile geliştirildi*
