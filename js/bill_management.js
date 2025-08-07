 /**
     * @description แปลงตัวเลขเป็นคำอ่านภาษาไทย (รวมถึงสตางค์)
     * @param {number} num - ตัวเลขที่ต้องการแปลง
     * @returns {string} - ข้อความคำอ่านภาษาไทย
     */

    let lastEmailTime = localStorage.getItem('lastEmailTime') || 0;
    const cooldownPeriod = 180000;
    let cooldownTimer;

    function updateCooldownButton() {
        const button = document.getElementById('send-email-btn');
        const currentTime = new Date().getTime();
        const elapsedTime = currentTime - lastEmailTime;
        
        if (elapsedTime >= cooldownPeriod) {
            clearInterval(cooldownTimer);
            button.disabled = false;
            button.innerHTML = '<i class="fas fa-envelope"></i> ส่งอีเมลเลย!';
            localStorage.removeItem('lastEmailTime');
        } else {
            const remainingTimeInSeconds = Math.ceil((cooldownPeriod - elapsedTime) / 1000);
            const minutes = Math.floor(remainingTimeInSeconds / 60);
            const seconds = remainingTimeInSeconds % 60;
            
            let timeMessage = '';
            if (minutes > 0) {
                timeMessage += `${minutes} นาที `;
            }
            timeMessage += `${seconds} วินาที`;

            button.disabled = true;
            button.innerHTML = `<i class="fas fa-envelope"></i> ส่งอีกครั้งใน (${timeMessage})`;
        }
    }

    function sendEmailToLCI() {
        const button = document.getElementById('send-email-btn');
        const currentTime = new Date().getTime();
        const elapsedTime = currentTime - lastEmailTime;

        if (elapsedTime < cooldownPeriod) {
            const remainingTimeInSeconds = Math.ceil((cooldownPeriod - elapsedTime) / 1000);
            const minutes = Math.floor(remainingTimeInSeconds / 60);
            const seconds = remainingTimeInSeconds % 60;
            
            let timeMessage = '';
            if (minutes > 0) {
                timeMessage += `${minutes} นาที `;
            }
            timeMessage += `${seconds} วินาที`;

            Swal.fire({
                icon: 'warning',
                title: 'โปรดรอสักครู่',
                html: `กรุณารอสักครู่ก่อนส่งอีเมลอีกครั้ง<br>สามารถส่งได้ในอีก <b>${timeMessage}</b>`,
                confirmButtonColor: '#d32f2f', 
                timer: 3000,
                timerProgressBar: true
            });
            return; 
        }
        
        lastEmailTime = currentTime;
        localStorage.setItem('lastEmailTime', lastEmailTime);
        cooldownTimer = setInterval(updateCooldownButton, 1000);

        const recipient = 'Lion.lci2025@gmail.com';
        const subject = 'ส่งฟอร์มการสั่งสินค้า LCI-Thailand';
        
        const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${recipient}&su=${encodeURIComponent(subject)}`;
        
        window.open(gmailLink, '_blank');
        
        Swal.fire({
            title: 'เปิดหน้าส่งอีเมลสำเร็จ!',
            html: 'หากไม่เห็นหน้าต่าง กรุณาตรวจสอบ Pop-up blocker<br>ท่านสามารถแจ้งการชำระเงินพร้อมแนบหลักฐานได้ทันที',
            icon: 'success',
            confirmButtonText: 'รับทราบ',
            showConfirmButton: false,
            timer: 5000,
            timerProgressBar: true,
            background: '#ffffff',
            confirmButtonColor: '#b71c1c' 
        });

        Swal.fire({
            icon: 'success',
            title: 'ขอบคุณสำหรับการสั่งซื้อ!',
            text: 'เราได้รับคำสั่งซื้อของคุณแล้ว และจะติดต่อกลับโดยเร็วที่สุด',
            confirmButtonColor: '#b71c1c',
            showCloseButton: true,
            confirmButtonText: 'รับทราบ'
        });
    }

    window.onload = function() {
        if (localStorage.getItem('lastEmailTime')) {
            lastEmailTime = parseInt(localStorage.getItem('lastEmailTime'));
            const currentTime = new Date().getTime();
            if (currentTime - lastEmailTime < cooldownPeriod) {
                cooldownTimer = setInterval(updateCooldownButton, 1000);
            } else {
                localStorage.removeItem('lastEmailTime');
            }
        }
    };




    function bahtText(num) {
        var num_string = num.toFixed(2).toString().split('.');
        var num_int = num_string[0];
        var num_dec = num_string[1];
        var units = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน', 'ล้าน'];
        var digits = ['', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'];
        var text = '';

        if (num_int !== '0') {
            var len = num_int.length;
            for (var i = 0; i < len; i++) {
                var digit = parseInt(num_int.charAt(i));
                if (digit !== 0) {
                    if (digit === 1 && (len - i - 1) === 1) {
                        text += '';
                    } else if (digit === 2 && (len - i - 1) === 1) {
                        text += 'ยี่';
                    } else {
                        text += digits[digit];
                    }
                    text += units[len - i - 1];
                }
            }
        }
        
        if (num_dec !== '00') {
            if (num_int !== '0') {
                text += 'บาท';
            }
            var dec_text = '';
            var dec_digits = parseInt(num_dec.charAt(0));
            var dec_units = parseInt(num_dec.charAt(1));
            
            if (dec_digits !== 0) {
                if (dec_digits === 2) {
                    dec_text += 'ยี่สิบ';
                } else if (dec_digits === 1) {
                    dec_text += 'สิบ';
                } else {
                    dec_text += digits[dec_digits] + 'สิบ';
                }
            }
            
            if (dec_units !== 0) {
                if (dec_units === 1 && dec_digits === 0) {
                    dec_text += 'หนึ่ง';
                } else if (dec_units === 1) {
                    dec_text += 'เอ็ด';
                } else {
                    dec_text += digits[dec_units];
                }
            }
            
            if (dec_text !== '') {
                text += dec_text + 'สตางค์';
            } else {
                text += 'ถ้วน';
            }
        } else {
            text += 'บาทถ้วน';
        }

        if (text === 'บาทถ้วน' && num_int === '0') {
            return 'ศูนย์บาทถ้วน';
        }
        
        return text;
    }

    document.addEventListener('contextmenu', event => event.preventDefault());

    function copyAccountDetails() {
        const bankDetails = `
            ธนาคาร: ธนาคารกรุงไทย
            ชื่อบัญชี: บจก.แอลซีไอ 2025 (ไทยแลนด์) 
            เลขที่บัญชี: 6644423906
        `.trim();

        navigator.clipboard.writeText(bankDetails)
            .then(() => {
                Swal.fire({
                    icon: 'success',
                    title: 'คัดลอกสำเร็จ!', 
                   
                    showConfirmButton: false, 
                    timer: 500, 
                    timerProgressBar: true, 
                    customClass: {
                        container: 'swal2-custom-container',
                        popup: 'swal2-custom-popup',
                        title: 'swal2-custom-title',
                        htmlContainer: 'swal2-custom-html-container'
                    },
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                });
            })
            .catch(err => {
                Swal.fire({
                    icon: 'error',
                    title: 'คัดลอกไม่สำเร็จ!',
                    text: 'ไม่สามารถคัดลอกรายละเอียดบัญชีได้ กรุณาลองใหม่อีกครั้ง หรือคัดลอกด้วยตนเอง',
                    confirmButtonText: 'ตกลง',
                    confirmButtonColor: '#e74c3c'
                });
                console.error('ไม่สามารถคัดลอกได้:', err);
            });
    }

    function downloadPO() {
        const poSection = document.getElementById('poSection');
        const downloadButton = document.querySelector('.download-button');
        const buyAgainButton = document.querySelector('.buyagain-btn'); 

        Swal.fire({
            title: 'กำลังสร้าง PDF...',
            html: 'โปรดรอสักครู่ ระบบกำลังจัดเตรียมไฟล์ใบสั่งซื้อของคุณ',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        if (downloadButton) {
            downloadButton.style.display = 'none';
        }
        if (buyAgainButton) {
            buyAgainButton.style.display = 'none';
        }

        const a4WidthMM = 210;
        const a4HeightMM = 297;
        const paddingMM = 5;
        const contentWidthMM = a4WidthMM - (2 * paddingMM);
        const scale = 2; 

        html2canvas(poSection, {
            scale: scale,
            useCORS: true,
            width: poSection.offsetWidth,
            height: poSection.offsetHeight
        }).then(canvas => {
            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            const pdf = new jspdf.jsPDF('p', 'mm', 'a4'); 
            const imgProps = pdf.getImageProperties(imgData);
            const imgHeightPDF = (imgProps.height * contentWidthMM) / imgProps.width;

            pdf.addImage(imgData, 'JPEG', paddingMM, paddingMM, contentWidthMM, imgHeightPDF);
            pdf.save('ใบสั่งซื้อ-ปูนสิงโต.pdf'); 

            Swal.fire({
                icon: 'success',
                title: 'ดาวน์โหลดสำเร็จ!',
                text: 'ใบสั่งซื้อถูกดาวน์โหลดเรียบร้อยแล้ว',
                confirmButtonText: 'ตกลง'
            });

        }).catch(error => {
            console.error('Error generating PDF:', error);
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'เกิดข้อผิดพลาดในการสร้างไฟล์ PDF: ' + error.message,
                confirmButtonText: 'ตกลง'
            });
        }).finally(() => {
            if (downloadButton) {
                downloadButton.style.display = ''; 
            }
            if (buyAgainButton) {
                buyAgainButton.style.display = '';
            }
            Swal.close(); 
        });
    }

    function clearBillAndRedirect() {

        Swal.fire({
            title: 'ยืนยันการทำรายการ?',
            text: 'ระบบจะทำการลบข้อมูลการสั่งซื้อ',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'ใช่, ฉันจะไป',
            cancelButtonText: 'ยกเลิก',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem("orderDetails");
                localStorage.removeItem("orderTimestamp");
                
                Swal.fire({
                    icon: 'success',
                    title: 'ช็อปต่อกันได้เลยย!',
                    text: 'กำลังนำคุณกลับสู่หน้าสินค้า...',
                    showConfirmButton: false,
                    timer: 900 
                }).then(() => {
                    window.location.href = '/pages/products/products_showall.html'; 
                });
            }
        });
    }

   document.addEventListener("DOMContentLoaded", () => {
    const shopAgainButton = document.getElementById('clearBillAndShopAgain');
    if (shopAgainButton) {
        shopAgainButton.addEventListener('click', (e) => {
            e.preventDefault(); 
            clearBillAndRedirect();
        });
    }

    const expiryTime = 45 * 60 * 1000;
    const now = new Date().getTime();
    const orderData = JSON.parse(localStorage.getItem("orderDetails")) || {};
    
    const orderTimestamp = orderData.timestamp ? new Date(orderData.timestamp).getTime() : 0;

    if (orderData && orderTimestamp && (now - orderTimestamp > expiryTime)) {
        localStorage.removeItem("orderDetails");
        Swal.fire({
            icon: 'warning',
            title: 'เซสชันหมดอายุ',
            text: 'ข้อมูลการสั่งซื้อของคุณหมดอายุแล้ว กรุณาสั่งซื้อใหม่',
            confirmButtonText: 'ตกลง'
        }).then(() => {
            window.location.href = '/pages/products/products_showall.html'; 
        });
        return;
    }

    if (Object.keys(orderData).length > 0) {
        document.getElementById("customer-name-po").textContent = orderData.customer.name || '-';
        document.getElementById("customer-address-po").textContent = orderData.customer.billingAddress || '-';
        document.getElementById("customer-tax-id-po").textContent = orderData.customer.taxId || '-';
        document.getElementById("customer-email-po").textContent = orderData.customer.email || '-';
        document.getElementById("customer-tel-po").textContent = orderData.customer.phone || '-';
        document.getElementById("shipping-address-po").textContent = orderData.customer.shippingAddress || orderData.customer.billingAddress || '-';
        document.getElementById("additional-message").textContent = orderData.customer.notes || '-';

        const orderDate = new Date(orderData.timestamp);
        const year = orderDate.getFullYear();
        const month = (orderDate.getMonth() + 1).toString().padStart(2, '0');
        const day = orderDate.getDate().toString().padStart(2, '0');
        const randomNum = Math.floor(Math.random() * 9000) + 1000; 
        document.getElementById("po-number").textContent = `PO-${year}${month}${day}-${randomNum}`;
        document.getElementById("po-date").textContent = `${day}/${month}/${year}`;

        let totalWithVat = 0;

        const poProductList = document.getElementById("poProductList");
            if (poProductList) { 
                let itemIndex = 1;
                poProductList.innerHTML = ''; 

                orderData.items.forEach(item => {
                    const quantity = parseInt(item.quantity) || 0;
                    const unitPrice = parseFloat(item.price) || 0;
                    const discount = 0; 
                    const totalAmount = (unitPrice * quantity);
                    totalWithVat += totalAmount; 
                    const deliveryText = item.delivery || 'ไม่ระบุ'; 
                    const qtyPerSet = parseInt(item.minimum) || 1; 

                    let setLabel = 'รถ'; 
                    let unitLabel = item.unit || 'ชิ้น'; 

                    let setCount;
                    let quantityDisplay = ''; 

                    const isBag = item.type === 'bag';
                    const isBulk = item.name.toLowerCase().includes('bulk');

                    if (isBulk) {
                        setCount = Math.floor(quantity / 32); 
                        unitLabel = 'ตัน'; 
                        quantityDisplay = `<br><small class="text-muted">(32 ตัน/${setLabel})</small>`;
                    } else if (isBag) {
                        setCount = Math.floor(quantity / qtyPerSet);
                        quantityDisplay = `<br><small class="text-muted">(640 ถุง/${setLabel})</small>`;
                    } else {
                        setCount = Math.floor(quantity / qtyPerSet);
                        quantityDisplay = `<br><small class="text-muted">(จำนวน: ${quantity.toLocaleString()} ${unitLabel})</small>`;
                    }

                    if (isBag) {
                        setLabel = 'รถ';
                    }

                    const row = `
                        <tr>
                            <td>${itemIndex++}</td>
                            <td>
                                ${item.name}
                                <br>
                                <small class="text-muted">(${deliveryText})</small>
                            </td>
                            <td>
                                ${item.quantity.toLocaleString()}
                                ${quantityDisplay}
                            </td>
                            <td>${unitLabel}</td>
                            <td>${unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            <td>${discount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            <td>${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        </tr>
                    `;
                    poProductList.insertAdjacentHTML('beforeend', row);
                });
            }

            const vatRate = 0.07;
            const subtotal = totalWithVat / (1 + vatRate);
            const vatAmount = totalWithVat - subtotal;
            const grandTotal = totalWithVat;

            document.getElementById("subtotal-amount").textContent = subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' บาท';
            document.getElementById("vat-amount").textContent = vatAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' บาท';
            document.getElementById("grand-total").textContent = grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' บาท';

            const amountToPayDisplay = document.getElementById('paymentAmountDisplay');
            if (amountToPayDisplay) {
                amountToPayDisplay.textContent = grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 }) + ' บาท';
            }

            // document.getElementById("grand-total-words").textContent = bahtText(newGrandTotal);

        document.getElementById("grand-total-words").textContent = bahtText(grandTotal);

        // document.getElementById("delivery-notes-po").textContent = orderData.customer.notes || '-';

        const paymentMethodDisplay = document.getElementById("payment-method-po");
        if (paymentMethodDisplay) {
            let paymentMethodText = '';
            switch (orderData.paymentMethod) {
                case 'bankTransfer':
                    paymentMethodText = 'โอนเงินผ่านธนาคาร';
                    break;
                case 'creditCard': 
                    paymentMethodText = 'บัตรเครดิต/เดบิต';
                    break;
                default:
                    paymentMethodText = 'ไม่ระบุ';
            }
            paymentMethodDisplay.textContent = paymentMethodText;
        }
    } else {
        Swal.fire({
            icon: 'info',
            title: 'ไม่พบข้อมูลการสั่งซื้อ',
            text: 'ไม่พบข้อมูลการสั่งซื้อล่าสุด กรุณาทำการสั่งซื้อสินค้าจากหน้าหลัก',
            confirmButtonText: 'กลับสู่หน้าสินค้า'
        }).then(() => {
            window.location.href = '/pages/products/products_showall.html'; 
        });
    }



});
