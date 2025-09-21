# WHAZUP - Event Discovery App

A modern, Tinder-style event discovery application that helps users find personalized events in New Zealand using the Eventfinda API. Users swipe through curated questions to discover their event preferences and receive tailored recommendations.

## Screenshots
![](https://github.com/applescan/whazup/blob/main/public/whazup.png)
![](https://github.com/applescan/whazup/blob/main/public/whazup-2.png)

## Features

### 🎯 **Smart Event Discovery**
- Tinder-style swipe interface for preference matching
- 180+ carefully crafted questions across 8 event categories
- Personalized event recommendations based on user interests
- Location-based event filtering

### 🎨 **Modern UI/UX**
- Glassmorphism design with animated backgrounds
- Responsive design optimized for mobile and desktop
- Smooth animations and micro-interactions
- Contemporary gradient color schemes

### 🗺️ **Location Integration**
- Comprehensive New Zealand location support
- Regional grouping and organization
- Real-time event count display
- Automatic location detection and suggestions

### 📱 **Mobile-First Experience**
- Touch-friendly swipe gestures
- Optimized for various screen sizes
- Progressive web app capabilities
- Smooth performance across devices

## Tech Stack

### **Frontend**
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library for smooth interactions
- **Lucide React** - Modern icon library

### **Backend & APIs**
- **Eventfinda API** - Event data and location services
- **Next.js API Routes** - Backend API endpoints
- **Server-side rendering** - Optimized performance and SEO

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn package manager
- Eventfinda API credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd event-discovery-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment setup**
   Create a `.env.local` file in the root directory:
   ```env
   EVENTFINDA_USERNAME=your_api_username
   EVENTFINDA_PASSWORD=your_api_password
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## API Integration

### **Eventfinda API Endpoints**
- `/api/locations` - Fetch available locations
- `/api/categories` - Get event categories
- `/api/events` - Retrieve events with filtering

### **Key Features**
- Comprehensive error handling and fallbacks
- Response caching and optimization
- HTML entity decoding for clean text display
- Image processing and fallback handling

## Event Categories

The app covers 8 major event categories:

1. **🎤 Concerts & Gig Guide** - Live music and performances
2. **🎭 Performing Arts** - Theatre, dance, and cultural performances
3. **🎟️ Theatre** - Plays, musicals, and dramatic performances
4. **🏃‍♂️ Sports & Outdoors** - Sporting events and outdoor activities
5. **🎉 Festivals & Lifestyle** - Festivals, markets, and lifestyle events
6. **💃 Dance** - Dance performances and classes
7. **🖼️ Exhibitions** - Art galleries, museums, and exhibitions
8. **📚 Workshops & Classes** - Educational and skill-building events

## User Flow

1. **Welcome Screen** - User selects their location from New Zealand regions
2. **Swipe Interface** - User swipes through 25-30 personalized questions
3. **Matching Algorithm** - App analyzes preferences and finds suitable event categories
4. **Results Screen** - Celebratory match confirmation
5. **Recommendations** - Curated list of events matching user preferences
6. **Event Details** - Detailed view with booking links to Eventfinda


## Performance Optimizations

- Server-side rendering for fast initial loads
- Image optimization and lazy loading
- API response caching
- Minimal bundle size with tree shaking
- Progressive enhancement for mobile

### **Environment Variables for Production**
Ensure these are set in your deployment environment:
```env
EVENTFINDA_USERNAME=your_production_username
EVENTFINDA_PASSWORD=your_production_password
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **Eventfinda** for providing comprehensive event data API
- **New Zealand event community** for inspiration and feedback
- **Open source contributors** for the excellent libraries used

## Author

**Felicia Fel**
- Portfolio: [https://felicia-portfolio.netlify.app/](https://felicia-portfolio.netlify.app/)
---

*Built with passion for connecting people with amazing experiences* 😶‍🌫️🥚
