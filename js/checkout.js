  
        let itemsToCheckout = [];
        let deliveryAreaDisplayData = { province: "", district: "" };

        document.addEventListener("DOMContentLoaded", () => {
            const buyNowItemData = localStorage.getItem("buyNowItem");
            const checkoutCartData = localStorage.getItem("checkoutCartItems");

            if (buyNowItemData) {
                const parsedItem = JSON.parse(buyNowItemData);
            
                parsedItem.qty = parsedItem.quantity;
                itemsToCheckout = [parsedItem];
                deliveryAreaDisplayData.province = parsedItem.province || "";
                deliveryAreaDisplayData.district = parsedItem.district || "";
            } else if (checkoutCartData) {
                itemsToCheckout = JSON.parse(checkoutCartData);
                if (itemsToCheckout.length > 0) {
                    deliveryAreaDisplayData.province = itemsToCheckout[0].province || "";
                    deliveryAreaDisplayData.district = itemsToCheckout[0].district || "";
                }
            }

            const deliveryAreaDisplay = document.getElementById("selectedDeliveryArea");
            if (deliveryAreaDisplayData.province && deliveryAreaDisplayData.district && deliveryAreaDisplayData.province !== "" && deliveryAreaDisplayData.district !== "") {
                deliveryAreaDisplay.textContent = `${deliveryAreaDisplayData.province}, ${deliveryAreaDisplayData.district}`;
            } else {
                deliveryAreaDisplay.textContent = "ไม่ได้ระบุพื้นที่จัดส่ง (อาจต้องกลับไปเลือกสินค้าใหม่)";
            }

            if (itemsToCheckout.length > 0) {
                renderCheckoutSummary(itemsToCheckout);
            } else {
                document.getElementById("checkoutSummary").innerHTML = `
                    <div class="empty-cart-message">
                        <i class="fas fa-info-circle" style="margin-right: 10px;"></i> ไม่พบสินค้าสำหรับการสั่งซื้อ
                    </div>
                `;
                document.getElementById("subtotalExcludingVatDisplay").textContent = "0 บาท";
                document.getElementById("vatAmountDisplay").textContent = "0 บาท";
                document.getElementById("grandTotalDisplay").textContent = "0 บาท";
                document.getElementById("placeOrderBtn").disabled = true;
            }
        });

        function formatPrice(price) {
            if (typeof price !== 'number' || isNaN(price)) {
                return 'N/A';
            }
            return parseFloat(price.toFixed(2)).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }

        function renderCheckoutSummary(items) {
            const summaryDiv = document.getElementById("checkoutSummary");
            let html = "";
            let totalIncludingVat = 0;

            items.forEach(item => {
                const quantity = item.qty !== undefined && !isNaN(item.qty) ? item.qty : 1;
                const pricePerUnitIncludingVat = parseFloat(item.price) || 0;
                const itemTotalIncludingVat = pricePerUnitIncludingVat * quantity;

                const qtyPerSet = parseInt(item.quantity) || 1;
                const minimumQty = parseInt(item.minimum) || 1;
                const unitLabel = item.unit || 'ชิ้น';

                const setCount = Math.floor(quantity / qtyPerSet); 
                const setLabel = item.type === 'truck' ? 'รถบรรทุก' : 'รถบรรทุก'; 

                const deliveryText = item.delivery || 'ไม่ระบุ';

                html += `
                    <div class="item">
                        <img src="/assets/images/products/${item.image || ''}" alt="${item.name}" class="item-image">
                        <div class="item-details">
                            <div class="item-name">${item.name}</div>
                            <div class="item-quantity-price">${formatPrice(pricePerUnitIncludingVat)} บาท/${unitLabel}</div>
                            <div class="item-quantity-summary">
                                <span class="set-count">จำนวน ${setCount} ${setLabel}</span><br>
                                <span class="total-units">(รวม ${quantity} ${unitLabel})</span>
                                <br>
                            </div>
                        </div>
                        <div class="item-total">${formatPrice(itemTotalIncludingVat)} บาท</div>
                    </div>
                `;
                totalIncludingVat += itemTotalIncludingVat;
            });

            const totalExcludingVat = (totalIncludingVat === 0 || isNaN(totalIncludingVat)) ? 0 : totalIncludingVat / 1.07;
            const vatAmount = (totalIncludingVat === 0 || isNaN(totalIncludingVat)) ? 0 : totalIncludingVat - totalExcludingVat;

            summaryDiv.innerHTML = html;
            document.getElementById("subtotalExcludingVatDisplay").textContent = `${formatPrice(totalExcludingVat)} บาท`;
            document.getElementById("vatAmountDisplay").textContent = `${formatPrice(vatAmount)} บาท`;
            document.getElementById("grandTotalDisplay").textContent = `${formatPrice(totalIncludingVat)} บาท`;

            if (items.length > 0) {
                document.getElementById("placeOrderBtn").disabled = false;
            }
        }


        document.getElementById("customerOrderForm").addEventListener("submit", (event) => {
            event.preventDefault(); 
            
            const customerName = document.getElementById("customerName").value.trim();
            const customerEmail = document.getElementById("customerEmail").value.trim();
            const customerTaxID = document.getElementById("customerTaxID").value.trim();
            const customerPhone = document.getElementById("customerPhone").value.trim();
            const customerAddress = document.getElementById("customerAddress").value.trim();
            const customerAddressToSend = document.getElementById("customerAddressToSend").value.trim();
            const deliveryNotes = document.getElementById("deliveryNotes").value.trim();
            const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value || 'bankTransfer'; 

            const errors = [];

            if (!customerName) {
                errors.push("กรุณากรอกชื่อ-นามสกุลให้ครบถ้วน");
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!customerEmail) {
                errors.push("กรุณากรอกอีเมล");
            } else if (!emailPattern.test(customerEmail)) {
                errors.push("รูปแบบอีเมลไม่ถูกต้อง");
            }

            const phonePattern = /^\d{10}$/; 
            if (!customerPhone) {
                errors.push("กรุณากรอกเบอร์โทรศัพท์");
            } else if (!phonePattern.test(customerPhone)) {
                errors.push("เบอร์โทรศัพท์ไม่ถูกต้อง (ต้องเป็นตัวเลข 10 หลัก)");
            }
            
            if (!customerAddress) {
                errors.push("กรุณากรอกที่อยู่สำหรับออกบิล");
            }

            const taxIdPattern = /^\d{13}$/; 
            if (customerTaxID && !taxIdPattern.test(customerTaxID)) {
                errors.push("รูปแบบเลขที่ผู้เสียภาษีไม่ถูกต้อง (ต้องเป็นตัวเลข 13 หลัก)");
            }

            if (errors.length > 0) {
                Swal.fire({
                    icon: 'error',
                    title: 'ข้อมูลไม่ถูกต้อง',
                    html: `<ul>${errors.map(err => `<li>${err}</li>`).join('')}</ul>`,
                    confirmButtonText: 'ตกลง'
                });
                return;
            }

            if (itemsToCheckout.length === 0) {
                Swal.fire({
                    icon: 'error',
                    title: 'ไม่พบสินค้า',
                    text: 'ไม่พบสินค้าที่จะสั่งซื้อ กรุณาเลือกสินค้าก่อนดำเนินการ',
                    confirmButtonText: 'ตกลง'
                });
                return;
            }

            let totalIncludingVat = 0;
            itemsToCheckout.forEach(item => {
                const quantity = (item.quantity !== undefined && !isNaN(item.quantity)) ? item.quantity : (item.qty !== undefined && !isNaN(item.qty) ? item.qty : 1);
                totalIncludingVat += (parseFloat(item.price) || 0) * quantity;
            });

            const totalExcludingVat = (totalIncludingVat === 0 || isNaN(totalIncludingVat)) ? 0 : totalIncludingVat / 1.07;
            const vatAmount = (totalIncludingVat === 0 || isNaN(totalIncludingVat)) ? 0 : totalIncludingVat - totalExcludingVat;
            
            const orderDetails = {
                customer: {
                    name: customerName,
                    email: customerEmail,
                    taxId: customerTaxID,
                    phone: customerPhone,
                    billingAddress: customerAddress,
                    shippingAddress: customerAddressToSend,
                    notes: deliveryNotes,
                    deliveryProvince: deliveryAreaDisplayData.province,
                    deliveryDistrict: deliveryAreaDisplayData.district
                },
                items: itemsToCheckout.map(item => ({ 
                    id: item.id,
                    name: item.name,
                    image: item.image,
                    weight: item.weight,
                    price: parseFloat(item.price) || 0, 
                    quantity: (item.qty !== undefined && !isNaN(item.qty)) ? item.qty : (item.quantity !== undefined && !isNaN(item.quantity) ? item.quantity : 1), 
                    unit: item.unit,
                    delivery: item.delivery, 
                    type: item.type,
                    minimum: item.minimum
                })),
                paymentMethod: paymentMethod,
                subtotalExcludingVat: totalExcludingVat,
                vatAmount: vatAmount,
                grandTotalIncludingVat: totalIncludingVat,
                timestamp: new Date().toISOString()
            };

            localStorage.setItem("orderDetails", JSON.stringify(orderDetails));

            localStorage.removeItem("checkoutCartItems");
            localStorage.removeItem("buyNowItem");
            
            Swal.fire({
                icon: 'success',
                title: 'สำเร็จ',
                text: 'กำลังไปยังหน้าชำระเงิน...',
                showConfirmButton: false,
                timer: 1000,
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading();
                },
                customClass: {
                    popup: 'swal2-red-theme', 
                    title: 'swal2-title-custom',
                    htmlContainer: 'swal2-html-container-custom',
                    confirmButton: 'swal2-confirm-button-custom'
                },
                iconColor: '#c62828',
                timerProgressBar: true,
                timerProgressBarColor: '#c62828' 
            }).then(() => {
                window.location.href = '/pages/order-confirmation.html';
            });
        });



        document.getElementById("cancelOrderBtn").addEventListener("click", (event) => {
            event.preventDefault(); 

            Swal.fire({
                title: 'คุณต้องการยกเลิกคำสั่งซื้อ?',
                text: "การยกเลิกจะทำให้ข้อมูลสินค้าถูกลบทั้งหมด",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#c62828', 
                cancelButtonColor: '#757575', 
                confirmButtonText: 'ใช่, ต้องการยกเลิก!',
                cancelButtonText: 'ไม่, ไม่ยกเลิก',
                reverseButtons: true,
                customClass: {
                    popup: 'swal2-modern-theme',
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.removeItem("checkoutCartItems");
                    localStorage.removeItem("buyNowItem");

                    Swal.fire({
                        title: 'ยกเลิกสำเร็จ!',
                        text: 'คุณได้ยกเลิกคำสั่งซื้อเรียบร้อยแล้ว',
                        icon: 'success',
                        confirmButtonColor: '#c62828',
                        confirmButtonText: 'กลับไปหน้าสินค้า'
                    }).then(() => {
                        window.location.href = '/pages/products/products_showall.html';
                    });
                }
            });
        });