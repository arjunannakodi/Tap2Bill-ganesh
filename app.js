// ============================================
// DATABASE & STATE MANAGEMENT
// ============================================

class BillingSystem {
    constructor() {
        this.products = this.loadProducts();
        this.currentBill = [];
        this.billHistory = this.loadBillHistory();
        this.settings = this.loadSettings();
        this.init();
    }

    // ============================================
    // INITIALIZATION
    // ============================================
    init() {
        this.renderProductGrid();
        this.setupEventListeners();
        this.setupKeyboardShortcuts();
        this.updateBillDisplay();

        // Initialize with sample products if empty
        if (this.products.length === 0) {
            this.initializeSampleProducts();
        }
    }

    initializeSampleProducts() {
        const sampleProducts = [
            { number: 1, name: 'Pencil', price: 5, unit: 'piece', category: 'Writing' },
            { number: 2, name: 'Eraser', price: 3, unit: 'piece', category: 'Writing' },
            { number: 3, name: 'Notebook', price: 40, unit: 'piece', category: 'Books' },
            { number: 4, name: 'Pen (Blue)', price: 10, unit: 'piece', category: 'Writing' },
            { number: 5, name: 'A4 Paper Pack', price: 250, unit: 'pack', category: 'Paper' },
            { number: 6, name: 'Sketch Pen Set', price: 120, unit: 'box', category: 'Art' },
            { number: 7, name: 'Ruler 30cm', price: 15, unit: 'piece', category: 'Geometry' },
            { number: 8, name: 'Geometry Box', price: 80, unit: 'box', category: 'Geometry' },
            { number: 9, name: 'Stapler', price: 150, unit: 'piece', category: 'Office' },
            { number: 10, name: 'Staple Pins', price: 20, unit: 'box', category: 'Office' },
        ];

        sampleProducts.forEach(product => {
            this.products.push(product);
        });
        this.saveProducts();
        this.renderProductsTable();
    }

    // ============================================
    // LOCAL STORAGE
    // ============================================
    loadProducts() {
        const stored = localStorage.getItem('products');
        return stored ? JSON.parse(stored) : [];
    }

    saveProducts() {
        localStorage.setItem('products', JSON.stringify(this.products));
    }

    loadBillHistory() {
        const stored = localStorage.getItem('billHistory');
        return stored ? JSON.parse(stored) : [];
    }

    saveBillHistory() {
        localStorage.setItem('billHistory', JSON.stringify(this.billHistory));
    }

    loadSettings() {
        const stored = localStorage.getItem('settings');
        return stored ? JSON.parse(stored) : {
            shopName: 'Sri Ganesh Stationery',
            address: '',
            phone: '',
            gst: ''
        };
    }

    saveSettings() {
        localStorage.setItem('settings', JSON.stringify(this.settings));
    }

