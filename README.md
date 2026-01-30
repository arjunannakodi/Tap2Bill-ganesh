# 🕉️ Sri Ganesh Stationery - Billing System

## 📋 Overview

A **simple, fast, and powerful** PC-based billing system designed specifically for wholesale stationery shops. Built with a focus on ease-of-use for non-technical users.

### ✨ Key Features

- ✅ **Number-Based Billing** - Each product mapped to a number (1-50)
- ✅ **Keyboard Support** - Type numbers to add products instantly
- ✅ **Search Functionality** - Find products by name
- ✅ **Auto Calculation** - Real-time total calculation
- ✅ **Product Management** - Easy add/edit/delete products
- ✅ **Print Bills** - Professional printable invoices
- ✅ **Bill History** - View past bills anytime
- ✅ **Offline Capable** - Works without internet
- ✅ **Local Storage** - All data saved on your PC
- ✅ **Large UI** - Big buttons and text for easy use

---

## 🚀 How to Start

### Method 1: Double-Click (Easiest)
1. Double-click `START_APP.bat`
2. Browser will open automatically at `http://localhost:8000`
3. Start billing!

### Method 2: Manual
1. Open Command Prompt in this folder
2. Run: `python -m http.server 8000`
3. Open browser and go to: `http://localhost:8000`

---

## 📖 User Guide

### 🔢 Adding Products to Bill

**Method 1: Click Number Buttons**
- Click any numbered button (1-50) to add that product
- Click again to increase quantity

**Method 2: Keyboard Numbers**
- Type product number on keyboard
- Product automatically added after 0.5 seconds
- Example: Type `1` → Pencil added
- Example: Type `15` → Product #15 added

**Method 3: Search**
- Type product name in search box
- Click product from results
- Product added to bill

### 📦 Managing Products

1. Click **"Manage Products"** button
2. Fill in the form:
   - **Product Number**: 1-999 (unique)
   - **Product Name**: e.g., "Sketch Pen"
   - **Price**: in ₹ (Rupees)
   - **Unit**: piece/box/packet/pack/dozen/ream
3. Click **"Add Product"**
4. Product appears in grid immediately

**Edit Product:**
- Click "Edit" button in product table
- Update name, price, or unit

**Delete Product:**
- Click "Delete" button
- Confirm deletion

### 🧾 Generating Bills

1. Add items to current bill
2. Adjust quantities using + and - buttons
3. Click **"Generate Bill"**
4. Bill preview appears
5. Options:
   - **Print Bill** - Print directly
   - **Save as PDF** - Save for records
   - **New Bill** - Start fresh

### ⚙️ Settings

Click **"Settings"** to configure:
- Shop Name
- Address
- Phone Number
- GST Number (optional)

These details appear on printed bills.

### 📜 Bill History

- Click **"Bill History"** to view past bills
- Click **"View"** to see bill details
- Last 100 bills saved automatically

---

## 🎯 Quick Tips

### Keyboard Shortcuts
- **Number Keys (0-9)**: Add products
- **Enter**: Generate bill (when items in cart)
- **Escape**: Close modals/clear search

### Best Practices
1. **Set up products first** - Add all your inventory
2. **Use logical numbering** - Group similar items (1-10 pens, 11-20 notebooks)
3. **Regular backups** - Export data periodically
4. **Clear old bills** - Keep history manageable

---

## 💾 Data Storage

All data stored locally in browser's localStorage:
- **Products**: Your inventory
- **Bill History**: Last 100 bills
- **Settings**: Shop information

**Location**: Browser's local storage (not visible as files)

**Backup**: Use browser's export feature or copy localStorage data

---

## 🎨 Features Breakdown

### For Shop Owner (Your Father)
- ✅ Large, clear buttons
- ✅ Minimal text
- ✅ Simple workflow
- ✅ No complex menus
- ✅ Works with mouse OR keyboard
- ✅ Auto-saves everything

### Technical Features
- ✅ Responsive design
- ✅ Offline-first architecture
- ✅ Local data persistence
- ✅ Print-optimized bills
- ✅ Fast performance
- ✅ No external dependencies

---

## 🔮 Future Enhancements (Ready to Add)

The system is built to easily support:
- [ ] GST calculation
- [ ] Customer name on bills
- [ ] Daily sales reports
- [ ] Data export (CSV/Excel)
- [ ] Barcode scanner support
- [ ] Multiple users/cashiers
- [ ] Inventory tracking
- [ ] Low stock alerts

---

## 🛠️ Technical Details

### Technology Stack
- **HTML5** - Structure
- **CSS3** - Modern styling with animations
- **Vanilla JavaScript** - No frameworks needed
- **LocalStorage API** - Data persistence

### Browser Compatibility
- ✅ Chrome (Recommended)
- ✅ Edge
- ✅ Firefox
- ✅ Safari

### System Requirements
- Windows 7 or higher
- Any modern browser
- Python (for local server)
- No internet required after setup

---

## 📞 Support & Customization

### Common Issues

**Q: Products not showing?**
A: Check if products are added in "Manage Products"

**Q: Bill not printing?**
A: Ensure printer is connected and selected

**Q: Data lost after closing?**
A: Data is saved automatically. Check browser settings allow localStorage.

**Q: Can't type numbers?**
A: Make sure you're not in an input field. Click outside search box first.

### Customization

Want to customize? Edit these files:
- `styles.css` - Colors, fonts, layout
- `app.js` - Functionality, features
- `index.html` - Structure, text

---

## 📄 License

Free to use for Sri Ganesh Stationery.

---

## 🙏 Credits

Built with ❤️ for efficient wholesale billing.

**May Lord Ganesh bless your business with prosperity! 🕉️**

---

## 📸 Screenshots

### Main Billing Screen
- Left: Product grid (1-50)
- Right: Current bill with items
- Top: Search bar and management buttons

### Bill Preview
- Professional format
- Shop details
- Item-wise breakdown
- Grand total
- Print-ready

---

**Version**: 1.0  
**Last Updated**: January 2026  
**Status**: Production Ready ✅
