
function togglePopup(show) {
    const popupWrapper = document.querySelector('.promotion-popup-wrapper');
    if (popupWrapper) {
        popupWrapper.style.display = show ? 'flex' : 'none';
        
        document.body.style.overflow = show ? 'hidden' : 'auto';

        if (show) {
            document.addEventListener('keydown', handleEscapeKey);
        } else {
            document.removeEventListener('keydown', handleEscapeKey);
        }
    }
}

function handleEscapeKey(e) {
    if (e.key === 'Escape' || e.key === 'Esc') {
        togglePopup(false);
    }
}


document.addEventListener('DOMContentLoaded', function() {
        
        // standard popup
        const cardLinks = document.querySelectorAll('.home-std-card-link');
        const closeButtons = document.querySelectorAll('.standard-popup-close-btn');
        const popups = document.querySelectorAll('.standard-popup-modal');
        
        function openPopup(popupId) {
            const popup = document.getElementById(popupId);
            if (popup) {
                popup.classList.add('is-visible');
                document.body.style.overflow = 'hidden'; 
            }
        }

        function closePopup(popup) {
            popup.classList.remove('is-visible');
            document.body.style.overflow = 'auto'; 
        }

        function closeAllPopups() {
            popups.forEach(popup => {
                if (popup.classList.contains('is-visible')) {
                    closePopup(popup);
                }
            });
        }

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                closeAllPopups();
            }
        });

        cardLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault(); 
                const popupId = link.getAttribute('data-popup-id');
                openPopup(popupId);
            });
        });

        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const popup = button.closest('.standard-popup-modal');
                closePopup(popup);
            });
        });
    
        popups.forEach(popup => {
            popup.addEventListener('click', (event) => {
                if (event.target === popup) {
                    closePopup(popup);
                }
            });
        });
        // ========================================================================================================


        // image popup
        loadProductData(); 
    
        const isMobile = window.matchMedia("(max-width: 768px)").matches; 

        const mainProductImage = document.getElementById('main-product-image');
        const productPopup = document.getElementById('productPopup');
        const imageZoomPopup = document.getElementById('imageZoomPopup');

        if (mainProductImage) {
            mainProductImage.style.cursor = 'zoom-in';
            mainProductImage.addEventListener('click', () => {
                if (isMobile) {
                    openMobileImageZoomPopup(mainProductImage.src);
                } else {
                    openImageZoomPopup(mainProductImage.src);
                }
            });
        }
        if (productPopup) {
            productPopup.addEventListener('click', (event) => {
                if (event.target === productPopup) {
                    if (isMobile) {
                        closeMobileProductPopup();
                    } else {
                        closeProductPopup();
                    }
                }
            });
        }
        if (imageZoomPopup) {
            imageZoomPopup.addEventListener('click', (event) => {
                if (event.target === imageZoomPopup) {
                    if (isMobile) {
                        closeMobileImageZoomPopup();
                    } else {
                        closeImageZoomPopup();
                    }
                }
            });
        }
        // ========================================================================================================


        // <!-- /navigationJS -->
        const hamburgerMenu = document.querySelector('.hamburger-menu');
        const navList = document.querySelector('.nav-list');
        const mainNavContainer = document.querySelector('.NavOfPoonSingtoolayout'); 

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
        // ========================================================================================================

        

        // animation
         const animatedElements = document.querySelectorAll(
            '.my-custom-animation, .fadeInLeft-animation, .fadeInRight-animation, .zoomIn-animation, .fadeInDown-animation, .fadeInUpBig-animation, .fadeIn-animation'
        );

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('start-animation');
                } else {
                    entry.target.classList.remove('start-animation');
                }
            });
        }, {
            threshold: 0.1
        });

        animatedElements.forEach(element => {
            observer.observe(element);
        });

        // ========================================================================================================


        togglePopup(true);

        const popupWrapper = document.querySelector('.promotion-popup-wrapper');
        const closeBtn = document.querySelector('.promotion-popup-close-btn');
        const popupContent = document.querySelector('.promotion-popup-image-only');

        if (popupWrapper && closeBtn && popupContent) {
            closeBtn.addEventListener('click', () => {
                togglePopup(false);
            });

            popupWrapper.addEventListener('click', (e) => {
                if (!popupContent.contains(e.target)) {
                    togglePopup(false);
                }
            });
        }
        // ========================================================================================================
});
    


