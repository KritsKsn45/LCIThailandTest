
// =============================================================
// =============== GLOBAL VARIABLES ============================

let allData = null;
let currentType = "all";
let cart = JSON.parse(localStorage.getItem("currentCart")) || [];
let dealerData = null;

const cartSection = document.getElementById("cartSection");
const openCartBtn = document.getElementById("openCartBtn");
const closeCartBtn = document.getElementById("closeCartBtn");
const cartItemCountSpan = document.getElementById("cartItemCount");

document.addEventListener("DOMContentLoaded", async () => {

    // =============== CART FUNCTIONS (ตัวอย่าง) ==================
    const openCartBtn = document.getElementById("openCartBtn"); 
    const closeCartBtn = document.getElementById("closeCartBtn"); 
    
    if (openCartBtn) {
        openCartBtn.addEventListener('click', toggleCartSection);
    }
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', toggleCartSection);
    }
    updateCartUI();
    // ==========================================================


    // =============== PRELOADER ===================================
    const preloader = document.getElementById("preloader");
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.addEventListener('transitionend', () => {
                preloader.style.display = 'none';
            }, { once: true });
        }, 300);
    }
    // =============================================================


    // =============== NAVIGATION MENU =================================
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navList = document.querySelector('.nav-list');

    if (hamburgerMenu && navList) {
        hamburgerMenu.addEventListener('click', function() {
            hamburgerMenu.classList.toggle('active');
            navList.classList.toggle('active');
        });

        navList.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    hamburgerMenu.classList.remove('active');
                    navList.classList.remove('active');
                }
            });
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                hamburgerMenu.classList.remove('active');
                navList.classList.remove('active');
            }
        });

        const dropdownToggles = document.querySelectorAll('.dropdown > a');
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', function(event) {
                if (window.innerWidth <= 768) {
                    event.preventDefault();
                    const dropdownMenu = this.nextElementSibling;
                    if (dropdownMenu && dropdownMenu.classList.contains('dropdown-menu')) {
                        document.querySelectorAll('.dropdown-menu.active').forEach(menu => {
                            if (menu !== dropdownMenu) {
                                menu.classList.remove('active');
                            }
                        });
                        dropdownMenu.classList.toggle('active');
                    }
                }
            });
        });
    }
    // ===================================================================


    // =============== โหลดข้อมูลและตรวจสอบค่าพื้นที่ที่บันทึกไว้ =================
    await fetchData();

    const provinceFilter = document.getElementById("provinceFilter");
    const districtFilter = document.getElementById("districtFilter");

    if (provinceFilter && districtFilter) {
        if (allData && allData.provinces) {
            allData.provinces.forEach(province => {
                const option = document.createElement("option");
                option.value = province;
                option.textContent = province;
                provinceFilter.appendChild(option);
            });
        }

        const storedFilterState = JSON.parse(localStorage.getItem("filterState"));
        if (storedFilterState && storedFilterState.province) {
            provinceFilter.value = storedFilterState.province;
            if (allData && allData.districts && allData.districts[storedFilterState.province]) {
                districtFilter.innerHTML = '<option value="">เลือกอำเภอ/เขต</option>';
                allData.districts[storedFilterState.province].forEach(district => {
                    const option = document.createElement("option");
                    option.value = district;
                    option.textContent = district;
                    districtFilter.appendChild(option);
                });
                districtFilter.value = storedFilterState.district || "";
            }
            filterProducts();
        } else {
            renderCards(allData.products, null, null);
        }

        provinceFilter.addEventListener("change", () => {
            loadDistricts(provinceFilter.value);
            filterProducts();
        });
        districtFilter.addEventListener("change", filterProducts);
    }
    // =============================================================


    // =============== POPUP TIPS FUNCTIONALITY =========================
    // ฟังก์ชันสำหรับซ่อนและแสดง Tips
    const toggleTipsBtn = document.getElementById("toggleTipsBtn");
    const closetoggleTipsBtn = document.getElementById("ClosetoggleTipsBtn");
    const howToUse = document.querySelector(".pro-s-how-to-use-search");
    const productShowcase = document.querySelector(".pro-s-product-showcase");

    if (toggleTipsBtn && howToUse) {
        toggleTipsBtn.addEventListener("click", () => {
            howToUse.classList.toggle("pro-s-hidden");
        });
    }

    if (closetoggleTipsBtn && howToUse && productShowcase) {
        closetoggleTipsBtn.addEventListener("click", () => {
            const isTipsVisible = !howToUse.classList.contains("pro-s-hidden");
            howToUse.classList.toggle("pro-s-hidden");
            if (isTipsVisible) {
                productShowcase.scrollIntoView({ behavior: 'instant', block: 'start' });
            }
        });
    }
    // ===================================================================

    await fetchDealerData();

});

