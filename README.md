# FengShuiWithJackson Website

## Modern Zen Luxury Design

A professional feng shui consultation website featuring a Modern Zen Luxury aesthetic with deep emerald green, champagne gold, and cream color palette.

## Features

### Design Philosophy
- **Modern Zen Luxury** aesthetic
- **Color Palette**: Deep Emerald (#0d4d3d) + Champagne Gold (#d4af37) + Cream (#faf8f3)
- **Typography**: Cormorant Garamond (headings) + Inter (body)
- Premium, professional appearance to establish trust

### Key Sections

1. **Navigation**
   - Fixed navbar with smooth scroll
   - Mobile-responsive hamburger menu
   - Clear call-to-action for Free Guide

2. **Hero Section**
   - Compelling headline: "Align Your Space, Attract Your Wealth"
   - Dual CTAs: Book Consultation + Free Checklist
   - Professional imagery placeholder

3. **Problem Section**
   - Three pain points: Feeling Stuck, Money Flowing Out, Restless Energy
   - Creates emotional resonance with target audience

4. **Services Section** (Monetization Pillar A)
   - Three-tier pricing strategy:
     - Quick Scan: $49-$69 (entry level)
     - 2026 Prosperity Blueprint: $199-$299 (most popular)
     - BaZi & Space Strategy: $499+ (premium)

5. **Lead Magnet Section** (Monetization Pillar C)
   - Email capture for "2026 Ultimate Decluttering Checklist"
   - Builds private domain for future marketing

6. **Blog/Affiliate Section** (Monetization Pillar B)
   - Amazon affiliate integration ready
   - Three featured articles with product recommendations
   - "Shop My Favorites" CTA

7. **Social Proof**
   - Auto-rotating testimonials
   - Results-focused client stories

8. **Footer**
   - Amazon Affiliate Disclosure (required)
   - Social media links (Pinterest, TikTok, Instagram)
   - Copyright information

## Technical Features

- **Responsive Design**: Mobile-first approach
- **Smooth Animations**: Fade-in effects, hover states, parallax
- **Performance Optimized**: Clean, semantic HTML
- **SEO Ready**: Proper meta tags and structure
- **Interactive Elements**: 
  - Mobile menu toggle
  - Email form handler
  - Testimonial slider
  - Smooth scroll navigation

## Getting Started

1. Open `index.html` in a web browser
2. For local development server:
   ```bash
   # Using Python
   python3 -m http.server 8000
   
   # Using Node.js
   npx serve
   ```
3. Visit `http://localhost:8000`

## Customization

### Colors
Edit CSS variables in `css/styles.css`:
```css
:root {
    --emerald-deep: #0d4d3d;
    --champagne-gold: #d4af37;
    --cream: #faf8f3;
}
```

### Images
Replace placeholder backgrounds in CSS with actual images:
- Hero image: `.image-placeholder`
- Blog images: `#blog-img-1`, `#blog-img-2`, `#blog-img-3`

### Email Integration
Update the form handler in `js/main.js` to connect with:
- ConvertKit
- Mailchimp
- Your custom backend API

### Amazon Affiliate Links
Add your Amazon Associate tracking ID to product links in the blog section.

## Monetization Strategy

### Three Pillars:
1. **Services** ($49-$499+): Direct consultation revenue
2. **Amazon Affiliate**: Commission from recommended products
3. **Email List**: Long-term relationship building for recurring revenue

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Next Steps

1. **Add Real Images**: Replace CSS gradient placeholders with professional photos
2. **Connect Email Service**: Integrate with ConvertKit/Mailchimp
3. **Set Up Analytics**: Add Google Analytics or similar
4. **Create Blog Posts**: Write detailed feng shui content with affiliate links
5. **Test Conversion**: A/B test CTAs and pricing
6. **SEO Optimization**: Add blog content, meta descriptions, alt tags

## File Structure

```
fengshuiwithjackson/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # All styles and design system
├── js/
│   └── main.js         # Interactive functionality
├── images/             # Image assets (to be added)
└── README.md           # This file
```

## License

© 2025 FengShuiWithJackson. All rights reserved.

---

**Built with Modern Zen Design Principles**
*Align Your Space, Attract Your Wealth*