// Pop up detail products desktop tablet ======================================================
let productDatas = { "products": [] }; 

async function loadProductData() {
    try {
        const response = await fetch('/poon-singto-datas.json'); 
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        productDatas = await response.json();
        // console.log('Product data loaded:', productDatas);
    } catch (error) {
        console.error('Error fetching product data:', error);
        Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด',
            text: 'ไม่สามารถโหลดข้อมูลสินค้าได้ โปรดลองใหม่อีกครั้ง',
            confirmButtonText: 'ตกลง'
        });
    }
}

function showProductPopup(productId) {
    if (!productDatas || !productDatas.products || productDatas.products.length === 0) {
        console.warn('Product data not yet loaded or empty. Attempting to reload...');
        Swal.fire({
            icon: 'info',
            title: 'กำลังโหลดข้อมูล',
            text: 'โปรดรอสักครู่ กำลังเตรียมข้อมูลสินค้า...',
            showConfirmButton: false,
            timer: 1500
        });
        loadProductData().then(() => {
            const selectedProduct = productDatas.products.find(product => product.id === productId);
            if (selectedProduct) {
                displayProductDetails(selectedProduct);
            } else {
                console.error('ไม่พบสินค้าที่ระบุ ID หลังจากการโหลด:', productId);
                Swal.fire({
                    icon: 'error',
                    title: 'ไม่พบสินค้า',
                    text: 'ไม่พบรายละเอียดสินค้าที่ต้องการ',
                    confirmButtonText: 'ตกลง'
                });
            }
        });
        return; 
    }

    const selectedProduct = productDatas.products.find(product => product.id === productId);

    if (selectedProduct) {
        displayProductDetails(selectedProduct);
    } else {
        console.error('ไม่พบสินค้าที่ระบุ ID:', productId);
        Swal.fire({
            icon: 'error',
            title: 'ไม่พบสินค้า',
            text: 'ไม่พบรายละเอียดสินค้าที่ต้องการ',
            confirmButtonText: 'ตกลง'
        });
    }
}

function displayProductDetails(productData) {
    document.getElementById('main-product-image').src = `/assets/images/products/${productData.image}`;
    document.getElementById('product-name').innerText = productData.name;
    document.getElementById('product-description').innerText = productData.description;
    
    document.getElementById('product-type-work').innerText = productData.typeWork || '-';
    document.getElementById('product-unit').innerText = productData.unit2 || '-';
    document.getElementById('product-weight').innerText = productData.weight || '-';
    document.getElementById('product-minimum').innerText = ` ${productData.minimumcomment || ''}`;

    const featureList = document.getElementById('product-features');
    featureList.innerHTML = '';
    if (productData.feature) {
        const features = productData.feature.split('<br>');
        features.forEach(feature => {
            if (feature.trim() !== '') {
                const li = document.createElement('li');
                li.innerHTML = feature.replace(/^\d+\./, '').trim();
                featureList.appendChild(li);
            }
        });
    }

    const detailText = document.getElementById('product-detail-text');
    detailText.innerText = productData.detail || '-';
    
    const thumbnailContainer = document.getElementById('hppd-thumbnail-container');
    thumbnailContainer.innerHTML = '';
    const images = ['image','image1', 'image2', 'image3', 'image4'].map(key => productData[key]).filter(img => img);
    images.forEach(imgSrc => {
        const img = document.createElement('img');
        img.src = `/assets/images/products/${imgSrc}`;
        img.alt = `ภาพสินค้า`;
        img.className = 'hppd-thumbnail-image';
        img.onclick = () => changeMainImage(img.src);
        thumbnailContainer.appendChild(img);
    });

    const standardContainer = document.getElementById('hppd-standard-icons');
    standardContainer.innerHTML = '';
    const standardImages = ['standardImg1', 'standardImg2'].map(key => productData[key]).filter(img => img);
    standardImages.forEach(imgSrc => {
        const img = document.createElement('img');
        img.src = `/assets/images/products/${imgSrc}`;
        img.alt = 'มาตรฐาน';
        img.className = 'standard-icon';
        standardContainer.appendChild(img);
    });

    document.getElementById('productPopup').classList.add('is-visible');
    
    document.body.classList.add('no-scroll');
}

function closeProductPopup() {
    document.getElementById('productPopup').classList.remove('is-visible');
    
    if (!document.getElementById('imageZoomPopup').classList.contains('is-visible')) {
        document.body.classList.remove('no-scroll');
    }
}