// =============== SWITCH TYPE =================================
window.switchType = function (el, type) {
    currentType = type;
    document
        .querySelectorAll(".pro-s-pd-type")
        .forEach((tab) => tab.classList.remove("active"));
    document.querySelectorAll(".pro-s-pd-adv-type").forEach((tab) => tab.classList.remove("active")); // เพิ่มเพื่อให้ทำงานกับ adv-type ด้วย

    if (el) { 
        el.classList.add("active");
    }

    const otherTypeTabs = document.querySelectorAll(`.pro-s-pd-type[onclick*="'${type}'"]`);
    const otherAdvTypeTabs = document.querySelectorAll(`.pro-s-pd-adv-type[onclick*="'${type}'"]`);

    otherTypeTabs.forEach(tab => tab.classList.add('active'));
    otherAdvTypeTabs.forEach(tab => tab.classList.add('active'));


    if (allData) { 
        filterProducts();
    }
}




// Cart System
function toggleCartSection() {
    if (cartSection.classList.contains("hidden")) {
        cartSection.classList.remove("hidden");
        setTimeout(() => {
            cartSection.classList.add("show");
        }, 10);
        document.addEventListener('keydown', handleEscapeKey);
    } else {
        cartSection.classList.remove("show");
        cartSection.addEventListener('transitionend', function handler() {
            cartSection.classList.add("hidden");
            cartSection.removeEventListener('transitionend', handler);
            document.removeEventListener('keydown', handleEscapeKey);
        });
    }
}

function handleEscapeKey(event) {
    if (event.key === 'Escape' || event.key === 'Esc') {
        if (cartSection && cartSection.classList.contains("show")) {
            toggleCartSection();
        }
    }
}

function showCart() {
    const cartEl = document.getElementById("cartSection");
    cartEl.classList.remove("hidden");
    setTimeout(() => {
        cartEl.classList.add("show");
    }, 10);
}

function hideCart() {
    const cartEl = document.getElementById("cartSection");
    cartEl.classList.remove("show");
    cartEl.addEventListener('transitionend', function handler() {
        cartEl.classList.add("hidden");
        cartEl.removeEventListener('transitionend', handler);
    });
}

function updateCartItemCount() {
    const uniqueItemCount = cart.length;

    if (uniqueItemCount > 0) {
        cartItemCountSpan.textContent = uniqueItemCount;
        cartItemCountSpan.style.display = "block";
    } else {
        cartItemCountSpan.style.display = "none";
    }
}

