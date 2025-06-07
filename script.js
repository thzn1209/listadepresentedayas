// =============================================
// CONSTANTES E VARIÁVEIS GLOBAIS
// =============================================
const gifts = Array.from(document.querySelectorAll('.gift-card')).map((card, index) => {
    const priceText = card.querySelector('.gift-price').textContent;
    
    // Links de pagamento específicos para cada presente
    const paymentLinks = {
        1: "https://payment-link-v3.ton.com.br/pl_PRGV8BYbxvEDJX4cMtYmpzg5ylMwjOaq", // Sanduicheira
        2: "https://payment-link-v3.ton.com.br/pl_KEyGpXqNR6za9xrHOHQAY8ZVO7WlQ40b", // Liquidificador
        3: "https://payment-link-v3.ton.com.br/pl_DGPEark6lLXeK0yceslMqvyxNMmboY17", // Batedeira Mondial
        4: "https://payment-link-v3.ton.com.br/pl_ROg91dl7a2LNwzYfJBCrorQkPZ863KbB", // Cafeteira Elétrica
        5: "https://payment-link-v3.ton.com.br/pl_nzkQG3NlyvV1bQVTBJiEv4B09RrLdmxZ", // Garrafa Elétrica
        6: "https://payment-link-v3.ton.com.br/pl_ynAKlW8ENZ7JVq6XSGH2Q9LzdPDRM4rg", // Ferro de Engomar
        7: "https://payment-link-v3.ton.com.br/pl_Dgox9yWR5q80k5bCWSLL34jwp6MAvnXk", // Jogo de 4 Xícaras
        8: "https://payment-link-v3.ton.com.br/pl_VXB2L6lNPgE4Y88sN4CgYAx87qv01nyj", // Conjunto jarra e copos
        9: "https://payment-link-v3.ton.com.br/pl_MnN20VeXA36zqM2fVh95zqbZxOdYEwo9", // Kit Utensílios de Cozinha
        10: "https://payment-link-v3.ton.com.br/pl_Dnl3516bpgWoLwlCDU9vGKB02Xzk9eRm", // Kit Edredom Casal Queen
        11: "https://payment-link-v3.ton.com.br/pl_KoGM58Pvm9y4paBFEmH8l7RbrwkXZazq", // Kit Banheiro Bambu
        12: "https://payment-link-v3.ton.com.br/pl_K1VW5ZQaBmw6E3ymT4SaXqpgo9ldGNY0", // Conjunto 3 Peças Banheiro
        13: "https://payment-link-v3.ton.com.br/pl_zo7m0xQbvg9NWQgIouevdXr2RGjE54Lw", // Jogo De Banheiro
        14: "https://payment-link-v3.ton.com.br/pl_zo7m0xQbvg9NWQgIouevdXr2RGjE54Lw", // Jarra de Vidro
        15: "https://payment-link-v3.ton.com.br/pl_Vvm2ENx49oLgqlhQ7Fq06KROAQ8wkjY7", // Kit Panos de Prato
        16: "https://payment-link-v3.ton.com.br/pl_nd9LVXJl7GkovoPwFgTXNY6xjw4DqOa0", // Garrafa Térmica
        17: "https://payment-link-v3.ton.com.br/pl_eDGkm2r8YVdPb9uxntzyALX1Nw4nQ90K", // Faqueiro 24 Peças
        18: "https://payment-link-v3.ton.com.br/pl_kyna4b8zqJE0N8rH2sKQVQ1PeA7W3XZr"  // Kit Prato Raso
    };

    return {
        id: index + 1, // Certifique-se que isso corresponde aos IDs no HTML
        name: card.querySelector('h3').textContent,
        price: parseFloat(priceText.replace('R$ ', '').replace(',', '.')),
        image: card.querySelector('.gift-image img').src,
        description: card.querySelector('.gift-description').textContent,
        element: card,
        pixKey: "2f4770c6-9679-4526-851c-9081395a64a9",
        paymentLink: paymentLinks[index + 1] || "https://pag.ae/7YfV5vJ4L"
    };
});

// Restante do código permanece igual...
// Configurações do tema
const themeConfig = {
    colors: {
        primary: '#ff69b4',
        secondary: '#d23669',
        background: '#1a0a1a',
        text: '#ffffff'
    },
    animations: {
        duration: {
            short: '0.3s',
            medium: '0.6s',
            long: '1s'
        }
    }
};

// =============================================
// FUNÇÕES PRINCIPAIS - OTIMIZADAS
// =============================================

function searchGifts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    
    gifts.forEach(gift => {
        const matches = gift.name.toLowerCase().includes(searchTerm) || 
                        gift.description.toLowerCase().includes(searchTerm);
        gift.element.style.display = matches ? 'flex' : 'none';
    });
}

