# 🏆 StyleHub Hackathon Challenges

Welcome to the StyleHub Hackathon! This document provides detailed descriptions of all available challenges, including requirements, implementation tips, and evaluation criteria.

---

## 📋 Table of Contents

- [Challenge Overview](#-challenge-overview)
- [Beginner Challenges](#-beginner-challenges)
- [Intermediate Challenges](#-intermediate-challenges)
- [Advanced Challenges](#-advanced-challenges)
- [Bonus Challenges](#-bonus-challenges)
- [Evaluation Criteria](#-evaluation-criteria)

---

## 🎯 Challenge Overview

### Difficulty Levels

- 🟢 **Beginner** (⭐⭐☆☆☆) - 1-3 hours
- 🟡 **Intermediate** (⭐⭐⭐☆☆) - 3-4 hours
- 🔴 **Advanced** (⭐⭐⭐⭐☆ to ⭐⭐⭐⭐⭐) - 4-6 hours

### How to Choose

1. **Assess your skills** - Be honest about your current level
2. **Consider time** - How much time can you dedicate?
3. **Check dependencies** - Some challenges require others first
4. **Follow your interest** - Pick what excites you most!

---

## 🟢 Beginner Challenges

### Challenge 1: Product Detail Page

**Difficulty:** ⭐⭐☆☆☆ | **Time:** 2-3 hours | **Points:** 100

#### 📝 Description

Create individual product pages that display detailed information about each product. Users should be able to view product images, read descriptions, select sizes and colors, and see pricing information.

#### ✅ Requirements

**Must Have:**
- Product image display (at least one image)
- Product name and price
- Product description (2-3 paragraphs)
- Size selector (S, M, L, XL)
- Color options (at least 3 colors)
- "Add to Cart" button (can be non-functional for now)
- Breadcrumb navigation (Home > Collections > Product)
- Responsive design

**Nice to Have:**
- Image gallery with multiple views
- Zoom functionality on images
- Stock availability indicator
- Product specifications table
- Related products section
- Share buttons (social media)

#### 🎨 Design Guidelines

```
Layout Structure:
┌─────────────────────────────────────┐
│ Breadcrumb Navigation               │
├──────────────┬──────────────────────┤
│              │  Product Name        │
│   Product    │  ★★★★☆ (4.5) 128    │
│   Image      │  $29.99              │
│   Gallery    │                      │
│              │  Description...      │
│              │                      │
│              │  Size: [S][M][L][XL] │
│              │  Color: ⚫⚪⚫       │
│              │                      │
│              │  [Add to Cart]       │
└──────────────┴──────────────────────┘
│ Related Products                    │
└─────────────────────────────────────┘
```

#### 💻 Implementation Tips

1. **File Structure:**
   ```
   /pages/product-detail.html
   /css/product-detail.css
   /js/product-detail.js
   ```

2. **Sample Product Data:**
   ```javascript
   const product = {
     id: 1,
     name: "Classic White T-Shirt",
     price: 29.99,
     description: "Premium cotton t-shirt...",
     images: [
       "images/products/tshirt-1.jpg",
       "images/products/tshirt-2.jpg"
     ],
     sizes: ["S", "M", "L", "XL"],
     colors: ["white", "black", "gray"],
     rating: 4.5,
     reviews: 128,
     inStock: true
   };
   ```

3. **Key Functions:**
   - `loadProduct(id)` - Load product data
   - `selectSize(size)` - Handle size selection
   - `selectColor(color)` - Handle color selection
   - `updatePrice()` - Update displayed price

#### 🧪 Testing Checklist

- [ ] Product information displays correctly
- [ ] Size selection works and shows visual feedback
- [ ] Color selection works and shows visual feedback
- [ ] Images load properly
- [ ] Responsive on mobile (320px+)
- [ ] Breadcrumb navigation works
- [ ] No console errors

#### 📚 Learning Outcomes

- DOM manipulation
- Event handling
- CSS Grid/Flexbox layouts
- Responsive design
- Data structures

---

### Challenge 8: Dark/Light Mode Toggle

**Difficulty:** ⭐⭐☆☆☆ | **Time:** 1-2 hours | **Points:** 80

#### 📝 Description

Implement a theme switcher that allows users to toggle between dark and light modes. The selected theme should persist across page reloads.

#### ✅ Requirements

**Must Have:**
- Toggle button in header (sun/moon icon)
- Switch between dark and light themes
- Smooth transition between themes
- Persist theme preference (localStorage)
- Update all page elements
- Default to system preference

**Nice to Have:**
- Animated toggle button
- Multiple theme options (dark, light, auto)
- Theme preview before applying
- Keyboard shortcut (Ctrl+Shift+T)

#### 🎨 Design Guidelines

**Light Theme Colors:**
```css
--background: #ffffff;
--surface: #f8fafc;
--text-primary: #0f172a;
--text-secondary: #475569;
```

**Dark Theme Colors:**
```css
--background: #0f172a;
--surface: #1e293b;
--text-primary: #f8fafc;
--text-secondary: #cbd5e1;
```

#### 💻 Implementation Tips

1. **CSS Variables Approach:**
   ```css
   :root {
     --background: #0f172a;
     --text-primary: #f8fafc;
   }
   
   [data-theme="light"] {
     --background: #ffffff;
     --text-primary: #0f172a;
   }
   ```

2. **JavaScript Implementation:**
   ```javascript
   function toggleTheme() {
     const currentTheme = document.documentElement.getAttribute('data-theme');
     const newTheme = currentTheme === 'light' ? 'dark' : 'light';
     
     document.documentElement.setAttribute('data-theme', newTheme);
     localStorage.setItem('theme', newTheme);
   }
   ```

3. **Load Saved Theme:**
   ```javascript
   window.addEventListener('DOMContentLoaded', () => {
     const savedTheme = localStorage.getItem('theme') || 'dark';
     document.documentElement.setAttribute('data-theme', savedTheme);
   });
   ```

#### 🧪 Testing Checklist

- [ ] Toggle button works
- [ ] Theme persists after reload
- [ ] All elements update correctly
- [ ] Smooth transitions
- [ ] No flash of unstyled content
- [ ] Works on all pages

#### 📚 Learning Outcomes

- CSS variables
- LocalStorage API
- Theme management
- User preferences

---

## 🟡 Intermediate Challenges

### Challenge 2: Shopping Cart

**Difficulty:** ⭐⭐⭐☆☆ | **Time:** 3-4 hours | **Points:** 150

#### 📝 Description

Build a fully functional shopping cart system that allows users to add, remove, and update product quantities. The cart should persist data and calculate totals accurately.

#### ✅ Requirements

**Must Have:**
- Cart icon in header with item count badge
- Add items to cart
- Remove items from cart
- Update item quantities
- Calculate subtotal and total
- Persist cart data (localStorage)
- Cart modal or sidebar
- Empty cart state
- Responsive design

**Nice to Have:**
- Apply discount codes
- Shipping cost calculation
- Tax calculation
- Save for later functionality
- Cart item thumbnails
- Quantity limits
- Stock validation

#### 🎨 Design Guidelines

```
Cart Modal/Sidebar:
┌─────────────────────────────────┐
│ Shopping Cart (3)          [X]  │
├─────────────────────────────────┤
│ ┌─────┬─────────────┬─────────┐│
│ │ IMG │ Product 1   │ $29.99  ││
│ │     │ Size: M     │ [-][2][+]│
│ │     │ Color: Blue │ Remove  ││
│ └─────┴─────────────┴─────────┘│
│ ┌─────┬─────────────┬─────────┐│
│ │ IMG │ Product 2   │ $39.99  ││
│ │     │ Size: L     │ [-][1][+]│
│ │     │ Color: Red  │ Remove  ││
│ └─────┴─────────────┴─────────┘│
├─────────────────────────────────┤
│ Subtotal:              $99.97   │
│ Shipping:              $5.00    │
│ Tax:                   $8.40    │
│ ─────────────────────────────── │
│ Total:                 $113.37  │
├─────────────────────────────────┤
│ [Continue Shopping] [Checkout]  │
└─────────────────────────────────┘
```

#### 💻 Implementation Tips

1. **Cart Data Structure:**
   ```javascript
   const cart = [
     {
       id: 1,
       name: "Classic White T-Shirt",
       price: 29.99,
       quantity: 2,
       size: "M",
       color: "white",
       image: "images/products/tshirt-1.jpg"
     }
   ];
   ```

2. **Key Functions:**
   ```javascript
   function addToCart(product, quantity = 1) { }
   function removeFromCart(productId) { }
   function updateQuantity(productId, newQuantity) { }
   function calculateSubtotal() { }
   function calculateTotal() { }
   function saveCart() { }
   function loadCart() { }
   function updateCartUI() { }
   ```

3. **LocalStorage Management:**
   ```javascript
   // Save cart
   localStorage.setItem('cart', JSON.stringify(cart));
   
   // Load cart
   const cart = JSON.parse(localStorage.getItem('cart')) || [];
   ```

#### 🧪 Testing Checklist

- [ ] Can add items to cart
- [ ] Can remove items from cart
- [ ] Can update quantities
- [ ] Cart count updates correctly
- [ ] Calculations are accurate
- [ ] Cart persists after reload
- [ ] Empty cart shows appropriate message
- [ ] Responsive on all devices
- [ ] No duplicate items (same product/size/color)

#### 📚 Learning Outcomes

- State management
- LocalStorage API
- Array manipulation
- Mathematical calculations
- UI updates

---

### Challenge 3: Search & Filter

**Difficulty:** ⭐⭐⭐☆☆ | **Time:** 3-4 hours | **Points:** 150

#### 📝 Description

Implement a comprehensive search and filtering system that allows users to find products by keywords, categories, price ranges, and other criteria.

#### ✅ Requirements

**Must Have:**
- Search bar in header
- Real-time search results
- Filter by category
- Filter by price range
- Sort options (price, popularity, newest)
- Display filtered results
- Clear filters button
- Results count
- No results state

**Nice to Have:**
- Search suggestions/autocomplete
- Filter by color
- Filter by size
- Filter by rating
- Multiple filters simultaneously
- URL parameters for sharing
- Search history

#### 🎨 Design Guidelines

```
Search & Filter Layout:
┌─────────────────────────────────────┐
│ [Search: "t-shirt"        ] [🔍]   │
├─────────────┬───────────────────────┤
│ Filters     │ Results (24)          │
│             │ Sort: [Price ▼]       │
│ Category    │                       │
│ □ Casual    │ ┌─────┬─────┬─────┐  │
│ □ Formal    │ │ P1  │ P2  │ P3  │  │
│ □ Sport     │ └─────┴─────┴─────┘  │
│             │ ┌─────┬─────┬─────┐  │
│ Price       │ │ P4  │ P5  │ P6  │  │
│ $0 ━━━━ $100│ └─────┴─────┴─────┘  │
│             │                       │
│ [Clear All] │ [Load More]           │
└─────────────┴───────────────────────┘
```

#### 💻 Implementation Tips

1. **Sample Product Data:**
   ```javascript
   const products = [
     {
       id: 1,
       name: "Classic White T-Shirt",
       category: "casual",
       price: 29.99,
       rating: 4.5,
       dateAdded: "2026-05-01"
     }
   ];
   ```

2. **Search Function:**
   ```javascript
   function searchProducts(query) {
     return products.filter(product => 
       product.name.toLowerCase().includes(query.toLowerCase()) ||
       product.description.toLowerCase().includes(query.toLowerCase())
     );
   }
   ```

3. **Filter Function:**
   ```javascript
   function filterProducts(filters) {
     return products.filter(product => {
       // Category filter
       if (filters.category && product.category !== filters.category) {
         return false;
       }
       
       // Price filter
       if (product.price < filters.minPrice || product.price > filters.maxPrice) {
         return false;
       }
       
       return true;
     });
   }
   ```

4. **Sort Function:**
   ```javascript
   function sortProducts(products, sortBy) {
     switch(sortBy) {
       case 'price-low':
         return products.sort((a, b) => a.price - b.price);
       case 'price-high':
         return products.sort((a, b) => b.price - a.price);
       case 'rating':
         return products.sort((a, b) => b.rating - a.rating);
       default:
         return products;
     }
   }
   ```

#### 🧪 Testing Checklist

- [ ] Search returns correct results
- [ ] Filters work independently
- [ ] Multiple filters work together
- [ ] Sort options work correctly
- [ ] Clear filters resets everything
- [ ] Results count is accurate
- [ ] No results state displays
- [ ] Performance is good (< 100ms)

#### 📚 Learning Outcomes

- Array methods (filter, sort, map)
- String manipulation
- Event handling
- Performance optimization
- UI state management

---

### Challenge 5: Wishlist Feature

**Difficulty:** ⭐⭐⭐☆☆ | **Time:** 2-3 hours | **Points:** 120

#### 📝 Description

Allow users to save their favorite products to a wishlist for later viewing and purchasing.

#### ✅ Requirements

**Must Have:**
- Heart icon on product cards
- Add/remove from wishlist
- Wishlist page showing saved items
- Persist wishlist data
- Wishlist count in header
- Empty wishlist state
- Move to cart functionality

**Nice to Have:**
- Share wishlist via link
- Wishlist categories
- Price drop notifications
- Back in stock alerts
- Multiple wishlists

#### 💻 Implementation Tips

1. **Wishlist Data Structure:**
   ```javascript
   const wishlist = [
     {
       id: 1,
       productId: 1,
       dateAdded: "2026-05-28",
       notes: "For summer vacation"
     }
   ];
   ```

2. **Key Functions:**
   ```javascript
   function addToWishlist(productId) { }
   function removeFromWishlist(productId) { }
   function isInWishlist(productId) { }
   function getWishlistItems() { }
   function moveToCart(productId) { }
   ```

#### 🧪 Testing Checklist

- [ ] Can add items to wishlist
- [ ] Can remove items from wishlist
- [ ] Heart icon updates correctly
- [ ] Wishlist persists after reload
- [ ] Wishlist page displays correctly
- [ ] Can move items to cart
- [ ] Empty state shows

#### 📚 Learning Outcomes

- Data persistence
- UI state management
- Icon animations
- Page routing

---

## 🔴 Advanced Challenges

### Challenge 4: User Authentication

**Difficulty:** ⭐⭐⭐⭐☆ | **Time:** 4-5 hours | **Points:** 200

#### 📝 Description

Implement a complete user authentication system with registration, login, and profile management.

#### ✅ Requirements

**Must Have:**
- Login modal/page
- Registration form
- Form validation
- User profile page
- Session management
- Logout functionality
- Protected routes
- Password requirements

**Nice to Have:**
- Social login (Google, Facebook)
- Password reset
- Email verification
- Two-factor authentication
- Profile picture upload
- Account settings

#### 🎨 Design Guidelines

```
Login Modal:
┌─────────────────────────────┐
│ Welcome Back!          [X]  │
├─────────────────────────────┤
│ Email:                      │
│ [________________]          │
│                             │
│ Password:                   │
│ [________________] [👁]     │
│                             │
│ □ Remember me               │
│ Forgot password?            │
│                             │
│ [Login]                     │
│                             │
│ Don't have an account?      │
│ Sign up                     │
└─────────────────────────────┘
```

#### 💻 Implementation Tips

1. **User Data Structure:**
   ```javascript
   const user = {
     id: 1,
     email: "user@example.com",
     name: "John Doe",
     password: "hashed_password", // Never store plain text!
     createdAt: "2026-05-28",
     lastLogin: "2026-05-28"
   };
   ```

2. **Validation:**
   ```javascript
   function validateEmail(email) {
     const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     return re.test(email);
   }
   
   function validatePassword(password) {
     // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
     return password.length >= 8 &&
            /[A-Z]/.test(password) &&
            /[a-z]/.test(password) &&
            /[0-9]/.test(password);
   }
   ```

3. **Session Management:**
   ```javascript
   function login(email, password) {
     // Validate credentials
     // Create session
     sessionStorage.setItem('user', JSON.stringify(user));
     sessionStorage.setItem('token', generateToken());
   }
   
   function isLoggedIn() {
     return sessionStorage.getItem('token') !== null;
   }
   ```

#### 🧪 Testing Checklist

- [ ] Registration works
- [ ] Login works
- [ ] Validation prevents invalid data
- [ ] Session persists
- [ ] Logout clears session
- [ ] Protected routes work
- [ ] Error messages display
- [ ] Password visibility toggle works

#### 📚 Learning Outcomes

- Form validation
- Session management
- Security basics
- Error handling
- User experience

---

### Challenge 6: Product Reviews

**Difficulty:** ⭐⭐⭐⭐☆ | **Time:** 4-5 hours | **Points:** 200

#### 📝 Description

Create a comprehensive review system where users can rate products and write reviews.

#### ✅ Requirements

**Must Have:**
- Star rating display
- Review submission form
- Review list with pagination
- Average rating calculation
- Sort reviews (helpful, recent)
- Review count
- User authentication required
- Helpful/not helpful voting

**Nice to Have:**
- Image uploads in reviews
- Verified purchase badge
- Review moderation
- Filter by rating
- Review responses
- Report inappropriate reviews

#### 💻 Implementation Tips

1. **Review Data Structure:**
   ```javascript
   const review = {
     id: 1,
     productId: 1,
     userId: 1,
     userName: "John Doe",
     rating: 5,
     title: "Great product!",
     comment: "Really love this...",
     helpful: 12,
     notHelpful: 2,
     verified: true,
     createdAt: "2026-05-28"
   };
   ```

2. **Rating Calculation:**
   ```javascript
   function calculateAverageRating(reviews) {
     const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
     return (sum / reviews.length).toFixed(1);
   }
   ```

#### 🧪 Testing Checklist

- [ ] Can submit reviews
- [ ] Star rating works
- [ ] Reviews display correctly
- [ ] Pagination works
- [ ] Sorting works
- [ ] Voting works
- [ ] Average rating updates

#### 📚 Learning Outcomes

- CRUD operations
- Pagination
- Sorting algorithms
- User interactions
- Data aggregation

---

### Challenge 7: Checkout Flow

**Difficulty:** ⭐⭐⭐⭐⭐ | **Time:** 5-6 hours | **Points:** 250

#### 📝 Description

Create a complete multi-step checkout process from cart to order confirmation.

#### ✅ Requirements

**Must Have:**
- Multi-step form (3-4 steps)
- Shipping information
- Payment method selection
- Order summary
- Form validation
- Progress indicator
- Order confirmation page
- Order number generation

**Nice to Have:**
- Address autocomplete
- Multiple shipping options
- Gift options
- Order tracking
- Email confirmation
- Print receipt

#### 🎨 Design Guidelines

```
Checkout Steps:
Step 1: Shipping → Step 2: Payment → Step 3: Review → Step 4: Confirmation

Step 1 - Shipping:
┌─────────────────────────────────┐
│ ●━━━○━━━○━━━○                  │
│ Shipping  Payment  Review  Done │
├─────────────────────────────────┤
│ Shipping Address                │
│ Full Name: [______________]     │
│ Address: [________________]     │
│ City: [_______] State: [___]    │
│ ZIP: [_____] Country: [____]    │
│                                 │
│ [Back to Cart] [Continue]       │
└─────────────────────────────────┘
```

#### 💻 Implementation Tips

1. **Order Data Structure:**
   ```javascript
   const order = {
     orderNumber: "ORD-2026-001",
     userId: 1,
     items: [...],
     shipping: {
       name: "John Doe",
       address: "123 Main St",
       city: "New York",
       state: "NY",
       zip: "10001",
       country: "USA"
     },
     payment: {
       method: "credit_card",
       last4: "4242"
     },
     subtotal: 99.97,
     shipping: 5.00,
     tax: 8.40,
     total: 113.37,
     status: "pending",
     createdAt: "2026-05-28"
   };
   ```

2. **Step Navigation:**
   ```javascript
   let currentStep = 1;
   
   function nextStep() {
     if (validateCurrentStep()) {
       currentStep++;
       updateUI();
     }
   }
   
   function previousStep() {
     currentStep--;
     updateUI();
   }
   ```

#### 🧪 Testing Checklist

- [ ] All steps work
- [ ] Validation prevents invalid data
- [ ] Can go back and forth
- [ ] Order summary is accurate
- [ ] Order number generates
- [ ] Confirmation page displays
- [ ] Data persists between steps

#### 📚 Learning Outcomes

- Multi-step forms
- Complex validation
- State management
- UX design
- Data persistence

---

## 🎁 Bonus Challenges

### Bonus 1: Animations & Micro-interactions
Add delightful animations throughout the app.

### Bonus 2: Accessibility Enhancements
Make the app fully accessible (WCAG 2.1 AA).

### Bonus 3: Performance Optimization
Optimize for speed and efficiency.

### Bonus 4: PWA Features
Add offline support and install prompt.

### Bonus 5: Internationalization
Support multiple languages.

---

## 📊 Evaluation Criteria

### Functionality (40%)
- Feature works as expected
- No critical bugs
- Edge cases handled
- Error handling

### Code Quality (25%)
- Clean, readable code
- Proper naming
- Comments where needed
- DRY principles
- No console errors

### Design & UX (20%)
- Matches existing design
- Responsive
- Smooth interactions
- Accessibility
- Loading states

### Creativity (15%)
- Unique implementations
- Additional features
- Innovative solutions
- Attention to detail

---

## 🏆 Scoring

- **Beginner:** 80-100 points
- **Intermediate:** 120-150 points
- **Advanced:** 200-250 points
- **Bonus:** 10-50 points each

**Total Possible:** 1000+ points

---

## 🎉 Good Luck!

Remember:
- Start small and iterate
- Test frequently
- Ask for help when stuck
- Have fun and learn!

**Happy Coding! 🚀**