function updateCartUI() {
    const cartItemsEl = document.getElementById("cartItems");
    const cartSummaryEl = document.getElementById("cartSummary");
    const checkoutBtn = document.querySelector("#cartSummary button");
    const provinceFilter = document.getElementById("provinceFilter");
    const districtFilter = document.getElementById("districtFilter");
    const searchButton = document.querySelector('.pro-s-filter-bar button[onclick="filterProducts()"]');

    const selectedProvince = provinceFilter ? provinceFilter.value : "ไม่ได้เลือก";
    const selectedDistrict = districtFilter ? districtFilter.value : "ไม่ได้เลือก";

    const deliveryAreaText = (selectedProvince && selectedDistrict) &&
                             (selectedProvince !== "" && selectedDistrict !== "") ?
                             `${selectedProvince}, ${selectedDistrict}` : "กรุณาเลือกพื้นที่จัดส่ง";

    if (cart.length > 0) {
        if (provinceFilter) provinceFilter.disabled = true;
        if (districtFilter) districtFilter.disabled = true;
        if (searchButton) searchButton.disabled = true;
    } else {
        if (provinceFilter) provinceFilter.disabled = false;
        if (districtFilter) districtFilter.disabled = false;
        if (searchButton) searchButton.disabled = false;
    }

    updateCartItemCount();
    localStorage.setItem("currentCart", JSON.stringify(cart));

    cartItemsEl.innerHTML = "";
    let totalIncludingVatFromItems = 0;

    if (cart.length === 0) {
        cartItemsEl.innerHTML = `<div class="empty-cart-state"><i class="fas fa-shopping-basket" style="font-size: 3rem; color: #ccc; margin-bottom: 15px;"></i><p>ไม่มีสินค้าในตะกร้าของคุณ</p><a href="/pages/products/products_showall.html" class="back-to-shop-btn">เลือกซื้อสินค้า</a></div>`;
        cartSummaryEl.innerHTML = `
            <div><p style="font-size: 15px; color: #988383;" >พื้นที่จัดส่ง: ${deliveryAreaText}</p></div>
            <p>ยอดสุทธิ (ไม่รวม VAT): 0 บาท</p>
            <p><strong>ราคารวม: 0 บาท</strong></p>
            <button disabled>ดำเนินการชำระเงิน</button>
        `;
        return;
    }

    cart.forEach((item, index) => {
        const itemEl = document.createElement("div");
        itemEl.className = "cart-item";

        const qtyPerSet = parseInt(item.quantity) || 1;
        const minimumQty = parseInt(item.minimum) || 1;

        const unitLabel = item.unit || 'ชิ้น';
        const displayQty = item.qty;
        
        const setCount = Math.round(item.qty / qtyPerSet);

        itemEl.innerHTML = `
            <div class="cart-item-horizontal">
                <div class="cart-item-horizontal-box">
                    <div class="cart-item-horizontal-box-item">
                        <div class="cart-img">
                            <img src="/assets/images/products/${item.image}" alt="${item.name}">
                        </div>
                        <div class="cart-info">
                            <div class="cart-name">${item.name}</div>
                            <div class="cart-price">ราคา: ${parseFloat(item.price).toLocaleString()} บาท</div>
                        </div>
                    </div>
                    <div class="cart-remove">
                        <button onclick="removeFromCart(${index})"> <i class="fa-solid fa-trash"></i> ยกเลิก</button>
                    </div>
                </div>

                <div>
                    <div class="qty-control">
                        <button onclick="changeQty(${index}, false)">-</button>
                        <div class="truck-quantity-display">
                            <span class="truck-count">${setCount} ${item.type === 'truck' ? 'รถบรรทุก' : 'รถบรรทุก'}</span>
                        </div>
                        <button onclick="changeQty(${index}, true)">+</button>
                        <p class="bag-count">( จำนวน ${item.quantity} ${unitLabel}/รถ )</p>
                    </div>
                </div>
            </div>`;
        cartItemsEl.appendChild(itemEl);
        totalIncludingVatFromItems += (parseFloat(item.price) || 0) * item.qty;
    });

    const totalExcludingVat = totalIncludingVatFromItems / 1.07;

    cartSummaryEl.innerHTML = `
        <p>ยอดสุทธิ (ไม่รวม VAT): ${totalExcludingVat.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท</p>
        <p><strong>ราคารวม: ${totalIncludingVatFromItems.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท</strong></p>
        <button onclick="checkoutCart()">ดำเนินการชำระเงิน</button>
    `;

    if (checkoutBtn) {
        checkoutBtn.disabled = false;
    }
}

function checkoutCart() {
    localStorage.setItem("checkoutCartItems", JSON.stringify(cart));
    
    localStorage.removeItem("buyNowItem"); 

    cart = [];
    localStorage.removeItem("currentCart");
    updateCartUI();

    window.location.href = "/pages/products/checkout.html";
}

function addToCartWithQty(product, qty) {
    const province = document.getElementById("provinceFilter").value;
    const district = document.getElementById("districtFilter").value;

    if (!province || !district) {
        Swal.fire({
            icon: "warning",
            title: "กรุณาเลือกพื้นที่",
            text: "คุณต้องเลือกจังหวัดและอำเภอก่อนที่จะเพิ่มสินค้าในตะกร้า",
            confirmButtonText: "ตกลง",
            confirmButtonColor: "#e74c3c",
        });
        return;
    }

    let parsedQty = parseInt(qty);
    const minQuantity = parseInt(product.minimum) || 1;

    if (isNaN(parsedQty) || parsedQty < minQuantity) {
        Swal.fire({
            icon: "warning",
            title: "จำนวนสินค้าไม่ถูกต้อง",
            text: `สำหรับสินค้า ${product.name} จำนวนขั้นต่ำคือ ${minQuantity} ${product.unit || 'ชิ้น'}.`,
            confirmButtonText: "ตกลง",
            confirmButtonColor: "#e74c3c",
        });
        return;
    }

    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
        existing.qty += parsedQty;
    } else {
        cart.push({ ...product, qty: parsedQty, province: province, district: district });
    }

    updateCartUI();
    showCart();

    Swal.fire({
        icon: 'success',
        title: 'เพิ่มสินค้าลงตะกร้าแล้ว',
        showConfirmButton: false,
        timer: 1500
    });
}

