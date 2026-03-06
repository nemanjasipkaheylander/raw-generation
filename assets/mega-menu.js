document.addEventListener('DOMContentLoaded', function() {
    // ========== DESKTOP MENU LOGIC (Your existing code) ==========
    
    // Move mega menu sections under their corresponding menu items for desktop
    function repositionMegaMenus() {
        const menuSections = [
            '#shopify-section-sections--18072930287678__mega_menu_one_yKwezG',
            '#shopify-section-sections--18072930287678__mega_menu_two_jrbXrQ',
            '#shopify-section-sections--18072930287678__mega_menu_three_7rMQgD',
            '#shopify-section-sections--18072930287678__mega_menu_four_GrgLqr'
        ];
        
        const menuContainer = document.querySelector('.menu-level-1');
        if (!menuContainer) return;
        
        const menuItems = menuContainer.children; // Get all <li> elements
        
        // Move first 3 mega menus under their respective <li> (indices 0, 1, 2)
        for (let i = 0; i < 3; i++) {
            const megaMenu = document.querySelector(menuSections[i]);
            const targetMenuItem = menuItems[i];
            
            if (megaMenu && targetMenuItem) {
                if (!targetMenuItem.contains(megaMenu)) {
                    targetMenuItem.appendChild(megaMenu);
                }
            }
        }
        
        // Move the 4th mega menu under the 5th <li> (index 4)
        const fourthMegaMenu = document.querySelector(menuSections[3]);
        const fifthMenuItem = menuItems[4]; // 5th item (index 4)
        
        if (fourthMegaMenu && fifthMenuItem) {
            if (!fifthMenuItem.contains(fourthMegaMenu)) {
                fifthMenuItem.appendChild(fourthMegaMenu);
            }
        }
    }
    
    // Call desktop reposition function
    repositionMegaMenus();
    
    // Desktop menu items
    const desktopMenuItems = document.querySelectorAll('.menu__item');
    
    // Desktop menu sections mapping
    const desktopMenuSections = [
        '#shopify-section-sections--18072930287678__mega_menu_one_yKwezG',  // for 1st item (index 0)
        '#shopify-section-sections--18072930287678__mega_menu_two_jrbXrQ',  // for 2nd item (index 1)
        '#shopify-section-sections--18072930287678__mega_menu_three_7rMQgD', // for 3rd item (index 2)
        '#shopify-section-sections--18072930287678__mega_menu_four_GrgLqr'  // for 5th item (index 4)
    ];
    
    // Desktop variables
    let isAnyDesktopMenuOpen = false;
    let desktopLastScrollTop = 0;
    let desktopScrollTimeout;
    
    // Function to update desktop menu top position
    function updateDesktopMenuTopPosition() {
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        const menuElements = document.querySelectorAll('[id^="shopify-section-sections--18072930287678__mega_menu"]');
        
        menuElements.forEach(menu => {
            if (scrollPosition > 70) {
                menu.style.top = '66px';
            } else {
                menu.style.top = '138px';
            }
        });
    }
    
    // Function to close all desktop menus
    function closeAllDesktopMenus() {
        document.querySelectorAll('[id^="shopify-section-sections--18072930287678__mega_menu"]').forEach(menu => {
            menu.style.opacity = '0';
            menu.style.visibility = 'hidden';
            menu.style.display = 'none';
        });
        isAnyDesktopMenuOpen = false;
    }
    
    // Function to open specific desktop menu
    function openDesktopMenu(menuSelector) {
        closeAllDesktopMenus();
        
        const menu = document.querySelector(menuSelector);
        if (menu) {
            updateDesktopMenuTopPosition();
            
            menu.style.transition = 'opacity 0.3s ease, visibility 0.3s ease, top 0.2s ease';
            menu.style.display = 'block';
            menu.offsetHeight;
            menu.style.opacity = '1';
            menu.style.visibility = 'visible';
            isAnyDesktopMenuOpen = true;
        }
    }
    
    // Desktop scroll handler
    function handleDesktopScroll() {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        clearTimeout(desktopScrollTimeout);
        updateDesktopMenuTopPosition();
        
        if (currentScrollTop !== desktopLastScrollTop) {
            if (isAnyDesktopMenuOpen) {
                closeAllDesktopMenus();
            }
            
            desktopLastScrollTop = currentScrollTop;
            
            desktopScrollTimeout = setTimeout(function() {
                // Scrolling stopped
            }, 150);
        }
    }
    
    // Desktop scroll listener
    let desktopTicking = false;
    window.addEventListener('scroll', function() {
        if (!desktopTicking) {
            window.requestAnimationFrame(function() {
                handleDesktopScroll();
                desktopTicking = false;
            });
            desktopTicking = true;
        }
    }, { passive: true });
    
    // Desktop resize listener
    window.addEventListener('resize', function() {
        updateDesktopMenuTopPosition();
    });
    
    // Desktop click handlers
    desktopMenuItems.forEach((item, index) => {
        item.addEventListener('click', function(event) {
            if (index < 3 || index === 4) {
                event.preventDefault();
                
                if (index < 3) {
                    openDesktopMenu(desktopMenuSections[index]);
                } else if (index === 4) {
                    openDesktopMenu(desktopMenuSections[3]);
                }
            }
        });
    });
    
    // Desktop close when clicking outside
    document.addEventListener('click', function(event) {
        const isMenuItem = event.target.closest('.menu__item');
        const isMenuSection = event.target.closest('[id^="shopify-section-sections--18072930287678__mega_menu"]');
        
        if (!isMenuItem && !isMenuSection && isAnyDesktopMenuOpen) {
            closeAllDesktopMenus();
        }
    });
    
    // Desktop escape key handler
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && isAnyDesktopMenuOpen) {
            closeAllDesktopMenus();
        }
    });
    
    // Initial desktop position
    updateDesktopMenuTopPosition();
    
    // ========== MOBILE MENU LOGIC (Revised) ==========
    
    // Move mega menu sections under mobile menu items
    function repositionMobileMenus() {
        const menuSections = [
            '#shopify-section-sections--18072930287678__mega_menu_one_yKwezG',
            '#shopify-section-sections--18072930287678__mega_menu_two_jrbXrQ',
            '#shopify-section-sections--18072930287678__mega_menu_three_7rMQgD',
            '#shopify-section-sections--18072930287678__mega_menu_four_GrgLqr'
        ];
        
        // Find mobile menu container using your suggested selector
        const mobileMenuList = document.querySelector('ul.menu-level-1');
        if (!mobileMenuList) return;
        
        const mobileMenuItems = mobileMenuList.children; // Get all <li> elements
        
        // Move first 3 mega menus under their respective mobile <li> (indices 0, 1, 2)
        for (let i = 0; i < 3; i++) {
            const megaMenu = document.querySelector(menuSections[i]);
            const targetMenuItem = mobileMenuItems[i];
            
            if (megaMenu && targetMenuItem) {
                // Check if mega menu is already under this menu item
                if (!targetMenuItem.contains(megaMenu)) {
                    // Move the mega menu element (not clone)
                    targetMenuItem.appendChild(megaMenu);
                    console.log(`Mobile: Moved mega menu ${i+1} under menu item ${i+1}`);
                }
            }
        }
        
        // Move the 4th mega menu under the 5th mobile <li> (index 4)
        const fourthMegaMenu = document.querySelector(menuSections[3]);
        const fifthMobileMenuItem = mobileMenuItems[4]; // 5th item (index 4)
        
        if (fourthMegaMenu && fifthMobileMenuItem) {
            if (!fifthMobileMenuItem.contains(fourthMegaMenu)) {
                fifthMobileMenuItem.appendChild(fourthMegaMenu);
                console.log('Mobile: Moved 4th mega menu under 5th menu item');
            }
        }
    }
    
    // Call mobile reposition function
    repositionMobileMenus();
    
    // Mobile menu items using your suggested selector
    const mobileMenuItems = document.querySelectorAll('.menu-item');
    
    // Mobile menu sections mapping (using the same IDs since we moved them)
    const mobileMenuSections = [
        '#shopify-section-sections--18072930287678__mega_menu_one_yKwezG',  // for 1st item (index 0)
        '#shopify-section-sections--18072930287678__mega_menu_two_jrbXrQ',  // for 2nd item (index 1)
        '#shopify-section-sections--18072930287678__mega_menu_three_7rMQgD', // for 3rd item (index 2)
        '#shopify-section-sections--18072930287678__mega_menu_four_GrgLqr'  // for 5th item (index 4)
    ];
    
    // Mobile variables
    let isAnyMobileMenuOpen = false;
    
    // Function to close all mobile menus
    function closeAllMobileMenus() {
        document.querySelectorAll('[id^="shopify-section-sections--18072930287678__mega_menu"]').forEach(menu => {
            // Only hide menus that are inside mobile menu items
            if (menu.closest('.menu-item, ul.menu-level-1')) {
                menu.style.opacity = '0';
                menu.style.visibility = 'hidden';
                menu.style.display = 'none';
            }
        });
        isAnyMobileMenuOpen = false;
    }
    
    // Function to open specific mobile menu
    function openMobileMenu(menuSelector) {
        closeAllMobileMenus();
        
        const menu = document.querySelector(menuSelector);
        if (menu) {
            // Mobile-specific styling - adjust based on your mobile layout
            menu.style.transition = 'opacity 0.3s ease, visibility 0.3s ease';
            menu.style.display = 'block';
            menu.style.position = 'relative';
            menu.style.width = '100%';
            menu.style.left = '0';
            menu.style.top = '0';
            menu.style.margin = '0';
            menu.style.backgroundColor = '#fff';
            menu.style.boxShadow = 'none';
            menu.offsetHeight;
            menu.style.opacity = '1';
            menu.style.visibility = 'visible';
            isAnyMobileMenuOpen = true;
            
            console.log('Mobile menu opened:', menuSelector);
        }
    }
    
    // Add click handlers to mobile menu items
    if (mobileMenuItems.length > 0) {
        mobileMenuItems.forEach((item, index) => {
            item.addEventListener('click', function(event) {
                console.log('Mobile item clicked:', index);
                
                // First 3 items (indices 0,1,2) and 5th item (index 4) open menus
                if (index < 3 || index === 4) {
                    event.preventDefault();
                    event.stopPropagation();
                    
                    // Map index to appropriate mobile menu section
                    if (index < 3) {
                        openMobileMenu(mobileMenuSections[index]);
                    } else if (index === 4) {
                        openMobileMenu(mobileMenuSections[3]);
                    }
                }
                // 4th item (index 3) - regular link
                else {
                    // Let the default link behavior happen
                    console.log('Mobile regular link clicked (4th item)');
                }
            });
        });
    } else {
        console.log('No mobile menu items found with selector .menu-item');
    }
    
    // Close mobile menus when clicking outside
    document.addEventListener('click', function(event) {
        const isMobileMenuItem = event.target.closest('.menu-item');
        const isMobileMenuSection = event.target.closest('[id^="shopify-section-sections--18072930287678__mega_menu"]');
        
        if (!isMobileMenuItem && !isMobileMenuSection && isAnyMobileMenuOpen) {
            closeAllMobileMenus();
            console.log('Mobile menus closed by outside click');
        }
    });
    
    // Close mobile menus when escape key is pressed
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            if (isAnyMobileMenuOpen) {
                closeAllMobileMenus();
                console.log('Mobile menus closed by escape key');
            }
            if (isAnyDesktopMenuOpen) {
                closeAllDesktopMenus();
            }
        }
    });

});