function changeMainImage(newSrc) {
    document.getElementById('main-product-image').src = newSrc;
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
    
    if (!document.getElementById('productPopup').classList.contains('is-visible')) {
        document.body.classList.remove('no-scroll');
    }
}


// mobile popup script
function showMobileProductPopup(productId) {
    if (!productDatas || !productDatas.products || productDatas.products.length === 0) {
        console.warn('Product data not yet loaded or empty. Attempting to reload...');
        Swal.fire({
            icon: 'info',
            title: 'กำลังโหลดข้อมูล',
            text: 'โปรดรอสักครู่ กำลังเตรียมข้อมูลสินค้า...',
            showConfirmButton: false,
            timer: 1500
        });
        loadProductData().then(() => {
            const selectedProduct = productDatas.products.find(product => product.id === productId);
            if (selectedProduct) {
                displayProductDetailsInPopup(selectedProduct);
            } else {
                console.error('ไม่พบสินค้าที่ระบุ ID หลังจากการโหลด:', productId);
                Swal.fire({
                    icon: 'error',
                    title: 'ไม่พบสินค้า',
                    text: 'ไม่พบรายละเอียดสินค้าที่ต้องการ',
                    confirmButtonText: 'ตกลง'
                });
            }
        });
        return; 
    }

    const selectedProduct = productDatas.products.find(product => product.id === productId);

    if (selectedProduct) {
        displayProductDetailsInPopup(selectedProduct);
    } else {
        console.error('ไม่พบสินค้าที่ระบุ ID:', productId);
        Swal.fire({
            icon: 'error',
            title: 'ไม่พบสินค้า',
            text: 'ไม่พบรายละเอียดสินค้าที่ต้องการ',
            confirmButtonText: 'ตกลง'
        });
    }
}

function displayProductDetailsInPopup(productData) {
    document.getElementById('main-product-image').src = `/assets/images/products/${productData.image}`;
    document.getElementById('product-name').innerText = productData.name;
    document.getElementById('product-description').innerText = productData.description;
    
    document.getElementById('product-type-work').innerText = productData.typeWork || '-';
    document.getElementById('product-unit').innerText = productData.unit2 || '-';
    document.getElementById('product-weight').innerText = productData.weight || '-';
    document.getElementById('product-minimum').innerText = ` ${productData.minimumcomment || ''}`;

    const featureList = document.getElementById('product-features');
    featureList.innerHTML = '';
    if (productData.feature) {
        const features = productData.feature.split('<br>');
        features.forEach(feature => {
            if (feature.trim() !== '') {
                const li = document.createElement('li');
                li.innerHTML = feature.replace(/^\d+\./, '').trim();
                featureList.appendChild(li);
            }
        });
    }

    const detailText = document.getElementById('product-detail-text');
    detailText.innerText = productData.detail || '-';
    
    const thumbnailContainer = document.getElementById('hppd-thumbnail-container');
    thumbnailContainer.innerHTML = '';
    const images = [productData.image, productData.image1, productData.image2, productData.image3].filter(img => img);
    images.forEach(imgSrc => {
        const img = document.createElement('img');
        img.src = `/assets/images/products/${imgSrc}`;
        img.alt = `ภาพสินค้า`;
        img.className = 'hppd-thumbnail-image';
        img.onclick = () => changeMainProductImage(img.src);
        thumbnailContainer.appendChild(img);
    });

    const standardContainer = document.getElementById('hppd-standard-icons');
    standardContainer.innerHTML = '';
    const standardImages = [productData.standardImg1, productData.standardImg2].filter(img => img);
    standardImages.forEach(imgSrc => {
        const img = document.createElement('img');
        img.src = `/assets/images/products/${imgSrc}`;
        img.alt = 'มาตรฐาน';
        img.className = 'standard-icon';
        standardContainer.appendChild(img);
    });

    document.getElementById('productPopup').classList.add('is-visible');
    document.body.classList.add('no-scroll');
}

function closeMobileProductPopup() {
    document.getElementById('productPopup').classList.remove('is-visible');
    
    if (!document.getElementById('imageZoomPopup').classList.contains('is-visible')) {
        document.body.classList.remove('no-scroll');
    }
}