function addToCart(productData, quantityToAddFromPopup) {
    const province = document.getElementById("provinceFilter").value;
    const district = document.getElementById("districtFilter").value;
  
    if (!province || !district) {
        Swal.fire({
            icon: "warning",
            title: "กรุณาเลือกพื้นที่ก่อน",
            text: "คุณต้องเลือกจังหวัดและอำเภอก่อนที่จะเพิ่มสินค้าในตะกร้า",
            confirmButtonText: "ตกลง",
            confirmButtonColor: "#e74c3c",
        });
        return;
    }

    const minQuantityForProduct = parseInt(productData.minimum) || 1;
    const qtyPerSet = parseInt(productData.quantity) || 1;

    let finalQuantityToAdd = quantityToAddFromPopup;

    if (!finalQuantityToAdd) {
        finalQuantityToAdd = qtyPerSet;
    } else {
        if (finalQuantityToAdd < minQuantityForProduct) {
            finalQuantityToAdd = minQuantityForProduct;
        }
    }

    const existing = cart.find((item) => item.id === productData.id);
    if (existing) {
        existing.qty += finalQuantityToAdd;
    } else {
        cart.push({ ...productData, qty: finalQuantityToAdd, province: province, district: district });
    }

    updateCartUI();
    showCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
    localStorage.setItem("currentCart", JSON.stringify(cart));
}

function changeQty(index, isIncrement) {
    const item = cart[index];
    if (!item) return;

    const qtyPerSet = parseInt(item.quantity) || 1;
    const minQty = parseInt(item.minimum) || 1;
    
    let newQty;
    if (isIncrement) {
        newQty = item.qty + qtyPerSet;
    } else {
        newQty = item.qty - qtyPerSet;
    }

    if (newQty >= minQty) {
        item.qty = newQty;
    } else if (newQty < minQty && newQty > 0) {
        item.qty = minQty;
    } else {
        removeFromCart(index);
        return;
    }

    updateCartUI();
    localStorage.setItem("currentCart", JSON.stringify(cart));
}

