// Supabase is initialized via supabaseClient.js

// State
let products = [];
let editingId = null;

// DOM Elements
const productsTableBody = document.getElementById('productsTableBody');
const emptyState = document.getElementById('emptyState');
const modalOverlay = document.getElementById('productModal');
const modalTitle = document.getElementById('modalTitle');
const productForm = document.getElementById('productForm');
const searchInput = document.getElementById('searchInput');

// Form Inputs
const inputId = document.getElementById('productId');
const inputName = document.getElementById('productName');
const inputSku = document.getElementById('productSku');
const inputCategory = document.getElementById('productCategory');
const inputPrice = document.getElementById('productPrice');
const inputStock = document.getElementById('productStock');

// Stats Elements
const statTotalProducts = document.getElementById('statTotalProducts');
const statTotalValue = document.getElementById('statTotalValue');
const statLowStock = document.getElementById('statLowStock');

// Initialization
document.addEventListener('DOMContentLoaded', async () => {
    // Verificar login simples
    if (localStorage.getItem('admin_session') !== 'true') {
        // Redirecionar para login
        window.location.href = 'login.html';
        return;
    }
    
    // Mostra o body após validar sessão (evitar piscar tela)
    document.body.style.display = 'block';

    loadProducts();
    
    // Search listener
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        renderProducts(searchTerm);
    });
});

// Logout flow
async function logout() {
    localStorage.removeItem('admin_session');
    window.location.href = 'login.html';
}

// Load products from Supabase
async function loadProducts() {
    if (SUPABASE_URL === 'SUA_SUPABASE_URL_AQUI') {
        productsTableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: var(--danger); font-weight: 500;">⚠ Você precisa configurar sua SUPABASE_URL e SUPABASE_KEY no arquivo app.js!</td></tr>';
        productsTableBody.parentElement.classList.remove('hidden');
        emptyState.classList.add('hidden');
        return;
    }

    productsTableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: var(--text-secondary);">Carregando produtos do banco de dados...</td></tr>';
    productsTableBody.parentElement.classList.remove('hidden');
    emptyState.classList.add('hidden');

    const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        productsTableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--danger);">Erro de Conexão: ${error.message}</td></tr>`;
        showToast('Erro ao carregar os dados. Verifique a conexão com o Supabase!', true);
        return;
    }

    products = data || [];
    renderProducts();
}