function changeMainProductImage(newSrc) {
    document.getElementById('main-product-image').src = newSrc;
    document.querySelectorAll('.hppd-thumbnail-image').forEach(img => {
        img.classList.remove('active');
    });
    const currentThumbnail = document.querySelector(`.hppd-thumbnail-image[src="${newSrc}"]`);
    if (currentThumbnail) {
        currentThumbnail.classList.add('active');
    }
}

function openMobileImageZoomPopup(imageSrc) {
    const imageZoomPopup = document.getElementById('imageZoomPopup');
    const zoomedImage = document.getElementById('zoomed-image');
    
    zoomedImage.src = imageSrc;
    imageZoomPopup.classList.add('is-visible'); 

    document.body.classList.add('no-scroll'); 
}

function closeMobileImageZoomPopup() {
    const imageZoomPopup = document.getElementById('imageZoomPopup');
    imageZoomPopup.classList.remove('is-visible'); 
    
    if (!document.getElementById('productPopup').classList.contains('is-visible')) {
        document.body.classList.remove('no-scroll');
    }
}


document.addEventListener('keydown', (event) => {
    const productPopup = document.getElementById('productPopup');
    const imageZoomPopup = document.getElementById('imageZoomPopup');
    const isMobile = window.matchMedia("(max-width: 768px)").matches; 

    if (event.key === 'Escape' || event.key === 'Esc') {
        if (imageZoomPopup.classList.contains('is-visible')) {
            if (isMobile) {
                closeMobileImageZoomPopup();
            } else {
                closeImageZoomPopup();
            }
        } else if (productPopup.classList.contains('is-visible')) {
            if (isMobile) {
                closeMobileProductPopup();
            } else {
                closeProductPopup();
            }
        }
    }
});

// ===================================================================


// go to heaven ======================================================
window.addEventListener('scroll', () => {
    const btn = document.getElementById('scrollToTopBtn');
    if (window.scrollY > 300) {
      btn.style.display = 'block';
    } else {
      btn.style.display = 'none';
    }
  });

document.getElementById('scrollToTopBtn').addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
});
// ===================================================================



// preloader =========================================================
window.addEventListener("load", function () {
    setTimeout(function () {
      const preloader = document.getElementById("preloader");
      preloader.style.opacity = 0;
      setTimeout(() => preloader.style.display = "none", 500); 
    }, 500); 
});

// ===================================================================




// News Script =======================================================

fetch('https://script.google.com/macros/s/AKfycbwt54G3jR06oF7iRgZqN84-Id_zemQWD3guX3RPlOAnNWN20YcpaOvI5S4y0tbpVMcy/exec')
  .then(response => response.json())
  .then(data => {
    const list = document.getElementById('newsList');
    list.innerHTML = '';

    data.sort((a, b) => Number(a['main']) - Number(b['main']));

    data.forEach(item => {
      const formattedDate = formatDate(item['date']);
      const card = document.createElement('div');
      card.className = 'news-card';
      card.innerHTML = `
        <div class="news-img-container">
          <img src="${item['link_banner'] || 'default.jpg'}" alt="ข่าว LCI" class="news-img" />
        </div>
        <div class="news-content">
          <h2 class="news-title">${item['title'] || 'ไม่มีชื่อข่าว'}</h2>
          <p class="news-date">${formattedDate} - ${item['agency']}</p>
          <a href="/pages/marketing.html?main=${item['main']}" target="_blank" class="news-link">อ่านต่อ</a>
        </div>
      `;
      list.appendChild(card);
    });
  })
  .catch(error => console.error('เกิดข้อผิดพลาด:', error));


// chane date read easy
function formatDate(dateString) {
    if (!dateString) return 'ไม่ระบุวันที่';

    const date = new Date(dateString);

    let year = date.getFullYear();
    if (year > 2500) {
        year = year - 543;
        date.setFullYear(year);
    }

    return date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// touch slide
const slider = document.querySelector('.news-cards');

slider.addEventListener('wheel', (e) => {

  if (e.deltaY !== 0) {
    e.preventDefault();
    slider.scrollLeft += e.deltaY * 2;
  }
}, { passive: false });
// ===================================================================




// Image slide with Swiper ===========================================
const swiper = new Swiper('.swiper-container', {
    slidesPerView: 1,
    spaceBetween: 0,
    loop: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
    autoplay: {
      delay: 3000,
      disableOnInteraction: false
    }
});
// ===================================================================