function showProductPopup(product) {
    const popup = document.getElementById("productDetailPopup");
    const content = document.getElementById("popupProductContent");

    document.body.classList.add('no-scroll');

    const images = [
        product.image,
        product.image1,
        product.image2,
        product.image3,
    ].filter((img, index, self) => img && self.indexOf(img) === index);

    const thumbnailsHTML = images
        .map(
            (img) =>
                `<img
                    src="/assets/images/products/${img}"
                    alt="รูปเพิ่มเติม"
                    style="width: 70px; height: 70px; border-radius: 6px; object-fit: cover; cursor: pointer; border: 2px solid #ddd;"
                    onclick="document.getElementById('mainPopupImg').src='/assets/images/products/${img}';"
                >`
        )
        .join("");

    const isAvailableForSale = typeof product.price === 'number' && product.price > 0;
    let priceDisplay;

    if (isAvailableForSale) {
        priceDisplay = `${product.price.toLocaleString()} บาท/${product.unit || ''}`;
    } else {
        priceDisplay = `<span style="color: #c62828; font-weight: bold;">${product.price || 'ยังไม่เปิดขาย'}</span>`;
    }

    content.innerHTML = `<div class="popup-box-show">
        <div class="popup-left">
            <div class="popup-left-boximg">
                <div>
                    <img id="mainPopupImg" src="/assets/images/products/${images[0] || ''}" alt="ตัวอย่างสินค้า ${product.name}" style="cursor: zoom-in;">
                </div>
                <div>
                    <div class="popup-thumbnails" >
                        ${thumbnailsHTML}
                    </div>
                </div>
            </div>
            
            <div class="popup-left-box">
                <div class="popup-left-box-con">
                    <div class="p-l-b-details">
                        <div class="p-l-b-s-title">
                            <p>คุณสมบัติ</p><hr>
                        </div>
                        <div class="plbs-con">
                            <ul>
                                ${(product.feature || '').split('<br>').filter(f => f.trim()).map(f => `<li>${f.trim()}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>

        <div class="popup-right">
            <div class="popup-add-v-detail">
                <h2>${product.name} ขนาด ${product.weight || ''}</h2>
                <p style="color:#555; font-size: 1.3rem;">${product.description || ''} ${product.typeWork || ''}</p>
                <div class="popup-right-price">
                    <p class="popup-right-price-r">
                        <strong>ราคา:</strong> ${priceDisplay}
                    </p>
                    <p><strong>พื้นที่:</strong> ${product.province || ''}, ${product.district || ''}</p>
                    <p>( ระยะเวลาจัดส่ง: ${product.delivery || ''} )</p>
                </div>
            </div>
            
            <div class="p-l-b-standard">
                <div class="p-l-b-s-title">
                    <p>มาตรฐานอุตสาหกรรม</p><hr>
                </div>
                <div class="plbs-con">
                    <div class="plbs-box">
                        <a href="#">
                            <img src="/assets/images/products/${product.standardImg1 || ''}" alt="">
                        </a>
                        <div class="popup-standard-logo-detail">
                            <p>${product.standard1 || ''}</p>
                        </div>
                    </div>
                    <div class="plbs-box">
                        <a href="#">
                            <img src="/assets/images/products/${product.standardImg2 || ''}" alt="">
                        </a>
                        <div class="popup-standard-logo-detail">
                            <p>${product.standard2 || ''}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="p-l-b-strength">
                <div class="p-l-b-s-title">
                    <p>ข้อมูลผลิตภัณฑ์</p><hr>
                </div>
                <div class="plbs-con">
                    <div>
                        <p>${product.detail || ''}</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="popup-close">
            <button class="popup-close-btn" onclick="closeProductPopup()">×</button>
        </div>
        <div class="mobile-popup-close">
            <button style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 20px; background-color: white; color: #D60000; border: 2px solid #D60000; padding: 10px 20px; border-radius: 8px; font-size: 16px; cursor: pointer; transition: all 0.3s ease; width: 100%; box-sizing: border-box;" class="popup-close-btn" onclick="closeProductPopup()">
                <i class="fa-solid fa-times"></i> ปิด
            </button>
        </div>
    </div>`;

    popup.classList.remove("hidden");

    const mainPopupImg = document.getElementById('mainPopupImg');
    if (mainPopupImg) {
        mainPopupImg.addEventListener('click', () => {
            openImageZoomPopup(mainPopupImg.src);
        });
    }
}

function openImageZoomPopup(imageSrc) {
    const imageZoomPopup = document.getElementById('imageZoomPopup');
    const zoomedImage = document.getElementById('zoomed-image');
    
    zoomedImage.src = imageSrc; 
    imageZoomPopup.classList.add('is-visible');

    document.body.classList.add('no-scroll'); 
}

function closeImageZoomPopup() {
    const imageZoomPopup = document.getElementById('imageZoomPopup');
    imageZoomPopup.classList.remove('is-visible'); 
    
    const productDetailPopup = document.getElementById('productDetailPopup');
    if (productDetailPopup.classList.contains('hidden')) { 
        document.body.classList.remove('no-scroll');
    }
}

document.addEventListener('keydown', (event) => {
    const productDetailPopup = document.getElementById('productDetailPopup');
    const imageZoomPopup = document.getElementById('imageZoomPopup');
    
    if (event.key === 'Escape' || event.key === 'Esc') {
        if (imageZoomPopup.classList.contains('is-visible')) {
            closeImageZoomPopup();
        } 
        else if (!productDetailPopup.classList.contains('hidden')) { 
            closeProductPopup();
        }
    }
});

function closeProductPopup() {
    document.getElementById("productDetailPopup").classList.add("hidden");
    
    const imageZoomPopup = document.getElementById('imageZoomPopup');
    if (!imageZoomPopup.classList.contains('is-visible')) {
        document.body.classList.remove('no-scroll');
    }
}

function showDealerAlert(dealerInfo) {
    const dealerInfoHtml = `
        <div style="text-align: left; margin: 0; padding: 20px; font-family: 'Sukhumvit Set', sans-serif;">
            <p style="font-size: 1.1em; color: #ca0000; font-weight: bold; margin-bottom: 15px;">ข้อมูลตัวแทนจำหน่าย</p>
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <i class="fas fa-user-tie" style="font-size: 1.2em; color: #ca0000; margin-right: 15px;"></i>
                <p style="margin: 0;"><b>ชื่อผู้ติดต่อ:</b> ${dealerInfo.dealerName || '-'}</p>
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <i class="fas fa-building" style="font-size: 1.2em; color: #ca0000; margin-right: 15px;"></i>
                <p style="margin: 0;"><b>บริษัท:</b> ${dealerInfo.company || '-'}</p>
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <i class="fas fa-phone-alt" style="font-size: 1.2em; color: #ca0000; margin-right: 15px;"></i>
                <p style="margin: 0;"><b>เบอร์โทร:</b> <a href="tel:${dealerInfo.tel1}" style="color: #007bff; text-decoration: none;">${dealerInfo.tel1 || '-'}</a></p>
            </div>
            ${dealerInfo.tel2 ? `
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <i class="fas fa-phone-alt" style="font-size: 1.2em; color: #ca0000; margin-right: 15px;"></i>
                <p style="margin: 0;"><b>เบอร์โทร 2:</b> <a href="tel:${dealerInfo.tel2}" style="color: #007bff; text-decoration: none;">${dealerInfo.tel2}</a></p>
            </div>` : ''}
            ${dealerInfo.email ? `
            <div style="display: flex; align-items: center;">
                <i class="fas fa-envelope" style="font-size: 1.2em; color: #ca0000; margin-right: 15px;"></i>
                <p style="margin: 0;"><b>อีเมล:</b> <a href="mailto:${dealerInfo.email}" style="color: #007bff; text-decoration: none;">${dealerInfo.email}</a></p>
            </div>` : ''}
        </div>
    `;

    Swal.fire({
        icon: 'info',
        title: `<span style="color: #ca0000;">พื้นที่ ${dealerInfo.provinceName} ต้องติดต่อดีลเลอร์</span>`,
        html: dealerInfoHtml,
        confirmButtonText: 'รับทราบ',
        background: '#ffffff',
        iconColor: '#ca0000',
        confirmButtonColor: '#ca0000',
        customClass: {
            popup: 'my-red-alert-popup'
        }
    });
}

// card and filter data
function filterProducts() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    const province = document.getElementById("provinceFilter").value;
    const district = document.getElementById("districtFilter").value;

    const selectedDealer = dealerData?.dealers?.find(dealer => dealer.provinceName === province);
    const isDealerProvince = !!selectedDealer;

    if (!province) {
        renderCards(allData.products, null, null);
        return;
    }
    
    if (isDealerProvince) {
        localStorage.setItem(
            "filterState",
            JSON.stringify({
                province,
                district: null,
                searchInput,
                currentType,
            })
        );
        
        showDealerAlert(selectedDealer);

        document.getElementById("productGrid").innerHTML = '';
        return;
    }

    if (!district) {
        return;
    }
    
    localStorage.setItem(
        "filterState",
        JSON.stringify({
            province,
            district,
            searchInput,
            currentType,
        })
    );
    
    const priceData = allData.prices?.[province]?.[district];
    if (!priceData) {
        document.getElementById("productGrid").innerHTML =
            "<p>ไม่พบข้อมูลสินค้าสำหรับพื้นที่นี้</p>";
        return;
    }

    const filteredProducts = allData.products.filter((p) => {
        const text = `${p.name} ${p.description}`.toLowerCase();
        return (
            (!searchInput || text.includes(searchInput)) &&
            (currentType === "all" || p.type === currentType)
        );
    });

    document.getElementById("productGrid").scrollIntoView({
        behavior: "smooth",
    });

    renderCards(filteredProducts, priceData, {
        province,
        district,
    });
}

function formatPrice(price) {
    if (typeof price !== 'number' || isNaN(price)) {
        return price;
    }

    if (price === 0) {
        return "0 บาท";
    }

    if (price < 1000000) {
        return price.toLocaleString() + " บาท";
    }
    else {
        const millions = price / 1000000;
        const formattedMillions = parseFloat(millions.toFixed(1));
        return `${formattedMillions} ล้านบาท`;
    }
}

function renderCards(products, priceData, areaInfo) {
    const grid = document.getElementById("productGrid");
    grid.innerHTML = "";

    if (!products || products.length === 0) {
        grid.innerHTML = `<p style="padding: 20px; font-size: 5rem; color: #c62828;">ไม่พบสินค้าในพื้นที่ที่ท่านเลือก</p>`;
        return;
    }

    products.forEach((product) => {
        const priceInfo = priceData && priceData[product.id] !== undefined ? priceData[product.id] : "ยังไม่เปิดขาย";
        
        const currentPrice = typeof priceInfo === 'object' && priceInfo !== null ? priceInfo.price : priceInfo;
        const isAvailableForSale = typeof currentPrice === 'number';

        const productData = {
            ...product,
            price: isAvailableForSale ? currentPrice : 0, 
            province: areaInfo?.province || "",
            district: areaInfo?.district || "",
        };

        let priceDisplayText = '';
        let buttonHtml = '';
        let promotionTagHtml = '';
        let countdownTimerHtml = '';
        
        let preorderTagHtml = '';
        if (product.name && product.name.toLowerCase().includes('(bag)')) {
            preorderTagHtml = `<div class="preorder-tag">Pre-order</div>`;
        }

        if (isAvailableForSale) {
            if (typeof priceInfo === 'object' && priceInfo !== null) {
                if (priceInfo.promotionTag && priceInfo.promotionTag !== 'none') {
                    promotionTagHtml = `<div class="promo-tag"><i class="fas fa-fire"></i> ${priceInfo.promotionTag}</div>`;
                }
                
                const unitText = product.unit || '';
                const priceFormatted = formatPrice(priceInfo.price);
                
                if (priceInfo.oldprice) {
                    const oldPriceFormatted = formatPrice(priceInfo.oldprice);
                    
                    const discount = ((priceInfo.oldprice - priceInfo.price) / priceInfo.oldprice) * 100;
                    const discountBoxHtml = `<span class="discount-box">-${discount.toFixed(0)}%</span>`;

                    priceDisplayText = `
                        <strong class="promo-price">${priceFormatted}/${unitText}</strong>
                        <div class="old-price-container">
                            <p class="old-price">${oldPriceFormatted}/${unitText}</p>
                            ${discountBoxHtml}
                        </div>
                    `;
                } else {
                    priceDisplayText = `<strong class="promo-price">${priceFormatted}/${unitText}</strong>`;
                }

                if (priceInfo.promotionFinishTime) {
                    countdownTimerHtml = `<div class="countdown-timer" id="countdown-${product.id}-${areaInfo?.province}-${areaInfo?.district}"></div>`;
                }

            } else {
                const unitText = product.unit || '';
                const priceFormatted = formatPrice(currentPrice);
                priceDisplayText = `<strong class="promo-price">${priceFormatted}/${unitText}</strong>`;
            }
            buttonHtml = `<button class="p-c-add-cart-btn"><i class="fa-solid fa-cart-arrow-down"></i> เพิ่มลงตะกร้า</button>`;

        } else {
            priceDisplayText = `<span style="font-weight: bold; color: #c62828;">${priceInfo}</span>`;
            buttonHtml = `<button class="p-c-add-cart-btn disabled" disabled style="cursor: not-allowed; opacity: 0.6;"><i class="fa-solid fa-cart-arrow-down"></i> ยังไม่เปิดขาย</button>`;
        }

        const card = document.createElement("div");
        card.className = "p-c-product-card";
        card.innerHTML = `
            <div style="position: relative;">
                <img src="/assets/images/products/${product.image || ''}" alt="${product.name}">
                ${countdownTimerHtml}
                ${promotionTagHtml}
                ${preorderTagHtml} 
            </div>
            <div class="p-c-product-info">
                <div class="pcpi-box">
                    <div class="p-c-product-title"><p>${product.name}</p></div>
                    <div class="pcpd-box">
                        <div class="p-c-product-detail"><p>${product.description || ''}</p></div>
                        <div class="p-c-product-detail"><p>${product.typeWork || ''}</p></div>
                    </div>
                    <div class="p-c-product-price">
                        <p>ราคา: <span>${priceDisplayText}</span></p>
                        <p class="p-c-product-value">( บรรจุ ${product.weight}/${product.unit2 || ''} )</p>
                    </div>
                    <div class="m-p-c-product-price">
                        <p><span>฿ ${priceDisplayText}</span></p>
                        <p class="m-p-c-product-value">( บรรจุ ${product.weight}/${product.unit1 || ''} )</p>
                        <p> </p>
                    </div>
                    <div></div>
                    <div class="p-c-product-area">
                        <div><p>พื้นที่: ${productData.province}, ${productData.district}</p></div>
                    </div>
                    <div class="m-p-c-product-area">
                        <div><p> ${productData.province}, ${productData.district}</p></div>
                    </div>
                </div>
                <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                    <button class="p-c-buy-btn" onclick='showProductPopup(${JSON.stringify(productData)})'><i class="fa-solid fa-magnifying-glass"></i> รายละเอียด</button>
                    ${buttonHtml} <p class="p-c-note">( สั่งขั้นต่ำ 1 รถบรรทุก )</p>
                </div>
            </div>
        `;
        
        grid.appendChild(card);
        
        const now = new Date().getTime();
        if (priceInfo.promotionFinishTime) {
            const finishTime = new Date(priceInfo.promotionFinishTime).getTime();
            if (now < finishTime) {
                 startCountdownTimer(`countdown-${product.id}-${areaInfo?.province}-${areaInfo?.district}`, priceInfo.promotionFinishTime, card);
            } else {
                const countdownElement = document.getElementById(`countdown-${product.id}-${areaInfo?.province}-${areaInfo?.district}`);
                if (countdownElement) {
                    countdownElement.innerHTML = "หมดเวลาโปรโมชั่น";
                }
            }
        }
        
        if (isAvailableForSale) {
            card.querySelector(".p-c-add-cart-btn").addEventListener("click", () => {
                if (productData.price === 0) { 
                    Swal.fire({
                        icon: "error",
                        title: "ไม่สามารถเพิ่มสินค้าได้",
                        text: `กรุณาเลือกจังหวัดและอำเภอที่ต้องการ เพื่อดูราคาและดำเนินการต่อ.`,
                        confirmButtonText: "ตกลง",
                        confirmButtonColor: "#e74c3c",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            filterProducts();
                        }
                    });
                } else {
                    addToCart(productData);
                }
            });
        }
    });
}


function startCountdownTimer(elementId, finishTime) {
    const countdownElement = document.getElementById(elementId);
    if (!countdownElement) {
        return;
    }
    
    const endTime = new Date(finishTime).getTime();

    const interval = setInterval(function() {
        const now = new Date().getTime();
        const distance = endTime - now;

        if (distance < 0) {
            clearInterval(interval);
            countdownElement.innerHTML = "หมดเวลาโปรโมชั่น";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        let timerText = "หมดเวลาในอีก ";
        if (days > 0) {
            timerText += `${days} วัน `;
        }
        timerText += `${hours} ชั่วโมง ${minutes} นาที ${seconds} วินาที`;

        countdownElement.innerHTML = timerText;

    }, 1000);
}


// =============== โหลดข้อมูล Products และ Prices dealer ===================
async function fetchData() {
    try {
        const [datasResponse, areaResponse] = await Promise.all([
            fetch("/poon-singto-datas.json"), 
            fetch("/poon-singto-area.json")  
        ]);

        const datas = await datasResponse.json();
        const areaDataArray = await areaResponse.json(); 

        const provinces = areaDataArray.map(item => item.province);
        const districts = {};
        areaDataArray.forEach(item => {
            districts[item.province] = item.districts;
        });

        allData = {
            products: datas.products,
            prices: datas.prices,
            provinces: provinces,
            districts: districts
        };

    } catch (error) {
        console.error("Error loading data:", error);
        document.getElementById("productGrid").innerHTML = `<p style="padding: 20px; font-size: 5rem; color: #c62828;">เกิดข้อผิดพลาดในการโหลดข้อมูลสินค้า</p>`;
    }
}

async function fetchDealerData() {
    try {
        const response = await fetch('/poon-singto-dealer.json');
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        dealerData = await response.json();
    } catch (error) {
        console.error('Error fetching dealer data:', error);
    }
}

// =============== โหลดอำเภอตามจังหวัดที่เลือก =====================
function loadDistricts(selectedProvince) {
    const districtFilter = document.getElementById("districtFilter");
    districtFilter.innerHTML = '<option value="">เลือกอำเภอ/เขต</option>'; 

    if (selectedProvince && allData && allData.districts && allData.districts[selectedProvince]) {
        allData.districts[selectedProvince].forEach(district => {
            const option = document.createElement("option");
            option.value = district;
            option.textContent = district;
            districtFilter.appendChild(option);
        });
    }
}
