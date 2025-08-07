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
        
});
