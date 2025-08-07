
    let currentSlide = 0;
    const slider = document.getElementById("sliderContent");
    const additionalNewsContainer = document.getElementById("additionalNews");
    let slides = [];
    let autoSlideInterval;
    let allNewsData = [];

    function formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);

        const year = date.getFullYear();
        const month = date.toLocaleDateString('th-TH', { month: 'long' });
        const day = date.getDate();
        return `${day} ${month} ${year}`;
    }

    function generateNewsContent(data) {
      let sliderHtml = '';
      let additionalNewsHtml = '';

      data.sort((a, b) => Number(a['main']) - Number(b['main']));

      data.forEach((newsItem) => {
        const formattedDate = formatDate(newsItem['date']);
        const bannerLink = newsItem['link_banner'] || 'https://via.placeholder.com/1200x600?text=No+Image';
        const newsTitle = newsItem['title'] || 'ไม่มีชื่อข่าว';
        const newsDetail = newsItem['detail'] || 'ไม่มีรายละเอียดสำหรับข่าวนี้';
        const newsLink = newsItem['link_news'] || '#';
        const agency = newsItem['agency'] || 'ไม่ระบุหน่วยงาน';
        const newsId = newsItem.ID; // ดึงค่า ID ของข่าว

        sliderHtml += `
          <div class="popular-news-slide-item" onclick="showContent(
            '${escapeHtml(newsId)}',
            '${escapeHtml(newsTitle)}',
            '${escapeHtml(newsDetail)}',
            '${escapeHtml(bannerLink)}',
            '${escapeHtml(formattedDate)}',
            '${escapeHtml(newsLink)}',
            '${escapeHtml(agency)}'
          )">
            <img src="${escapeHtml(bannerLink)}" alt="${escapeHtml(newsTitle)}">
            <div class="popular-news-image-overlay">
              <h1>${escapeHtml(newsTitle)}</h1>
              <p>${escapeHtml(formattedDate)} - ${escapeHtml(agency)}</p>
            </div>
          </div>
        `;

        additionalNewsHtml += `
          <div class="popular-news-item" onclick="showContent(
            '${escapeHtml(newsId)}',
            '${escapeHtml(newsTitle)}',
            '${escapeHtml(newsDetail)}',
            '${escapeHtml(bannerLink)}',
            '${escapeHtml(formattedDate)}',
            '${escapeHtml(newsLink)}',
            '${escapeHtml(agency)}'
          )">
            <img src="${escapeHtml(bannerLink)}" alt="${escapeHtml(newsTitle)}">
            <p>${escapeHtml(newsTitle)}</p>
          </div>
        `;
      });
      
      // ส่วนของ slider อาจจะต้องมีการอัปเดตเพิ่มเติมในโค้ดหลักเพื่อรองรับการแสดงผล
      // แต่ในส่วนนี้ไม่ได้ให้ HTML ของ slider มาจึงไม่สามารถเพิ่มให้ได้ครับ
      // slider.innerHTML = sliderHtml;

      additionalNewsContainer.innerHTML = additionalNewsHtml;
    }

    function escapeHtml(text) {
      if (typeof text !== 'string') text = String(text || '');
      text = text.replace(/\r\n|\r|\n/g, '__BR_PLACEHOLDER__');
      const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      };
      let escapedText = text.replace(/[&<>"']/g, function(m) { return map[m]; });
      return escapedText.replace(/__BR_PLACEHOLDER__/g, '<br>');
    }

    // ฟังก์ชันนี้ถูกกู้คืนกลับมา
    function startAutoSlide() {
      if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
      }
      autoSlideInterval = setInterval(() => {
        // changeSlide(1); // หากมีโค้ดสไลด์โชว์ที่สมบูรณ์จะทำงานได้
      }, 5000);
    }

    function getAgencyName(link) {
      if (!link) return "เว็บไซต์ต้นฉบับ";
      if (link.includes("mgronline.com")) {
        return "MGR Online";
      } else if (link.includes("matichon.co.th")) {
        return "มติชน";
      }
      return "เว็บไซต์ต้นฉบับ";
    }

    function shareContent(platform, title, url) {
      let shareUrl = '';
      const shareLink = encodeURIComponent(url);
      const shareTitle = encodeURIComponent(title);

      switch (platform) {
        case 'facebook':
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${shareLink}&quote=${shareTitle}`;
          break;
        case 'twitter':
          shareUrl = `https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareLink}`;
          break;
        case 'line':
          shareUrl = `https://social-plugins.line.me/lineit/share?url=${shareLink}&text=${shareTitle}`;
          break;
        case 'whatsapp':
          shareUrl = `https://api.whatsapp.com/send?text=${shareTitle}%20${shareLink}`;
          break;
        default:
          console.log('Unknown share platform');
          return;
      }
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
    
    // เพิ่มพารามิเตอร์ newsId กลับเข้าไป
    function showContent(newsId, title, content, imageUrl, date, newsLink, agency) {
      const area = document.getElementById('date-content');
      const urlToShare = `${window.location.protocol}//${window.location.host}/marketing.html?news_id=${newsId}`;
      const encodedNewsTitle = encodeURIComponent(title);

      area.innerHTML = `
        <h2>${title}</h2>
        <div class="share-icons">
          <span>แชร์:</span>
          <a href="#" onclick="event.preventDefault(); shareContent('facebook', '${encodedNewsTitle}', '${urlToShare}')" class="facebook"><i class="fab fa-facebook-f"></i></a>
          <a href="#" onclick="event.preventDefault(); shareContent('twitter', '${encodedNewsTitle}', '${urlToShare}')" class="twitter"><i class="fab fa-twitter"></i></a>
          <a href="#" onclick="event.preventDefault(); shareContent('line', '${encodedNewsTitle}', '${urlToShare}')" class="line"><i class="fab fa-line"></i></a>
          <a href="#" onclick="event.preventDefault(); shareContent('whatsapp', '${encodedNewsTitle}', '${urlToShare}')" class="whatsapp"><i class="fab fa-whatsapp"></i></a>
        </div>
        <p class="date">วันที่: ${date} - ${agency}</p>
        <img src="${imageUrl}" alt="${title}">
        <p>${content}</p>
        ${newsLink && newsLink !== '#' ? `<a href="${newsLink}" target="_blank" class="original-news-link">อ่านข่าวต้นฉบับที่ ${getAgencyName(newsLink)}</a>` : ''}
      `;
    }

    document.addEventListener('DOMContentLoaded', () => {
      fetch('https://script.google.com/macros/s/AKfycbwt54G3jR06oF7iRgZqN84-Id_zemQWD3guX3RPlOAnNWN20YcpaOvI5S4y0tbpVMcy/exec')
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
          }
          return response.json();
        })
        .then(data => {
          allNewsData = data;
          generateNewsContent(allNewsData);
          
          const urlParams = new URLSearchParams(window.location.search);
          const newsId = urlParams.get('news_id');
          const mainId = urlParams.get('main');

          let newsToDisplay = null;

          if (mainId) {
            newsToDisplay = allNewsData.find(item => String(item.main) === mainId);
          } else if (newsId) {
            newsToDisplay = allNewsData.find(item => item.ID === newsId);
          }
          
          if (!newsToDisplay && allNewsData.length > 0) {
            const sortedByDate = [...allNewsData].sort((a, b) => new Date(a.date) - new Date(b.date));
            newsToDisplay = sortedByDate[0];
          }

          if (newsToDisplay) {
            showContent(
                newsToDisplay.ID,
                newsToDisplay.title || 'ไม่มีชื่อข่าว',
                newsToDisplay.detail || '',
                newsToDisplay.link_banner || 'https://via.placeholder.com/1200x600?text=No+Image',
                formatDate(newsToDisplay.date),
                newsToDisplay.link_news || '#',
                newsToDisplay.agency || ''
            );
          } else {
            document.getElementById('date-content').innerHTML = '<p>ไม่พบข่าวสารที่ต้องการ</p>';
          }

          startAutoSlide();
        })
        .catch(error => {
          console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error);
          document.getElementById('date-content').innerHTML = '<p>ไม่สามารถโหลดข่าวสารได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง</p>';
          document.getElementById('additionalNews').innerHTML = '<p>ไม่สามารถโหลดข่าวสารเพิ่มเติมได้</p>';
        });
    });
    
    document.addEventListener("DOMContentLoaded", async () => { 
      const preloader = document.getElementById("preloader");
      if (preloader) {
        setTimeout(() => {
          preloader.style.opacity = '0';
          preloader.addEventListener('transitionend', () => {
            preloader.style.display = 'none';
          }, { once: true });
        }, 300);
      }
    });


    document.addEventListener("DOMContentLoaded", async () => { 

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

        const hamburgerMenu = document.querySelector('.hamburger-menu');
        const navList = document.querySelector('.nav-list');
        const mainNavContainer = document.querySelector('.NavOfPoonSingtoolayout'); // Get the main container

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
    });