function sortGifts() {
    const sortOption = document.getElementById('sortSelect').value;
    const giftsList = document.getElementById('giftsList');
    
    // Criar fragmento de documento para melhor performance
    const fragment = document.createDocumentFragment();
    
    [...gifts]
        .sort((a, b) => {
            switch(sortOption) {
                case 'name': return a.name.localeCompare(b.name);
                case 'price-asc': return a.price - b.price;
                case 'price-desc': return b.price - a.price;
                default: return 0;
            }
        })
        .forEach(gift => {
            fragment.appendChild(gift.element);
        });
    
    giftsList.innerHTML = '';
    giftsList.appendChild(fragment);
}

function selectGift(giftId) {
    const gift = gifts.find(g => g.id === giftId);
    if (!gift) return;
    
    const modal = createModal(`
        <h3>Confirmar presente</h3>
        <p>Você selecionou: <strong>${escapeHtml(gift.name)}</strong></p>
        <p>Valor: <strong>R$ ${gift.price.toFixed(2)}</strong></p>
        
        <div class="modal-buttons">
            <button onclick="payWithPix(${giftId})" class="pix-btn">
                <i class="fas fa-qrcode"></i> Pagar com PIX
            </button>
            <button onclick="payWithLink(${giftId})" class="link-btn">
                <i class="fas fa-link"></i> Link de Pagamento
            </button>
        </div>
        
        <button onclick="closeModal()" class="cancel-btn">
            <i class="fas fa-times"></i> Voltar para a lista
        </button>
    `);
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

// =============================================
// FUNÇÕES DE PAGAMENTO - MELHORADAS
// =============================================

function payWithPix(giftId) {
    const gift = gifts.find(g => g.id === giftId);
    if (!gift) return;
    
    const pixContent = generatePixCode(gift);
    const modal = document.querySelector('.modal-overlay');
    
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Pagamento via PIX</h3>
            <p>Presente: <strong>${escapeHtml(gift.name)}</strong></p>
            <p>Valor: <strong>R$ ${gift.price.toFixed(2)}</strong></p>
            
            <div class="pix-payment-info">
                <h4>Escaneie o QR Code</h4>
                <!-- Substitua o div pelo QR code como imagem -->
                 <img src="img/qrcode-pix.png" alt="QR Code PIX">
                
                <div class="pix-key-container">
                    <p>Ou utilize a chave PIX:</p>
                    <input type="text" id="pixKeyInput" class="pix-key-input" value="${escapeHtml(gift.pixKey)}" readonly>
                    <button class="pix-copy-btn" onclick="copyPixKey()">
                        <i class="fas fa-copy"></i>
                        <span class="btn-text">Copiar Chave PIX</span>
                        <span class="pix-tooltip">Clique para copiar a chave</span>
                    </button>
                </div>
                
                <div class="payment-instructions">
                    <h4>Como pagar:</h4>
                    <ol>
                        <li>Nome: Yasmin Nogueira Rodrigues,banco: Nubank</li>
                        <li>Abra o app do seu banco</li>
                        <li>Selecione a opção PIX</li>
                        <li>Aponte a câmera para o QR Code</li>
                        <li>Confirme o valor e finalize</li>
                    </ol>
                    <p class="gift-reference">Referência: ${escapeHtml(gift.name)}</p>
                    <p>Nome: Yasmin Nogueira Rodrigues</p>
                    <p>Banco: Nubank</p>
                </div>
            </div>
            
            <button onclick="closeModal()" class="cancel-btn">
                <i class="fas fa-times"></i> Fechar
            </button>
        </div>
    `;
    
    // Remova a chamada para generateQRCode pois agora estamos usando uma imagem
}    
 

function payWithLink(giftId) {
    const gift = gifts.find(g => g.id === giftId);
    if (!gift) return;
    
    window.open(gift.paymentLink, '_blank');
    closeModal();
}

// =============================================
// FUNÇÕES AUXILIARES - NOVAS E MELHORADAS
// =============================================

function createModal(content) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            ${content}
        </div>
    `;
    return modal;
}

function generatePixCode(gift) {
    return `00020126580014BR.GOV.BCB.PIX0136${gift.pixKey}5204000053039865405${gift.price.toFixed(2)}5802BR5913ThaigoYasmin6009SAO PAULO62070503***6304`;
}

function generateQRCode(elementId, text, options) {
    return new QRCode(document.getElementById(elementId), {
        text: text,
        width: options.width,
        height: options.height,
        colorDark: options.colorDark,
        colorLight: options.colorLight,
        correctLevel: options.correctLevel
    });
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

async function copyPixKey() {
    const input = document.getElementById('pixKeyInput');
    if (!input) return;
    
    try {
        await navigator.clipboard.writeText(input.value);
        showCopyConfirmation();
        
        const btn = document.querySelector('.pix-copy-btn');
        if (btn) {
            btn.classList.add('copied');
            setTimeout(() => btn.classList.remove('copied'), 2000);
        }
    } catch (err) {
        console.error('Falha ao copiar texto: ', err);
        // Fallback para browsers mais antigos
        input.select();
        document.execCommand('copy');
        showCopyConfirmation();
    }
}

function showCopyConfirmation() {
    const confirmation = document.createElement('div');
    confirmation.className = 'pix-confirmation';
    confirmation.innerHTML = '<i class="fas fa-check-circle"></i> Chave PIX copiada com sucesso!';
    document.body.appendChild(confirmation);
    
    setTimeout(() => {
        confirmation.style.opacity = '1';
        confirmation.style.transform = 'translate(-50%, 0)';
    }, 10);
    
    setTimeout(() => {
        confirmation.style.opacity = '0';
        confirmation.style.transform = 'translate(-50%, -20px)';
        setTimeout(() => confirmation.remove(), 300);
    }, 2000);
}

function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.classList.add('fade-out');
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = 'auto';
        }, 300);
    }
}

