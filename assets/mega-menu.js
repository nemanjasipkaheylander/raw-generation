document.addEventListener('DOMContentLoaded', function() {
    // ========== DESKTOP MENU LOGIC ==========
    
    // Function to check if we're in mobile view
    function isMobileView() {
        return window.innerWidth < 1025;
    }
    
    // Store original positions of mega menus to restore them when switching to desktop
    const originalMenuPositions = new Map();
    
    // Function to store original parent of each mega menu
    function storeOriginalPositions() {
        const menuSections = [
            '#shopify-section-sections--18072930287678__mega_menu_one_yKwezG',
            '#shopify-section-sections--18072930287678__mega_menu_two_jrbXrQ',
            '#shopify-section-sections--18072930287678__mega_menu_three_7rMQgD',
            '#shopify-section-sections--18072930287678__mega_menu_four_GrgLqr'
        ];
        
        menuSections.forEach(selector => {
            const menu = document.querySelector(selector);
            if (menu && !originalMenuPositions.has(selector)) {
                originalMenuPositions.set(selector, menu.parentNode);
            }
        });
    }
    
    // Function to restore menus to their original positions (for desktop)
    function restoreMenusToOriginal() {
        const menuSections = [
            '#shopify-section-sections--18072930287678__mega_menu_one_yKwezG',
            '#shopify-section-sections--18072930287678__mega_menu_two_jrbXrQ',
            '#shopify-section-sections--18072930287678__mega_menu_three_7rMQgD',
            '#shopify-section-sections--18072930287678__mega_menu_four_GrgLqr'
        ];
        
        menuSections.forEach(selector => {
            const menu = document.querySelector(selector);
            const originalParent = originalMenuPositions.get(selector);
            
            if (menu && originalParent && !originalParent.contains(menu)) {
                originalParent.appendChild(menu);
                console.log(`Restored ${selector} to original position`);
            }
        });
    }
    
    // Function to move mega menus under their corresponding menu items for mobile
    function repositionMenusForMobile() {
        const menuSections = [
            '#shopify-section-sections--18072930287678__mega_menu_one_yKwezG',
            '#shopify-section-sections--18072930287678__mega_menu_two_jrbXrQ',
            '#shopify-section-sections--18072930287678__mega_menu_three_7rMQgD',
            '#shopify-section-sections--18072930287678__mega_menu_four_GrgLqr'
        ];
        
        // Try to find mobile menu container first
        let menuContainer = document.querySelector('ul.menu-level-1');
        
        // If not found, try alternative mobile selectors
        if (!menuContainer) {
            menuContainer = document.querySelector('.mobile-menu .menu-level-1, .drawer__menu .menu-level-1, [data-mobile-menu] .menu-level-1');
        }
        
        if (!menuContainer) return;
        
        const menuItems = menuContainer.children;
        
        // Move first 3 mega menus under their respective <li> (indices 0, 1, 2)
        for (let i = 0; i < 3; i++) {
            const megaMenu = document.querySelector(menuSections[i]);
            const targetMenuItem = menuItems[i];
            
            if (megaMenu && targetMenuItem) {
                if (!targetMenuItem.contains(megaMenu)) {
                    targetMenuItem.appendChild(megaMenu);
                    console.log(`Mobile: Moved mega menu ${i+1} under menu item ${i+1}`);
                }
            }
        }
        
        // Move the 4th mega menu under the 5th <li> (index 4)
        const fourthMegaMenu = document.querySelector(menuSections[3]);
        const fifthMenuItem = menuItems[4];
        
        if (fourthMegaMenu && fifthMenuItem) {
            if (!fifthMenuItem.contains(fourthMegaMenu)) {
                fifthMenuItem.appendChild(fourthMegaMenu);
                console.log('Mobile: Moved 4th mega menu under 5th menu item');
            }
        }
    }
    
    // Function to handle responsive menu positioning
    function handleResponsiveMenus() {
        if (isMobileView()) {
            // Store original positions first time
            if (originalMenuPositions.size === 0) {
                storeOriginalPositions();
            }
            // Reposition for mobile
            repositionMenusForMobile();
        } else {
            // Restore to original desktop positions
            restoreMenusToOriginal();
        }
    }
    
    // Initial store of original positions
    storeOriginalPositions();
    
    // Initial responsive handling
    handleResponsiveMenus();
    
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            handleResponsiveMenus();
            
            // Close any open menus when switching views
            closeAllDesktopMenus();
            closeAllMobileMenus();
        }, 250);
    });
    
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
    let currentlyOpenDesktopMenu = null;
    let desktopLastScrollTop = 0;
    let desktopScrollTimeout;
    
    // Function to update desktop menu top position
    function updateDesktopMenuTopPosition() {
        // Only apply desktop positioning if not in mobile view
        if (isMobileView()) return;
        
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        const menuElements = document.querySelectorAll('[id^="shopify-section-sections--18072930287678__mega_menu"]');
        
        menuElements.forEach(menu => {
            if (scrollPosition > 70) {
                menu.style.top = '66px';
            } else {
                menu.style.top = '132px';
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
        currentlyOpenDesktopMenu = null;
    }
    
    // Function to close specific desktop menu
    function closeSpecificDesktopMenu(menuSelector) {
        const menu = document.querySelector(menuSelector);
        if (menu) {
            menu.style.opacity = '0';
            menu.style.visibility = 'hidden';
            menu.style.display = 'none';
        }
        isAnyDesktopMenuOpen = false;
        currentlyOpenDesktopMenu = null;
    }
    
    // Function to open specific desktop menu
    function openDesktopMenu(menuSelector) {
        // Don't open desktop menus in mobile view
        if (isMobileView()) return;
        
        const menu = document.querySelector(menuSelector);
        if (menu) {
            updateDesktopMenuTopPosition();
            
            menu.style.transition = 'opacity 0.3s ease, visibility 0.3s ease, top 0.2s ease';
            menu.style.display = 'block';
            menu.offsetHeight;
            menu.style.opacity = '1';
            menu.style.visibility = 'visible';
            isAnyDesktopMenuOpen = true;
            currentlyOpenDesktopMenu = menuSelector;
        }
    }
    
    // Desktop scroll handler
    function handleDesktopScroll() {
        // Skip scroll handling in mobile view
        if (isMobileView()) return;
        
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        clearTimeout(desktopScrollTimeout);
        updateDesktopMenuTopPosition();
        
        if (currentScrollTop !== desktopLastScrollTop) {
            if (isAnyDesktopMenuOpen) {
                closeAllDesktopMenus();
            }
            
            desktopLastScrollTop = currentScrollTop;
            
            desktopScrollTimeout = setTimeout(function() {}, 150);
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
    
    // Desktop resize listener (for top position updates)
    window.addEventListener('resize', function() {
        updateDesktopMenuTopPosition();
    });
    
    // Desktop click handlers
    desktopMenuItems.forEach((item, index) => {
        item.addEventListener('click', function(event) {
            // Only handle desktop clicks in desktop view
            if (isMobileView()) return;
            
            if (index < 2 || index === 3) {
                event.preventDefault();
                
                let menuSelector;
                if (index < 2) {
                    menuSelector = desktopMenuSections[index];
                } else if (index === 3) {
                    menuSelector = desktopMenuSections[3];
                }
                
                // Check if this menu is already open
                if (currentlyOpenDesktopMenu === menuSelector) {
                    closeSpecificDesktopMenu(menuSelector);
                    console.log('Desktop: Closing menu (same trigger clicked)');
                } else {
                    closeAllDesktopMenus();
                    openDesktopMenu(menuSelector);
                    console.log('Desktop: Opening menu', menuSelector);
                }
            }
        });
    });
    
    // Desktop close when clicking outside
    document.addEventListener('click', function(event) {
        if (isMobileView()) return;
        
        const isMenuItem = event.target.closest('.menu__item');
        const isMenuSection = event.target.closest('[id^="shopify-section-sections--18072930287678__mega_menu"]');
        
        if (!isMenuItem && !isMenuSection && isAnyDesktopMenuOpen) {
            closeAllDesktopMenus();
        }
    });
    
    // Desktop escape key handler
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            if (!isMobileView() && isAnyDesktopMenuOpen) {
                closeAllDesktopMenus();
            }
            if (isAnyMobileMenuOpen) {
                closeAllMobileMenus();
            }
        }
    });
    
    // Initial desktop position
    updateDesktopMenuTopPosition();
    
    // ========== MOBILE MENU LOGIC ==========
    
    // Mobile menu items
    const mobileMenuItems = document.querySelectorAll('.menu-item');
    
    // Mobile menu sections mapping
    const mobileMenuSections = [
        '#shopify-section-sections--18072930287678__mega_menu_one_yKwezG',
        '#shopify-section-sections--18072930287678__mega_menu_two_jrbXrQ',
        '#shopify-section-sections--18072930287678__mega_menu_three_7rMQgD',
        '#shopify-section-sections--18072930287678__mega_menu_four_GrgLqr'
    ];
    
    // Mobile variables
    let isAnyMobileMenuOpen = false;
    let currentlyOpenMobileMenu = null;
    
    // Function to close all mobile menus
    function closeAllMobileMenus() {
        document.querySelectorAll('[id^="shopify-section-sections--18072930287678__mega_menu"]').forEach(menu => {
            if (menu.closest('.menu-item, ul.menu-level-1')) {
                menu.style.opacity = '0';
                menu.style.visibility = 'hidden';
                menu.style.display = 'none';
            }
        });
        isAnyMobileMenuOpen = false;
        currentlyOpenMobileMenu = null;
    }
    
    // Function to close specific mobile menu
    function closeSpecificMobileMenu(menuSelector) {
        const menu = document.querySelector(menuSelector);
        if (menu && menu.closest('.menu-item, ul.menu-level-1')) {
            menu.style.opacity = '0';
            menu.style.visibility = 'hidden';
            menu.style.display = 'none';
        }
        isAnyMobileMenuOpen = false;
        currentlyOpenMobileMenu = null;
    }
    
    // Function to open specific mobile menu
    function openMobileMenu(menuSelector) {
        // Only open mobile menus in mobile view
        if (!isMobileView()) return;
        
        const menu = document.querySelector(menuSelector);
        if (menu) {
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
            currentlyOpenMobileMenu = menuSelector;
        }
    }
    
    // Mobile click handlers with toggle functionality
    if (mobileMenuItems.length > 0) {
        mobileMenuItems.forEach((item, index) => {
            item.addEventListener('click', function(event) {
                // Only handle mobile clicks in mobile view
                if (!isMobileView()) return;
                
                console.log('Mobile item clicked:', index);
                
                if (index < 2 || index === 3) {
                    event.preventDefault();
                    event.stopPropagation();
                    
                    let menuSelector;
                    if (index < 2) {
                        menuSelector = mobileMenuSections[index];
                    } else if (index === 3) {
                        menuSelector = mobileMenuSections[2];
                    }
                    
                    // Check if this mobile menu is already open
                    if (currentlyOpenMobileMenu === menuSelector) {
                        closeSpecificMobileMenu(menuSelector);
                        console.log('Mobile: Closing menu (same trigger clicked)');
                    } else {
                        closeAllMobileMenus();
                        openMobileMenu(menuSelector);
                        console.log('Mobile: Opening menu', menuSelector);
                    }
                }
            });
        });
    }
    
    // Mobile close when clicking outside
    document.addEventListener('click', function(event) {
        if (!isMobileView()) return;
        
        const isMobileMenuItem = event.target.closest('.menu-item');
        const isMobileMenuSection = event.target.closest('[id^="shopify-section-sections--18072930287678__mega_menu"]');
        
        if (!isMobileMenuItem && !isMobileMenuSection && isAnyMobileMenuOpen) {
            closeAllMobileMenus();
        }
    });
    
    // Mobile drawer observer
    const mobileDrawer = document.querySelector('.drawer, [data-mobile-drawer]');
    if (mobileDrawer) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.attributeName === 'class' || mutation.attributeName === 'style') {
                    if (mobileDrawer.style.display === 'none' || mobileDrawer.classList.contains('hidden')) {
                        closeAllMobileMenus();
                    }
                }
            });
        });
        
        observer.observe(mobileDrawer, { attributes: true });
    }
});