 // =============================================================
  // =============== GLOBAL VARIABLES ============================
  // ตัวแปรเหล่านี้จำเป็นต้องอยู่ใน Global Scope เพื่อให้ฟังก์ชันต่างๆ เข้าถึงได้
  // ไม่ว่าจะถูกเรียกจาก DOMContentLoaded หรือจาก Event Listener อื่นๆ
  let allData = null;
  let currentType = "all";
  // let cart = []; // Global cart variable

  let cart = JSON.parse(localStorage.getItem("currentCart")) || []; 
  const cartSection = document.getElementById("cartSection");
  const openCartBtn = document.getElementById("openCartBtn");
  const closeCartBtn = document.getElementById("closeCartBtn"); 
  const cartItemCountSpan = document.getElementById("cartItemCount"); 

  document.addEventListener("DOMContentLoaded", () => {
    if (openCartBtn) {
        openCartBtn.addEventListener('click', toggleCartSection);
    }
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', toggleCartSection);
    }
    updateCartUI();
  });

  function toggleCartSection() {
      if (cartSection.classList.contains("hidden")) {
          cartSection.classList.remove("hidden");
          setTimeout(() => {
              cartSection.classList.add("show");
          }, 10);
      } else {
          cartSection.classList.remove("show");
          cartSection.addEventListener('transitionend', function handler() {
              cartSection.classList.add("hidden");
              cartSection.removeEventListener('transitionend', handler);
          });
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

  function showProductPopup(product) {
    const popup = document.getElementById("productDetailPopup");
    const content = document.getElementById("popupProductContent");

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
                    onclick="document.getElementById('mainPopupImg').src='/assets/images/products/${img}'"
                >`
        )
        .join("");

    const minQuantity = product.type === "bag" ? 640 : (parseInt(product.minimum) || 1);
    const initialQuantity = minQuantity; 

    const minimumComment = product.minimumcomment || '';

    let displayPriceInPopup;
    if (product.price === "N/A" || product.price === null || product.price === undefined || product.price === 0) {
        displayPriceInPopup = "N/A";
    } else if (product.type === "bag") {
        displayPriceInPopup = product.price.toLocaleString(); 
    } else {
        displayPriceInPopup = product.price.toLocaleString(); 
    }

    content.innerHTML = `<div class="popup-box-show">
            <div class="popup-left">
              <div class="popup-left-boximg">
                <div>
                  <img id="mainPopupImg" src="/assets/images/products/${images[0] || ''}" alt="ตัวอย่างสินค้า ${product.name}" >
                </div>
                <div>
                  <div class="popup-thumbnails" >
                    ${thumbnailsHTML}
                  </div>
                </div>
              </div>

              <div class="popup-left-box">
                <div class="popup-left-box-con">
                  <div class="p-l-b-standard">
                    <div class="p-l-b-s-title">
                      <p >มาตรฐานอุตสาหกรรม</p><hr>
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

                  <div class="p-l-b-standard">
                    <div class="p-l-b-s-title">
                      <p>คุณสมบัติ</p><hr>
                    </div>
                    <div class="plbs-con">
                      <p>
                        ${product.feature || ''}
                      </p>
                    </div>
                  </div>

                  <div class="p-l-b-strength">
                    <div class="p-l-b-s-title">
                      <p >ข้อมูลผลิตภัณฑ์</p><hr>
                    </div>
                    <div class="plbs-con">
                      <div>
                        <p>
                          ${product.detail || ''}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="popup-right">
                <div class="popup-add-v-detail">
                  <h2>${product.name} ขนาด ${product.weight || ''}</h2>
                  <p style="color:#555; font-size: 1.3rem;">${product.description || ''}</p>
                  <div class="popup-right-price">
                    <p class="popup-right-price-r"><strong>ราคา:</strong> ${displayPriceInPopup} บาท/${product.unit || ''}</p>
                    <p><strong>พื้นที่จัดส่ง:</strong> ${
                      product.province || ''
                    }, ${product.district || ''}</p>
                  </div>
                </div>

                <div class="popup-content">
                    <h4>เลือกจำนวนสินค้า</h4>
                    <div class="stepper">
                      <label for="qtyInput">จำนวน:</label>
                      <div class="stepper-controls">
                        <button type="button" class="decrease">−</button>
                        <input id="qtyInput" type="number" min="${minQuantity}" value="${initialQuantity}" />
                        <button type="button" class="increase">+</button>
                      </div>
                      <p class="note">${minimumComment}</p>
                    </div>
                </div>

                <div class="popup-action-buttons" style="display:flex; gap:15px; margin-top:20px;">
                  <button class="popup-add-cart-btn" style="flex:1; background-color:#ff8902; color:#fff; border:none; padding:12px; border-radius:8px; cursor:pointer; font-weight:600; font-size:1rem;">เพิ่มลงตะกร้า</button>
                  <button class="popup-buy-now-btn" style="flex:1; background-color:#e53935; color:#fff; border:none; padding:12px; border-radius:8px; cursor:pointer; font-weight:600; font-size:1rem;">สั่งซื้อทันที</button>
                </div>
            </div>

            <div class="popup-close">
                <button class="popup-close-btn" onclick="closeProductPopup()">×</button>
            </div>
          </div>`;

    popup.classList.remove("hidden");

    const qtyInput = document.getElementById("qtyInput");
    const btnIncrease = popup.querySelector(".increase");
    const btnDecrease = popup.querySelector(".decrease");
    const btnAddToCart = popup.querySelector(".popup-add-cart-btn");
    const btnBuyNow = popup.querySelector(".popup-buy-now-btn");

    if (btnIncrease && btnDecrease && qtyInput) {
        btnIncrease.onclick = () => {
            qtyInput.value = parseInt(qtyInput.value) + 1;
        };

        btnDecrease.onclick = () => {
            const currentVal = parseInt(qtyInput.value);
            if (currentVal > minQuantity) {
                qtyInput.value = currentVal - 1;
            } else {
                qtyInput.value = minQuantity;
                Swal.fire({
                    icon: "warning",
                    title: "จำนวนสินค้าขั้นต่ำ",
                    text: `สำหรับสินค้านี้ (${product.name}) จำนวนขั้นต่ำคือ ${minQuantity} ${product.unit || 'ชิ้น'}.`,
                    confirmButtonText: "ตกลง",
                    confirmButtonColor: "#e74c3c",
                });
            }
        };

        qtyInput.addEventListener("change", () => {
            let currentVal = parseInt(qtyInput.value);

            if (isNaN(currentVal) || currentVal < minQuantity) {
                qtyInput.value = minQuantity; 
                Swal.fire({
                    icon: "warning",
                    title: "จำนวนสินค้าขั้นต่ำ",
                    text: `สำหรับสินค้านี้ (${product.name}) ต้องสั่งขั้นต่ำ ${minQuantity} ${product.unit || 'ชิ้น'}.`,
                    confirmButtonText: "ตกลง",
                    confirmButtonColor: "#e74c3c",
                });
            }         
        });

        qtyInput.addEventListener("input", () => {
            let currentVal = parseInt(qtyInput.value);
            if (isNaN(currentVal) || currentVal < minQuantity) {

            }
        });
    }

    if (btnAddToCart) {
        btnAddToCart.addEventListener('click', () => {
            const quantity = parseInt(qtyInput.value); 
            if (quantity < minQuantity) {
                qtyInput.value = minQuantity;
                Swal.fire({
                    icon: "warning",
                    title: "จำนวนสินค้าไม่ถูกต้อง",
                    text: `จำนวนที่ป้อน (${quantity}) ไม่ถึงขั้นต่ำ (${minQuantity}) สำหรับสินค้านี้ (${product.name}). ระบบจะปรับเป็น ${minQuantity}.`,
                    confirmButtonText: "ตกลง",
                    confirmButtonColor: "#e74c3c",
                });
                return;
            }

            if (product.price === "N/A" || product.price === null || product.price === undefined || product.price === 0) {
                Swal.fire({
                    icon: "error",
                    title: "ไม่สามารถเพิ่มสินค้าได้",
                    text: `สินค้านี้ ${product.name} ยังไม่มีข้อมูลราคาที่ถูกต้องสำหรับพื้นที่ที่คุณเลือก.`,
                    confirmButtonText: "ตกลง",
                    confirmButtonColor: "#e74c3c",
                }).then((result) => {
                    if (result.isConfirmed) {
                        filterProducts();
                        closeProductPopup();
                    }
                });
            } else {
                addToCart(product, quantity);
                closeProductPopup();
            }
        });
    }

    if (btnBuyNow) {
        btnBuyNow.addEventListener('click', () => {
          const quantity = parseInt(qtyInput.value);
            if (quantity < minQuantity) {
                qtyInput.value = minQuantity; 
                Swal.fire({
                    icon: "warning",
                    title: "จำนวนสินค้าไม่ถูกต้อง",
                    text: `จำนวนที่ป้อน (${quantity}) น้อยกว่าจำนวนขั้นต่ำ (${minQuantity}) สำหรับการสั่งสินค้านี้ (${product.name}). ระบบจะปรับเป็น ${minQuantity}.`,
                    confirmButtonText: "ตกลง",
                    confirmButtonColor: "#e74c3c",
                });
                return;
            }

            if (product.price === "N/A" || product.price === null || product.price === undefined || product.price === 0) {
                Swal.fire({
                    icon: "error",
                    title: "ไม่สามารถสั่งซื้อได้",
                    text: `สินค้านี้ ${product.name} ยังไม่มีข้อมูลราคาที่ถูกต้องสำหรับพื้นที่ที่คุณเลือก.`,
                    confirmButtonText: "ตกลง",
                    confirmButtonColor: "#e74c3c",
                }).then((result) => {
                    if (result.isConfirmed) {
                        filterProducts();
                        closeProductPopup();
                    }
                });
            } else {
                const itemToBuy = {
                    ...product,
                    quantity: quantity
                };
                localStorage.setItem('buyNowItem', JSON.stringify(itemToBuy));

                window.location.href = '/pages/products/checkout.html';
            }
        });
    }
}
  
  function closeProductPopup() {
    document.getElementById("productDetailPopup").classList.add("hidden");
  }

  function changeQty(index, delta) {
      const item = cart[index];
      const newQty = item.qty + delta;
      const minQuantityForItem = item.type === "bag" ? 640 : (parseInt(item.minimum) || 1); // ตรวจสอบตรงนี้

      if (newQty >= minQuantityForItem) {
          item.qty = newQty;
      } else {
        Swal.fire({
            icon: "warning",
            title: "จำนวนสินค้าขั้นต่ำ",
            text: `สำหรับสินค้า ${item.name} จำนวนขั้นต่ำคือ ${minQuantityForItem} ${item.unit || 'ชิ้น'}.`,
            confirmButtonText: "ตกลง",
            confirmButtonColor: "#e74c3c",
        });
    }
    updateCartUI();
    localStorage.setItem("currentCart", JSON.stringify(cart));
}

  function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
    localStorage.setItem("currentCart", JSON.stringify(cart));
  }

  function updateCartUI() {
    const cartItemsEl = document.getElementById("cartItems");
    const cartSummaryEl = document.getElementById("cartSummary");

    cartItemsEl.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
        cartItemsEl.innerHTML = "<p>ไม่มีสินค้าในตะกร้า</p>";
        cartSummaryEl.innerHTML = `
        <p>ยอดสุทธิ: 0 บาท</p>
        <p><strong>ราคารวม (vat 7 %): 0 บาท</strong></p>
        <button disabled>ดำเนินการชำระเงิน</button>
      `;
        updateCartItemCount();
        return;
    }

    cart.forEach((item, index) => {
        const itemEl = document.createElement("div");
        itemEl.className = "cart-item";
        itemEl.innerHTML = `<div class="cart-item-horizontal">
            <div class="cart-img">
            <img src="/assets/images/products/${item.image}" alt="${
            item.name
            }">
            </div>
            <div class="cart-info">
            <div class="cart-name">${item.name}</div>
            <div class="cart-price">ราคา: ${item.price.toLocaleString()} บาท</div>
            <div class="qty-control">
                <button onclick="changeQty(${index}, -1)">-</button>
                <span>${item.qty}</span>
                <button onclick="changeQty(${index}, 1)">+</button>
            </div>
            </div>
            <div class="cart-remove">
            <button onclick="removeFromCart(${index})">ลบ</button>
            </div>
        </div>`;
        cartItemsEl.appendChild(itemEl);
        total += (parseFloat(item.price) || 0) * item.qty; 
    });

    const vat = total * 0.07;
    const grandTotal = total + vat;

    cartSummaryEl.innerHTML = `
      <p>ยอดสุทธิ: ${total.toLocaleString()} บาท</p>
      <p><strong>ราคารวม (vat 7 %): ${grandTotal.toLocaleString()} บาท</strong></p>
      <button onclick="checkoutCart()">ดำเนินการชำระเงิน</button>
    `;

    updateCartItemCount();
    localStorage.setItem("currentCart", JSON.stringify(cart));
}

  function checkoutCart() {
    localStorage.setItem("checkoutCartItems", JSON.stringify(cart)); 
    
    cart = [];
    localStorage.removeItem("currentCart"); 
    updateCartUI();
    
    window.location.href = "/pages/products/checkout.html";
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

    const minQuantityForProduct = productData.type === "bag" ? 640 : (parseInt(productData.minimum) || 1);

    let finalQuantityToAdd;

    if (quantityToAddFromPopup !== undefined && !isNaN(parseInt(quantityToAddFromPopup))) {
        finalQuantityToAdd = parseInt(quantityToAddFromPopup);
        if (finalQuantityToAdd < minQuantityForProduct) {
            finalQuantityToAdd = minQuantityForProduct;
            console.warn(`Quantity adjusted to minimum from popup input. Original: ${quantityToAddFromPopup}, Adjusted: ${finalQuantityToAdd}`);
        }
    } else {
        finalQuantityToAdd = minQuantityForProduct; 
        console.log(`Using default/minimum quantity for product: ${productData.name}, Quantity: ${finalQuantityToAdd}`);
    }

    const existing = cart.find((item) => item.id === productData.id);
    if (existing) {
        existing.qty += finalQuantityToAdd;
    } else {
        cart.push({ ...productData, qty: finalQuantityToAdd });
    }

    updateCartUI();

    Swal.fire({
        icon: 'success',
        title: 'เพิ่มสินค้าลงตะกร้าแล้ว',
        showConfirmButton: false,
        timer: 500
    });
    showCart(); 
}

  function addToCartWithQty(product, qty) {
    const province = document.getElementById("provinceFilter").value;
    const district = document.getElementById("districtFilter").value;

    if (!province || !district) {
        Swal.fire({
            icon: "warning",
            title: "กรุณาเลือกพื้นที่จัดส่ง",
            text: "คุณต้องเลือกจังหวัดและอำเภอก่อนที่จะเพิ่มสินค้าในตะกร้า",
            confirmButtonText: "ตกลง",
            confirmButtonColor: "#e74c3c",
        });
        return;
    }

    let parsedQty = parseInt(qty);
    const minQuantity = product.type === "bag" ? 640 : (parseInt(product.minimum) || 1);

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
        cart.push({ ...product, qty: parsedQty });
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

  function buyNowWithQty(product, qty) {
    const province = document.getElementById("provinceFilter").value;
    const district = document.getElementById("districtFilter").value;

    if (!province || !district) {
        Swal.fire({
            icon: "warning",
            title: "กรุณาเลือกพื้นที่จัดส่ง",
            text: "คุณต้องเลือกจังหวัดและอำเภอก่อนที่จะดำเนินการ",
            confirmButtonText: "ตกลง",
            confirmButtonColor: "#e74c3c",
        });
        return;
    }

    let parsedQty = parseInt(qty);
    const minQuantity = product.type === "bag" ? 640 : (parseInt(product.minimum) || 1);

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

    cart = [];
    cart.push({ ...product, qty: parsedQty });
    localStorage.setItem('buyNowItem', JSON.stringify(cart[0]));
    window.location.href = "/pages/products/checkout.html";
}

  // ============== FILTER PRODUCTS =============================
  function filterProducts() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    const province = document.getElementById("provinceFilter").value;
    const district = document.getElementById("districtFilter").value;

    if (!province || !district) {    
        renderCards(allData.products, null, null); // ส่ง null สำหรับ priceData
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
        "<p>ไม่พบข้อมูลในพื้นที่นี้</p>";
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

  function downloadOrderBill(orderData) {
    const blob = new Blob([orderData], {
        type: "application/pdf",
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "order-bill.pdf";
    link.click();

    URL.revokeObjectURL(url);
}

  // Function to format price (add this function to your script)
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

  // =============== RENDER CARDS ================================
  function renderCards(products, priceData, areaInfo) {
    const grid = document.getElementById("productGrid");
    grid.innerHTML = "";

    if (!products || products.length === 0) {
        grid.innerHTML = `<p style="padding: 20px; font-size: 5rem; color: #c62828;">ไม่พบสินค้าในพื้นที่ที่ท่านเลือก</p>`;
        return;
    }

    products.forEach((product) => {

        const price = priceData && priceData[product.id] !== undefined ? priceData[product.id] : "N/A";

        const productData = {
            ...product,
            price: price !== "N/A" ? parseFloat(price) : 0,
            province: areaInfo?.province || "",
            district: areaInfo?.district || "",
        };

        let priceDisplayText = '';
        let priceVisibilityClass = '';

        // *** ส่วนที่แก้ไข: เรียกใช้ formatPrice ***
        if (productData.price !== 0) { // ถ้ามีราคา (ไม่ใช่ 0 หรือ N/A)
            if (product.type === "bag") {
                // สำหรับ bag, คุณบอกว่าอยากให้คำนวณราคาสำหรับ 640 ชิ้น แล้วค่อยแปลง
                // แต่จากตัวอย่างก่อนหน้า คุณไม่ได้คูณ 640 ตรงนี้ แต่เป็นราคาต่อหน่วย
                // หาก product.price ใน priceData คือราคาต่อ 640 ชิ้นอยู่แล้ว
                // ให้ใช้ productData.price ตรงๆ
                // หาก product.price คือราคาต่อหน่วย (เช่น ต่อกิโลกรัม) และคุณต้องการแสดงราคารวม 640 กิโลกรัม
                // ก็จะต้องคูณก่อนแปลง แต่จากโค้ดเดิมของคุณดูเหมือน productData.price สำหรับ bag คือราคาที่ต้องการแสดงแล้ว
                // ดังนั้นเราจะใช้ formatPrice กับ productData.price โดยตรง
                priceDisplayText = `<strong>${formatPrice(productData.price)}</strong>`; // ใช้ formatPrice ตรงๆ
            } else {
                priceDisplayText = `<strong>${formatPrice(productData.price)}/${product.unit || ''}</strong>`;
            }
        } else {
            // กรณีราคาเป็น 0 หรือ "N/A"
            priceDisplayText = `<strong>N/A บาท/${product.unit || ''}</strong>`;
            priceVisibilityClass = 'hide-na-price-text';
        }

        const card = document.createElement("div");
        card.className = "p-c-product-card";
        card.innerHTML = `<img src="/assets/images/products/${
                product.image || ''
            }" alt="${product.name}">
                        <div class="p-c-product-info">
                            <div class="pcpi-box">
                                <div class="p-c-product-title"><p>${product.name}</p></div>
                                <div class="p-c-product-detail"><p>${product.description || ''}</p></div>
                                <div class="p-c-product-detail"><p>${product.typeWork || ''}</p></div>
                                <div class="p-c-product-price">
                                    <p class="${priceVisibilityClass} ">ราคา: <span> ${priceDisplayText} </span></p>
                                    <p class="p-c-product-value" >จำนวน ${product.weight}/${product.unit}</p>
                                </div>
                                <div>
                                </div>
                                <div>
                                    <div><p style="font-size: 13px; color: #848383;" >พื้นที่จัดส่ง: ${productData.province}, ${productData.district}</p></div>
                                </div>
                            </div>
                            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                                <button class="p-c-buy-btn" onclick='showProductPopup(${JSON.stringify(productData)})'><i class="fa-solid fa-magnifying-glass"></i> รายละเอียด</button>
                                <button class="p-c-add-cart-btn"><i class="fa-solid fa-cart-arrow-down"></i> เพิ่มลงตะกร้า</button>
                            </div>
                        </div>
        `;
        card.querySelector(".p-c-add-cart-btn").addEventListener("click", () => {
            if (productData.price === 0) {
                Swal.fire({
                    icon: "error",
                    title: "ไม่สามารถเพิ่มสินค้าได้",
                    text: `สินค้านี้ ${product.name} ยังไม่มีข้อมูลราคาที่ถูกต้องสำหรับพื้นที่ที่คุณเลือก. กรุณาเลือกจังหวัดและอำเภอที่ต้องการ เพื่อดูราคาและดำเนินการต่อ.`,
                    confirmButtonText: "ตกลง",
                    confirmButtonColor: "#e74c3c",
                }).then((result) => {
                    if (result.isConfirmed) {
                        filterProducts();
                    }
                });
            } else {
                // เรียก addToCart โดยไม่ระบุ quantity เพื่อให้ใช้ค่า default (640 สำหรับ bag, หรือ minimum สำหรับอื่น ๆ)
                addToCart(productData);
            }
        });

        grid.appendChild(card);
    });
}









  // =============== SWITCH TYPE =================================
  window.switchType = function (el, type) {
    currentType = type;
    document
      .querySelectorAll(".pro-s-pd-type")
      .forEach((tab) => tab.classList.remove("active"));
    document.querySelectorAll(".pro-s-pd-adv-type").forEach((tab) => tab.classList.remove("active")); // เพิ่มเพื่อให้ทำงานกับ adv-type ด้วย

    if (el) { // ตรวจสอบว่า el มีค่าหรือไม่ (กรณีเรียกจากโค้ดที่ไม่ใช่จากการคลิกตรงๆ)
        el.classList.add("active");
    }

    // ทำให้ tab อื่นๆ ที่เป็น type เดียวกัน active ไปด้วย (ถ้ามี)
    const otherTypeTabs = document.querySelectorAll(`.pro-s-pd-type[onclick*="'${type}'"]`);
    const otherAdvTypeTabs = document.querySelectorAll(`.pro-s-pd-adv-type[onclick*="'${type}'"]`);

    otherTypeTabs.forEach(tab => tab.classList.add('active'));
    otherAdvTypeTabs.forEach(tab => tab.classList.add('active'));


    if (allData) { // ตรวจสอบให้แน่ใจว่า allData โหลดแล้วก่อน filter
        filterProducts();
    }
  };
  
  // =============== COMEBACK TO PRODUCT ===========================
  function startRedirectCountdown(minutes = 15) {
    let timeLeft = minutes * 60;

    const countdown = setInterval(() => {
      timeLeft--;

      if (timeLeft <= 0) {
        clearInterval(countdown);
        window.location.href = "/pages/products/products_showall.html"; // หรือ URL หน้าผลิตภัณฑ์
      }
    }, 1000);
  }
  // =============================================================

  // =============== PRELOADER ===================================
  window.addEventListener("load", function () {
    setTimeout(() => {
      const preloader = document.getElementById("preloader");
      if (preloader) {
        preloader.style.opacity = 0;
        setTimeout(() => (preloader.style.display = "none"), 500);
      }
    }, 500);
  });
  // =============================================================
  
  // =============================================================
  // =============== SWIPER ======================================
  const promoSwiper = new Swiper(".swiper-container", {
    loop: true,
    autoplay: {
      delay: 3000,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });
  // =============================================================








  // =============================================================
  // =============== DOMContentLoaded EVENTS =====================
  // โค้ดส่วนใหญ่ที่ต้องโต้ตอบกับ DOM ควรอยู่ใน DOMContentLoaded
  // เพื่อให้แน่ใจว่า DOM พร้อมใช้งานแล้ว
  document.addEventListener("DOMContentLoaded", () => {
    
    // =============== ANIMATION IN/OUT ===========================
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target;
          const animateIn = el.dataset.animateIn;
          const animateOut = el.dataset.animateOut;

          if (entry.isIntersecting) {
            el.classList.remove(animateOut);
            el.classList.add(animateIn);
          } else {
            el.classList.remove(animateIn);
            el.classList.add(animateOut);
          }
        });
      },
      { threshold: 0.5 }
    );

    document.querySelectorAll("[data-animate-in]").forEach((el) => {
      observer.observe(el);
    });
    // =============================================================

    // =============== HOW TO USE TOGGLE ===========================
    const toggleBtn = document.getElementById("toggleTipsBtn");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        const target = document.querySelector(".pro-s-how-to-use-search");
        target && target.classList.toggle("pro-s-hidden");
      });
    }
    // =============================================================

    // =============== LOCATION / AREA FILTER ======================
    const provinceEl = document.getElementById("provinceFilter");
    const districtEl = document.getElementById("districtFilter");

    provinceEl?.addEventListener("change", () =>
      localStorage.removeItem("filterState")
    );
    districtEl?.addEventListener("change", () =>
      localStorage.removeItem("filterState")
    );

    if (provinceEl && districtEl) {
      fetch("/poon-singto-area.json")
        .then((res) => res.json())
        .then((areaData) => {
          areaData.forEach((area) => {
            const option = document.createElement("option");
            option.value = area.province;
            option.textContent = area.province;
            provinceEl.appendChild(option);
          });
          provinceEl.addEventListener("change", () => {
            districtEl.innerHTML = "<option value=''>เลือกอำเภอ</option>";
            districtEl.disabled = true;
            const sel = areaData.find((a) => a.province === provinceEl.value);
            if (sel) {
              sel.districts.forEach((d) => {
                const opt = document.createElement("option");
                opt.value = d;
                opt.textContent = d;
                districtEl.appendChild(opt);
              });
              districtEl.disabled = false;
            }
          });

          const saved = JSON.parse(
            localStorage.getItem("filterState") || "null"
          );
          if (saved) {
            provinceEl.value = saved.province;
            provinceEl.dispatchEvent(new Event("change")); 
            setTimeout(() => { 
              districtEl.value = saved.district;
              document.getElementById("searchInput").value = saved.searchInput || "";
              currentType = saved.currentType || "all";

              document.querySelectorAll(".pro-s-pd-type").forEach((tab) => {
                tab.classList.toggle(
                  "active",
                  (currentType === "all" && tab.textContent.includes("ทั้งหมด")) ||
                  (currentType === "bag" && tab.textContent.includes("ถุง")) ||
                  (currentType === "truck" && tab.textContent.includes("คันรถ"))
                );
              });
              document.querySelectorAll(".pro-s-pd-adv-type").forEach((tab) => {
                  tab.classList.toggle(
                    "active",
                    (currentType === "all" && tab.textContent.includes("ทั้งหมด")) ||
                    (currentType === "bag" && tab.textContent.includes("ถุง")) ||
                    (currentType === "truck" && tab.textContent.includes("คันรถ"))
                  );
              });
            }, 300);
          }
        });

      // ดึงข้อมูลสินค้า
      fetch("/poon-singto-datas.json")
        .then((res) => res.json())
        .then((data) => {
          allData = data; // กำหนดค่า allData ตรงนี้
          if (!localStorage.getItem("filterState")) {
            renderCards(data.products, null, null); // แสดงสินค้าทั้งหมดครั้งแรก (ถ้าไม่มี filterState)
          } else {
            // ถ้ามีสถานะที่บันทึกไว้ ให้เรียก filterProducts() เพื่อแสดงผลตามนั้น
            filterProducts();
          }
        });
    }
    // =============================================================

    // =============== CART OPEN/CLOSE ===========================
    // Event Listeners สำหรับปุ่มเปิด/ปิดตะกร้า
    const openCartBtn = document.getElementById("openCartBtn");
    const closeCartBtn = document.getElementById("closeCartBtn");
    if (openCartBtn && closeCartBtn) {
      openCartBtn.addEventListener("click", showCart);
      closeCartBtn.addEventListener("click", hideCart);
    }
    localStorage.removeItem("buyNowItem");

    updateCartUI();

    // ===========================================================
  }); // End of DOMContentLoaded