// =============================================
// INICIALIZAÇÃO - OTIMIZADA
// =============================================

function initializeEventListeners() {
    document.getElementById('searchInput').addEventListener('input', searchGifts);
    document.getElementById('sortSelect').addEventListener('change', sortGifts);
    
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-overlay')) {
            closeModal();
        }
    });
}

function createFuturisticBackground() {
    const bgContainer = document.createElement('div');
    bgContainer.className = 'futuristic-bg';
    
    // Ícones de utensílios
    ['spoon', 'pan', 'blender', 'cup', 'grill'].forEach(utensil => {
        for (let i = 0; i < 3; i++) {
            const icon = createFloatingIcon(utensil);
            bgContainer.appendChild(icon);
        }
    });
    
    // Efeitos de brilho
    for (let i = 0; i < 8; i++) {
        const glow = createGlowEffect();
        bgContainer.appendChild(glow);
    }
    
    // Linhas de conexão
    for (let i = 0; i < 12; i++) {
        const line = createConnectionLine();
        bgContainer.appendChild(line);
    }
    
    // Bolhas
    for (let i = 0; i < 15; i++) {
        const bubble = createBubble();
        bgContainer.appendChild(bubble);
    }
    
    document.body.prepend(bgContainer);
}

function createFloatingIcon(type) {
    const icon = document.createElement('div');
    icon.className = `kitchen-icon ${type}`;
    
    icon.style.width = `${Math.random() * 50 + 30}px`;
    icon.style.height = icon.style.width;
    icon.style.left = `${Math.random() * 90 + 5}%`;
    icon.style.top = `${Math.random() * 90 + 5}%`;
    icon.style.animationDelay = `${Math.random() * 15}s`;
    icon.style.animationDuration = `${Math.random() * 10 + 15}s`;
    
    return icon;
}

function createGlowEffect() {
    const glow = document.createElement('div');
    glow.className = 'glow-effect';
    
    const size = Math.random() * 400 + 100;
    glow.style.width = `${size}px`;
    glow.style.height = `${size}px`;
    glow.style.left = `${Math.random() * 100}%`;
    glow.style.top = `${Math.random() * 100}%`;
    glow.style.opacity = Math.random() * 0.3 + 0.1;
    glow.style.animationDuration = `${Math.random() * 3 + 3}s`;
    
    return glow;
}

function createConnectionLine() {
    const line = document.createElement('div');
    line.className = 'connection-line';
    
    line.style.width = `${Math.random() * 300 + 100}px`;
    line.style.left = `${Math.random() * 100}%`;
    line.style.top = `${Math.random() * 100}%`;
    line.style.transform = `rotate(${Math.random() * 360}deg)`;
    line.style.animationDelay = `${Math.random() * 8}s`;
    line.style.animationDuration = `${Math.random() * 10 + 5}s`;
    
    return line;
}

function createBubble() {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    
    const size = Math.random() * 60 + 20;
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${Math.random() * 100}%`;
    bubble.style.bottom = `-${size}px`;
    bubble.style.animationDelay = `${Math.random() * 15}s`;
    bubble.style.animationDuration = `${Math.random() * 15 + 10}s`;
    
    return bubble;
}

// Inicializa a aplicação
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    createFuturisticBackground();
});