    // ============================================
    // EVENT LISTENERS
    // ============================================
    setupEventListeners() {
        // Product Management
        document.getElementById('manageProductsBtn').addEventListener('click', () => this.openProductModal());
        document.getElementById('closeProductModal').addEventListener('click', () => this.closeProductModal());
        document.getElementById('addProductForm').addEventListener('submit', (e) => this.addProduct(e));

        // Settings
        document.getElementById('settingsBtn').addEventListener('click', () => this.openSettingsModal());
        document.getElementById('closeSettingsModal').addEventListener('click', () => this.closeSettingsModal());
        document.getElementById('settingsForm').addEventListener('submit', (e) => this.saveSettingsForm(e));

        // History
        document.getElementById('viewHistoryBtn').addEventListener('click', () => this.openHistoryModal());
        document.getElementById('closeHistoryModal').addEventListener('click', () => this.closeHistoryModal());

        // Bill Actions
        document.getElementById('clearBillBtn').addEventListener('click', () => this.clearBill());
        document.getElementById('generateBillBtn').addEventListener('click', () => this.generateBill());

        // Bill Modal
        document.getElementById('closeBillModal').addEventListener('click', () => this.closeBillModal());
        document.getElementById('printBillBtn').addEventListener('click', () => this.printBill());
        document.getElementById('savePdfBtn').addEventListener('click', () => this.savePdf());
        document.getElementById('newBillBtn').addEventListener('click', () => this.newBill());

        // Search
        const searchInput = document.getElementById('productSearch');
        searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));

        // Close modals on background click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Number keys 0-9 for quick product selection
            if (e.key >= '0' && e.key <= '9' && !e.target.matches('input, textarea, select')) {
                e.preventDefault();
                this.handleNumberKey(e.key);
            }

            // Enter to generate bill
            if (e.key === 'Enter' && !e.target.matches('input, textarea, select')) {
                if (this.currentBill.length > 0) {
                    this.generateBill();
                }
            }

            // Escape to close modals
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal.active').forEach(modal => {
                    modal.classList.remove('active');
                });
            }
        });
    }

    updateStats() {
        // Calculate today's sales from bill history
        const today = new Date().toLocaleDateString('en-IN');
        const todaysBills = this.billHistory.filter(bill => {
            const billDate = new Date(bill.date).toLocaleDateString('en-IN');
            return billDate === today;
        });

        const todaysSales = todaysBills.reduce((sum, bill) => sum + bill.total, 0);
        const billsCreated = todaysBills.length;
        const avgBillValue = billsCreated > 0 ? todaysSales / billsCreated : 0;

        // Update UI
        const todaySalesEl = document.getElementById('todaySales');
        const billsCreatedEl = document.getElementById('billsCreated');
        const avgBillValueEl = document.getElementById('avgBillValue');

        if (todaySalesEl) todaySalesEl.textContent = todaysSales.toFixed(0);
        if (billsCreatedEl) billsCreatedEl.textContent = billsCreated;
        if (avgBillValueEl) avgBillValueEl.textContent = avgBillValue.toFixed(0);
    }

    handleNumberKey(key) {
        // Build multi-digit number
        if (!this.numberBuffer) this.numberBuffer = '';
        if (!this.numberTimeout) {
            this.numberBuffer = key;
        } else {
            clearTimeout(this.numberTimeout);
            this.numberBuffer += key;
        }

        // Wait 500ms for more digits
        this.numberTimeout = setTimeout(() => {
            const productNumber = parseInt(this.numberBuffer);
            const product = this.products.find(p => p.number === productNumber);
            if (product) {
                this.addToBill(product);
            }
            this.numberBuffer = '';
            this.numberTimeout = null;
        }, 500);
    }

    // ============================================
    // PRODUCT GRID
    // ============================================
    renderProductGrid() {
        const grid = document.getElementById('productGrid');

        if (this.products.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--gray-400);">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">📦</div>
                    <p style="font-size: 1.25rem; margin-bottom: 0.5rem;">No products added yet</p>
                    <p>Click "Products" button to add your inventory</p>
                </div>
            `;
            return;
        }

        // Show empty state - products only appear when searched
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--gray-400);">
                <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
                <p style="font-size: 1.25rem; margin-bottom: 0.5rem;">Search for products</p>
                <p>Type product number or name in the search box above</p>
            </div>
        `;
    }

    handleSearch(query) {
        const grid = document.getElementById('productGrid');

        if (!query.trim()) {
            // Show empty state when search is cleared
            grid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--gray-400);">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
                    <p style="font-size: 1.25rem; margin-bottom: 0.5rem;">Search for products</p>
                    <p>Type product number or name in the search box above</p>
                </div>
            `;
            return;
        }

        const results = this.products.filter(p =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.number.toString().includes(query)
        );

        if (results.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--gray-400);">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
                    <p>No products found matching "${query}"</p>
                </div>
            `;
            return;
        }

        // Show matching products
        grid.innerHTML = results.map(product => `
            <button class="product-card" onclick="billingSystem.addToBill(billingSystem.products.find(p => p.number === ${product.number}))">
                <div class="product-number">${product.number}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-price">₹${product.price.toFixed(2)}</div>
            </button>
        `).join('');
    }




    // ============================================
    // BILL MANAGEMENT
    // ============================================
    addToBill(product) {
        const existingItem = this.currentBill.find(item => item.product.number === product.number);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.currentBill.push({
                product: product,
                quantity: 1
            });
        }

        this.updateBillDisplay();
    }

    updateBillDisplay() {
        const billItemsContainer = document.getElementById('billItems');
        const generateBtn = document.getElementById('generateBillBtn');

        if (this.currentBill.length === 0) {
            billItemsContainer.innerHTML = `
                <div class="empty-bill">
                    <div class="empty-icon">🛒</div>
                    <p>No items added</p>
                    <small>Click products to add</small>
                </div>
            `;
            generateBtn.disabled = true;
            document.getElementById('totalItems').textContent = '0';
            document.getElementById('subtotal').textContent = '0.00';
            document.getElementById('taxAmount').textContent = '0.00';
            document.getElementById('grandTotal').textContent = '0.00';
            return;
        }

        generateBtn.disabled = false;

        billItemsContainer.innerHTML = this.currentBill.map((item, index) => {
            const itemTotal = item.product.price * item.quantity;
            return `
                <div class="bill-item">
                    <div class="bill-item-info">
                        <div class="bill-item-name">${item.product.name}</div>
                        <div class="bill-item-details">₹${item.product.price} × ${item.quantity} ${item.product.unit}</div>
                    </div>
                    <div class="bill-item-controls">
                        <button class="qty-btn" onclick="billingSystem.decreaseQuantity(${index})">−</button>
                        <div class="qty-display">${item.quantity}</div>
                        <button class="qty-btn" onclick="billingSystem.increaseQuantity(${index})">+</button>
                    </div>
                    <div class="bill-item-total">₹${itemTotal.toFixed(2)}</div>
                    <button class="remove-btn" onclick="billingSystem.removeItem(${index})">×</button>
                </div>
            `;
        }).join('');

        // Calculate totals (NO GST)
        const totalItems = this.currentBill.reduce((sum, item) => sum + item.quantity, 0);
        const subtotal = this.currentBill.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        const grandTotal = subtotal; // No tax added

        document.getElementById('totalItems').textContent = totalItems;
        document.getElementById('subtotal').textContent = subtotal.toFixed(2);
        document.getElementById('taxAmount').textContent = '0.00';
        document.getElementById('grandTotal').textContent = grandTotal.toFixed(2);
    }

    increaseQuantity(index) {
        this.currentBill[index].quantity++;
        this.updateBillDisplay();
    }

    decreaseQuantity(index) {
        if (this.currentBill[index].quantity > 1) {
            this.currentBill[index].quantity--;
            this.updateBillDisplay();
        }
    }

    removeItem(index) {
        this.currentBill.splice(index, 1);
        this.updateBillDisplay();
    }

    clearBill() {
        if (this.currentBill.length === 0) return;

        if (confirm('Are you sure you want to clear all items?')) {
            this.currentBill = [];
            this.updateBillDisplay();
        }
    }

    // ============================================
    // BILL GENERATION
    // ============================================
    generateBill() {
        if (this.currentBill.length === 0) return;

        const billData = {
            id: Date.now(),
            date: new Date().toLocaleString('en-IN'),
            items: this.currentBill.map(item => ({ ...item })),
            total: this.currentBill.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
        };

        // Save to history
        this.billHistory.unshift(billData);
        if (this.billHistory.length > 100) {
            this.billHistory = this.billHistory.slice(0, 100);
        }
        this.saveBillHistory();

        // Show bill preview
        this.showBillPreview(billData);
    }

    showBillPreview(billData) {
        const preview = document.getElementById('billPreview');

        preview.innerHTML = `
            <div style="max-width: 210mm; margin: 0 auto; padding: 10mm; background: white; font-family: 'Courier New', monospace; font-size: 12px;">
                <!-- Header with Shop Details -->
                <div style="text-align: center; margin-bottom: 8px; border-bottom: 2px solid #000; padding-bottom: 8px;">
                    <h1 style="font-size: 18px; font-weight: bold; color: #000; margin: 0 0 4px 0; font-family: Arial, sans-serif;">
                        ${this.settings.shopName}
                    </h1>
                    ${this.settings.address ? `<p style="color: #000; margin: 2px 0; font-size: 11px;">${this.settings.address}</p>` : ''}
                    ${this.settings.phone ? `<p style="color: #000; margin: 2px 0; font-size: 11px;">Phone: ${this.settings.phone}</p>` : ''}
                    ${this.settings.gst ? `<p style="color: #000; margin: 2px 0; font-size: 11px;">GST: ${this.settings.gst}</p>` : ''}
                </div>
                
                <!-- Bill No and Date -->
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 11px;">
                    <div style="color: #000;">
                        <strong>Bill No:</strong> ${billData.id}
                    </div>
                    <div style="color: #000;">
                        <strong>Date:</strong> ${billData.date}
                    </div>
                </div>
                
                <!-- Items Table -->
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; border: 2px solid #000; font-size: 11px;">
                    <thead>
                        <tr style="background: #fff; border: 2px solid #000;">
                            <th style="padding: 6px; text-align: left; font-weight: bold; border: 2px solid #000; color: #000; width: 50px;">Code</th>
                            <th style="padding: 6px; text-align: left; font-weight: bold; border: 2px solid #000; color: #000;">Product</th>
                            <th style="padding: 6px; text-align: center; font-weight: bold; border: 2px solid #000; width: 50px; color: #000;">Qty</th>
                            <th style="padding: 6px; text-align: right; font-weight: bold; border: 2px solid #000; width: 80px; color: #000;">Price</th>
                            <th style="padding: 6px; text-align: right; font-weight: bold; border: 2px solid #000; width: 80px; color: #000;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${billData.items.map((item, index) => `
                            <tr style="background: white;">
                                <td style="padding: 6px; text-align: left; border: 2px solid #000; color: #000;">
                                    ${index + 1}
                                </td>
                                <td style="padding: 6px; border: 2px solid #000; color: #000;">
                                    ${item.product.name}
                                </td>
                                <td style="padding: 6px; text-align: center; border: 2px solid #000; color: #000;">
                                    ${item.quantity}
                                </td>
                                <td style="padding: 6px; text-align: right; border: 2px solid #000; color: #000;">
                                    ₹${item.product.price.toFixed(2)}
                                </td>
                                <td style="padding: 6px; text-align: right; border: 2px solid #000; color: #000;">
                                    ₹${(item.product.price * item.quantity).toFixed(2)}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                
                <!-- Grand Total -->
                <div style="text-align: center; margin: 15px 0; font-size: 14px;">
                    <p style="font-weight: bold; color: #000; margin: 0;">
                        Grand Total: ₹${billData.total.toFixed(2)}
                    </p>
                </div>
                
                <!-- Footer -->
                <div style="margin-top: 15px; padding-top: 8px; border-top: 1px dashed #000; text-align: center; font-size: 11px;">
                    <p style="color: #000; margin: 3px 0;">
                        Thank you for your business!
                    </p>
                    <p style="color: #000; margin: 3px 0;">
                        Visit again!
                    </p>
                </div>
            </div>
        `;

        document.getElementById('billModal').classList.add('active');
    }

    printBill() {
        window.print();
    }

    savePdf() {
        alert('To save as PDF:\n1. Click Print Bill\n2. Select "Save as PDF" as printer\n3. Click Save');
        this.printBill();
    }

    newBill() {
        this.currentBill = [];
        this.updateBillDisplay();
        this.closeBillModal();
    }

    // ============================================
    // PRODUCT MANAGEMENT
    // ============================================
    openProductModal() {
        this.renderProductTable();
        document.getElementById('productModal').classList.add('active');
    }

    closeProductModal() {
        document.getElementById('productModal').classList.remove('active');
        document.getElementById('addProductForm').reset();
    }

    addProduct(e) {
        e.preventDefault();

        const number = parseInt(document.getElementById('productNumber').value);
        const name = document.getElementById('productName').value.trim();
        const price = parseFloat(document.getElementById('productPrice').value);
        const unit = document.getElementById('productUnit').value;

        // Validate
        if (number < 1) {
            alert('Product number must be at least 1');
            return;
        }

        if (this.products.find(p => p.number === number)) {
            alert('Product number already exists!');
            return;
        }

        // Add product
        this.products.push({ number, name, price, unit });
        this.products.sort((a, b) => a.number - b.number);
        this.saveProducts();

        // Update UI
        this.renderProductGrid();
        this.renderProductTable();
        document.getElementById('addProductForm').reset();

        alert('Product added successfully!');
    }

    renderProductTable() {
        const tbody = document.getElementById('productTableBody');

        if (this.products.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--gray-400);">No products added yet</td></tr>';
            return;
        }

        tbody.innerHTML = this.products.map(product => `
            <tr>
                <td><strong>${product.number}</strong></td>
                <td>${product.name}</td>
                <td>₹${product.price.toFixed(2)}</td>
                <td>${product.unit}</td>
                <td class="table-actions">
                    <button class="btn btn-secondary btn-small" onclick="billingSystem.editProduct(${product.number})">Edit</button>
                    <button class="btn btn-danger-outline btn-small" onclick="billingSystem.deleteProduct(${product.number})">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    editProduct(number) {
        const product = this.products.find(p => p.number === number);
        if (!product) return;

        const newName = prompt('Enter new name:', product.name);
        if (newName === null) return;

        const newPrice = prompt('Enter new price:', product.price);
        if (newPrice === null) return;

        const newUnit = prompt('Enter new unit (piece/box/packet):', product.unit);
        if (newUnit === null) return;

        product.name = newName.trim();
        product.price = parseFloat(newPrice);
        product.unit = newUnit.trim();

        this.saveProducts();
        this.renderProductsTable();
        this.renderProductTable();
    }

    deleteProduct(number) {
        if (!confirm('Are you sure you want to delete this product?')) return;

        this.products = this.products.filter(p => p.number !== number);
        this.saveProducts();
        this.renderProductsTable();
        this.renderProductTable();
    }

    // ============================================
    // SETTINGS
    // ============================================
    openSettingsModal() {
        document.getElementById('shopName').value = this.settings.shopName;
        document.getElementById('shopAddress').value = this.settings.address;
        document.getElementById('shopPhone').value = this.settings.phone;
        document.getElementById('shopGST').value = this.settings.gst;
        document.getElementById('settingsModal').classList.add('active');
    }

    closeSettingsModal() {
        document.getElementById('settingsModal').classList.remove('active');
    }

    saveSettingsForm(e) {
        e.preventDefault();

        this.settings.shopName = document.getElementById('shopName').value.trim();
        this.settings.address = document.getElementById('shopAddress').value.trim();
        this.settings.phone = document.getElementById('shopPhone').value.trim();
        this.settings.gst = document.getElementById('shopGST').value.trim();

        this.saveSettings();
        this.closeSettingsModal();
        alert('Settings saved successfully!');
    }

    // ============================================
    // HISTORY
    // ============================================
    openHistoryModal() {
        const historyContainer = document.getElementById('billHistory');

        if (this.billHistory.length === 0) {
            historyContainer.innerHTML = '<div style="text-align: center; color: var(--gray-400); padding: 2rem;">No bills generated yet</div>';
        } else {
            historyContainer.innerHTML = `
                <table class="product-table">
                    <thead>
                        <tr>
                            <th>Bill No</th>
                            <th>Date</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.billHistory.map(bill => `
                            <tr>
                                <td>${bill.id}</td>
                                <td>${bill.date}</td>
                                <td>${bill.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
                                <td>₹${bill.total.toFixed(2)}</td>
                                <td>
                                    <button class="btn btn-secondary btn-small" onclick="billingSystem.viewBill(${bill.id})">View</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        }

        document.getElementById('historyModal').classList.add('active');
    }

    closeHistoryModal() {
        document.getElementById('historyModal').classList.remove('active');
    }

    viewBill(billId) {
        const bill = this.billHistory.find(b => b.id === billId);
        if (bill) {
            this.closeHistoryModal();
            this.showBillPreview(bill);
        }
    }

    closeBillModal() {
        document.getElementById('billModal').classList.remove('active');
    }
}

// ============================================
// INITIALIZE APPLICATION
// ============================================
let billingSystem;

document.addEventListener('DOMContentLoaded', () => {
    billingSystem = new BillingSystem();
    console.log('✅ Billing System Initialized');
});