// Render Products
function renderProducts(searchTerm = '') {
    productsTableBody.innerHTML = '';
    
    let filteredProducts = products;
    if (searchTerm) {
        filteredProducts = products.filter(p => 
            p.name.toLowerCase().includes(searchTerm) || 
            p.sku.toLowerCase().includes(searchTerm) ||
            p.category.toLowerCase().includes(searchTerm)
        );
    }
    
    if (filteredProducts.length === 0) {
        productsTableBody.parentElement.classList.add('hidden');
        emptyState.classList.remove('hidden');
    } else {
        productsTableBody.parentElement.classList.remove('hidden');
        emptyState.classList.add('hidden');
        
        filteredProducts.forEach(product => {
            const tr = document.createElement('tr');
            
            // Format formatCurrency
            const formattedPrice = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price);
            
            // Determine Status
            let statusBadge = '';
            if (product.stock === 0) {
                statusBadge = '<span class="badge out-of-stock">Sem Estoque</span>';
            } else if (product.stock <= 5) {
                statusBadge = '<span class="badge low-stock">Estoque Baixo</span>';
            } else {
                statusBadge = '<span class="badge in-stock">Em Estoque</span>';
            }
            
            // Icon per category (basic logic)
            let icon = 'ph-package';
            if (product.category === 'Eletrônicos') icon = 'ph-desktop';
            if (product.category === 'Periféricos') icon = 'ph-mouse';
            if (product.category === 'Escritório') icon = 'ph-briefcase';

            tr.innerHTML = `
                <td>
                    <div class="product-info-cell">
                        <div class="product-avatar">
                            <i class="ph ${icon}"></i>
                        </div>
                        <span class="product-name">${product.name}</span>
                    </div>
                </td>
                <td><span class="text-secondary">${product.sku}</span></td>
                <td>${product.category}</td>
                <td><strong>${formattedPrice}</strong></td>
                <td>${product.stock} un.</td>
                <td>${statusBadge}</td>
                <td>
                    <div class="action-btns">
                        <button class="btn-icon edit" onclick="editProduct('${product.id}')" title="Editar">
                            <i class="ph ph-pencil-simple"></i>
                        </button>
                        <button class="btn-icon delete" onclick="deleteProduct('${product.id}')" title="Excluir">
                            <i class="ph ph-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            productsTableBody.appendChild(tr);
        });
    }
    
    updateStats();
}

// Update Dashboard Stats
function updateStats() {
    statTotalProducts.innerText = products.length;
    
    let totalValue = 0;
    let lowStockCount = 0;
    
    products.forEach(p => {
        totalValue += (parseFloat(p.price) * parseInt(p.stock));
        if (p.stock <= 5 && p.stock > 0) lowStockCount++;
        else if(p.stock === 0) lowStockCount++; // Consider out of stock as low stock for the alert counter
    });
    
    statTotalValue.innerText = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValue);
    statLowStock.innerText = lowStockCount;
}

// Modal open/close
function openModal() {
    productForm.reset();
    editingId = null;
    modalTitle.innerText = "Cadastrar Produto";
    modalOverlay.classList.remove('hidden');
    inputName.focus();
}

function closeModal() {
    modalOverlay.classList.add('hidden');
    editingId = null;
    productForm.reset();
}

// Disable/Enable form buttons for async operations
function setSavingState(isSaving) {
    const btns = document.querySelectorAll('.modal-footer .btn');
    btns.forEach(btn => {
        btn.disabled = isSaving;
        if(btn.classList.contains('btn-primary')) {
            btn.innerHTML = isSaving ? '<i class="ph ph-spinner ph-spin"></i> Salvando...' : 'Salvar Produto';
        }
    });
}

// Save (Create or Update) no Supabase
async function saveProduct(e) {
    if (e) e.preventDefault();
    
    if (typeof SUPABASE_URL !== 'undefined' && SUPABASE_URL === 'SUA_SUPABASE_URL_AQUI') {
        showToast('Configure as credenciais do Supabase!', true);
        return;
    }
    
    const newProductData = {
        name: inputName.value.trim(),
        sku: inputSku.value.trim().toUpperCase(),
        category: inputCategory.value,
        price: parseFloat(inputPrice.value),
        stock: parseInt(inputStock.value)
    };

    setSavingState(true);
    
    if (editingId) {
        // Update Action
        const { data, error } = await supabase
            .from('products')
            .update(newProductData)
            .eq('id', editingId)
            .select();

        setSavingState(false);

        if (error) {
            console.error('Update Error:', error);
            showToast('Erro ao atualizar: ' + error.message, true);
            return;
        }

        const index = products.findIndex(p => p.id === editingId);
        if (index !== -1 && data && data.length > 0) {
            products[index] = data[0];
        }
        showToast('Produto atualizado com sucesso!');
    } else {
        // Insert Action
        const { data, error } = await supabase
            .from('products')
            .insert([newProductData])
            .select();

        setSavingState(false);

        if (error) {
            console.error('Insert Error:', error);
            showToast('Erro ao cadastrar: ' + error.message, true);
            return;
        }

        if (data && data.length > 0) {
            // Unshift para colocar no topo da lista se quisermos, mas como carregamos do DB...
            // O DB ordena por created_at. Vamos colocar no topo da array local.
            products.unshift(data[0]);
        }
        showToast('Produto cadastrado com sucesso!');
    }
    
    renderProducts(searchInput.value.toLowerCase());
    closeModal();
}

// Edit Product (Preenche o modal)
function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    editingId = id;
    modalTitle.innerText = "Editar Produto";
    
    inputId.value = product.id;
    inputName.value = product.name;
    inputSku.value = product.sku;
    inputCategory.value = product.category;
    inputPrice.value = product.price;
    inputStock.value = product.stock;
    
    modalOverlay.classList.remove('hidden');
}

// Delete Product no Supabase
async function deleteProduct(id) {
    if (SUPABASE_URL === 'SUA_SUPABASE_URL_AQUI') {
        showToast('Configure as credenciais do Supabase!', true);
        return;
    }

    if (confirm("Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita e os dados serão removidos do banco.")) {
        
        // Disable temporarily 
        productsTableBody.style.opacity = '0.5';

        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        productsTableBody.style.opacity = '1';

        if (error) {
            showToast('Erro ao excluir: ' + error.message, true);
            return;
        }

        products = products.filter(p => p.id !== id);
        renderProducts(searchInput.value.toLowerCase());
        showToast('Produto excluído com sucesso!');
    }
}

// Toast Notification System
function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    const toastIcon = document.getElementById('toastIcon');
    
    toastMessage.innerText = message;
    
    if (isError) {
        toast.classList.add('error');
        toastIcon.className = 'ph ph-warning-circle';
    } else {
        toast.classList.remove('error');
        toastIcon.className = 'ph ph-check-circle';
    }
    
    toast.classList.remove('hidden');
    
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}
