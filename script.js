document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // loader: Premium Page Loading Fadeout
    // ==========================================================================
    const loader = document.querySelector('.loader-overlay');
    if (loader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 600);
            }, 400); // Small initial lag for aesthetics
        });
        
        // Fallback if load event doesn't fire fast enough
        setTimeout(() => {
            if (loader.style.display !== 'none') {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 600);
            }
        }, 3000);
    }

    // ==========================================================================
    // sticky Header scroll state
    // ==========================================================================
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // ==========================================================================
    // Mobile Navigation Drawer Toggle
    // ==========================================================================
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (navToggle && mobileMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('open');
            mobileMenu.classList.toggle('open');
            // Prevent background scrolling when menu is open
            document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : 'auto';
        });

        // Close mobile menu on clicking a nav link
        const mobileLinks = mobileMenu.querySelectorAll('.nav-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('open');
                mobileMenu.classList.remove('open');
                document.body.style.overflow = 'auto';
            });
        });
    }

    // ==========================================================================
    // Active Link Highlighter based on Current Filename
    // ==========================================================================
    const currentPath = window.location.pathname;
    const pageFilename = currentPath.substring(currentPath.lastIndexOf('/') + 1);
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (
            (pageFilename === '' && linkHref === 'index.html') ||
            (pageFilename === 'index.html' && linkHref === 'index.html') ||
            (linkHref && pageFilename.includes(linkHref) && linkHref !== 'index.html')
        ) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // ==========================================================================
    // Typewriter Subtitle Animation (Framer Motion style delay loop)
    // ==========================================================================
    const subtitleEl = document.querySelector('.hero-subtitle-text');
    if (subtitleEl) {
        const words = [
            "Frontend Developer",
            "CRO & A/B Testing Specialist",
            "QA & Optimization Engineer"
        ];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeDelay = 100;
        
        function typeEffect() {
            const currentWord = words[wordIndex];
            
            if (isDeleting) {
                subtitleEl.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                typeDelay = 50; // Deletes faster
            } else {
                subtitleEl.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                typeDelay = 120; // Natural typing speed
            }
            
            // Handle Word Boundaries
            if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true;
                typeDelay = 2000; // Hold full word before deleting
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeDelay = 500; // Pause briefly before starting new word
            }
            
            setTimeout(typeEffect, typeDelay);
        }
        
        setTimeout(typeEffect, 1000);
    }

    // ==========================================================================
    // Intersection Observer: Scroll Reveal Animations
    // ==========================================================================
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    // Once animated, no need to keep observing
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px' // Trigger slightly before element enters viewport
        });
        
        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    }

    // ==========================================================================
    // Stats Counter Animation (Triggers when scrolled into view)
    // ==========================================================================
    const statsSection = document.querySelector('.stats-grid');
    const statNumbers = document.querySelectorAll('.stat-number-val');
    
    if (statsSection && statNumbers.length > 0) {
        let animated = false;
        
        const statsObserver = new IntersectionObserver((entries) => {
            const entry = entries[0];
            if (entry.isIntersecting && !animated) {
                animated = true;
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-target'), 10);
                    const suffix = stat.getAttribute('data-suffix') || '';
                    const duration = 2000; // 2 seconds animation
                    const startTime = performance.now();
                    
                    function updateCounter(currentTime) {
                        const elapsedTime = currentTime - startTime;
                        const progress = Math.min(elapsedTime / duration, 1);
                        
                        // Ease out quad formula for smooth decelerating
                        const easeProgress = progress * (2 - progress);
                        const currentValue = Math.floor(easeProgress * target);
                        
                        stat.textContent = currentValue + suffix;
                        
                        if (progress < 1) {
                            requestAnimationFrame(updateCounter);
                        } else {
                            stat.textContent = target + suffix;
                        }
                    }
                    
                    requestAnimationFrame(updateCounter);
                });
            }
        }, { threshold: 0.3 });
        
        statsObserver.observe(statsSection);
    }

    // ==========================================================================
    // Accordion: Projects Case Studies
    // ==========================================================================
    const caseStudyTriggers = document.querySelectorAll('.case-study-trigger');
    caseStudyTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const parentItem = trigger.closest('.case-study-item');
            const contentPanel = parentItem.querySelector('.case-study-content');
            const isOpen = parentItem.classList.contains('open');
            
            // Close all other open case studies first for cleaner UI
            document.querySelectorAll('.case-study-item').forEach(item => {
                if (item !== parentItem) {
                    item.classList.remove('open');
                    item.querySelector('.case-study-content').style.maxHeight = null;
                }
            });
            
            if (isOpen) {
                parentItem.classList.remove('open');
                contentPanel.style.maxHeight = null;
            } else {
                parentItem.classList.add('open');
                // Set max-height to its scrollHeight for smooth transition animation
                contentPanel.style.maxHeight = contentPanel.scrollHeight + 'px';
            }
        });
    });

    // ==========================================================================
    // Form verification and Submission UI mockup
    // ==========================================================================
    const contactForm = document.getElementById('contact-form');
    const statusMsg = document.querySelector('.form-message-status');
    
    if (contactForm && statusMsg) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('.form-submit-btn');
            const originalText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = 'Sending message <i class="fas fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Format WhatsApp Message
            const waPhone = "918534972633";
            const waText = encodeURIComponent(`Hi Sachin, my name is ${name} (${email}).\nSubject: ${subject}\n\n${message}`);
            const waUrl = `https://wa.me/${waPhone}?text=${waText}`;
            
            // Format Email Message
            const mailToUrl = `mailto:sidharthsinghgh@gmail.com?subject=${encodeURIComponent(subject)}&body=${waText}`;
            
            // Open links after a brief delay for UX
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Open WhatsApp in new tab
                window.open(waUrl, '_blank');
                // Open default email client
                window.location.href = mailToUrl;
                
                // Show success status message
                statusMsg.textContent = "Opening WhatsApp and your Email client...";
                statusMsg.className = "form-message-status success";
                statusMsg.style.display = 'block';
                
                // Reset form inputs
                contactForm.reset();
                
                // Hide message after 5 seconds
                setTimeout(() => {
                    statusMsg.style.display = 'none';
                }, 5000);
            }, 800);
        });
    }

    // ==========================================================================
    // Before/After comparison sliders
    // ==========================================================================
    const sliders = document.querySelectorAll('.before-after-slider');
    
    function updateSliderImageWidth(slider) {
        const imgAfter = slider.querySelector('.img-after');
        if (imgAfter) {
            imgAfter.style.width = slider.offsetWidth + 'px';
        }
    }

    sliders.forEach(slider => {
        const range = slider.querySelector('.slider-range');
        const afterWrapper = slider.querySelector('.img-after-wrapper');
        const handle = slider.querySelector('.slider-handle');
        
        if (range && afterWrapper && handle) {
            const updateSlider = () => {
                const val = range.value;
                afterWrapper.style.width = `${val}%`;
                handle.style.left = `${val}%`;
            };
            
            range.addEventListener('input', updateSlider);
            range.addEventListener('change', updateSlider);
            
            // Set initial widths and values
            updateSlider();
            updateSliderImageWidth(slider);
            
            // Sync on load event
            window.addEventListener('load', () => {
                updateSliderImageWidth(slider);
            });
        }
    });

    // Make sure image widths resize dynamically when screen dimensions change
    window.addEventListener('resize', () => {
        sliders.forEach(slider => {
            updateSliderImageWidth(slider);
        });
    });

    // ==========================================================================
    // Dynamic Case Study Modal Interactions
    // ==========================================================================
    const openModalButtons = document.querySelectorAll('.btn-case-study');
    const modals = document.querySelectorAll('.case-study-modal');
    
    openModalButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            if (targetId) {
                const targetModal = document.querySelector(targetId);
                if (targetModal) {
                    targetModal.classList.add('open');
                    document.body.style.overflow = 'hidden'; // prevent scrolling behind modal
                }
            }
        });
    });

    modals.forEach(modal => {
        const closeModalBtn = modal.querySelector('.modal-close');
        const modalOverlay = modal.querySelector('.modal-overlay');
        
        const closeModal = () => {
            modal.classList.remove('open');
            // Check if any other modal is open before restoring scroll
            const anyOpen = Array.from(modals).some(m => m.classList.contains('open'));
            if (!anyOpen) {
                document.body.style.overflow = 'auto';
            }
        };

        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', closeModal);
        }
        if (modalOverlay) {
            modalOverlay.addEventListener('click', closeModal);
        }
    });

    // Close open modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.case-study-modal.open');
            if (openModal) {
                openModal.classList.remove('open');
                document.body.style.overflow = 'auto';
            }
        }
    });

    // ==========================================================================
    // Horizontal Carousel Logic for BCA College Project
    // ==========================================================================
    const carousels = document.querySelectorAll('.carousel-slider');
    
    carousels.forEach(carousel => {
        const slidesContainer = carousel.querySelector('.carousel-slides');
        const slides = carousel.querySelectorAll('.carousel-slide-item');
        const prevBtn = carousel.querySelector('.prev-btn');
        const nextBtn = carousel.querySelector('.next-btn');
        const dots = carousel.querySelectorAll('.carousel-dot');
        
        let currentIndex = 0;
        const totalSlides = slides.length;
        let autoSlideInterval;
        
        const updateCarousel = (index) => {
            // Boundary checks
            if (index < 0) {
                currentIndex = totalSlides - 1;
            } else if (index >= totalSlides) {
                currentIndex = 0;
            } else {
                currentIndex = index;
            }
            
            // Translate the slides container
            slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
            
            // Update active dot
            dots.forEach((dot, idx) => {
                if (idx === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        };
        
        // Navigation buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                updateCarousel(currentIndex - 1);
                resetAutoSlide();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                updateCarousel(currentIndex + 1);
                resetAutoSlide();
            });
        }
        
        // Dot indicators click events
        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const targetIndex = parseInt(dot.getAttribute('data-slide'), 10);
                updateCarousel(targetIndex);
                resetAutoSlide();
            });
        });
        
        // Auto sliding functionality
        const startAutoSlide = () => {
            autoSlideInterval = setInterval(() => {
                updateCarousel(currentIndex + 1);
            }, 4000);
        };
        
        const stopAutoSlide = () => {
            clearInterval(autoSlideInterval);
        };
        
        const resetAutoSlide = () => {
            stopAutoSlide();
            startAutoSlide();
        };
        
        // Start auto slide initially
        startAutoSlide();
        
        // Pause auto slide on mouse enter/hover and resume on leave
        carousel.addEventListener('mouseenter', stopAutoSlide);
        carousel.addEventListener('mouseleave', startAutoSlide);
    });
});

// ==========================================================================
// Fullscreen Image Expand Logic
// ==========================================================================
function openFullscreenSlider(btn) {
    const originalSlider = btn.closest('.before-after-slider');
    if (!originalSlider) return;

    const modal = document.getElementById('fullscreen-image-modal');
    const wrapper = modal.querySelector('.fullscreen-content-wrapper');
    
    // Clone the slider to show in modal
    const clonedSlider = originalSlider.cloneNode(true);
    // Remove the expand button from the clone
    const expandBtn = clonedSlider.querySelector('.expand-image-btn');
    if (expandBtn) expandBtn.remove();
    
    wrapper.innerHTML = '';
    wrapper.appendChild(clonedSlider);
    
    // Initialize the slider logic for the cloned element
    const range = clonedSlider.querySelector('.slider-range');
    const afterWrapper = clonedSlider.querySelector('.img-after-wrapper');
    const imgAfter = clonedSlider.querySelector('.img-after');
    const handle = clonedSlider.querySelector('.slider-handle');
    
    if (range && afterWrapper && handle && imgAfter) {
        const updateSlider = () => {
            const val = range.value;
            afterWrapper.style.width = `${val}%`;
            handle.style.left = `${val}%`;
        };
        
        range.addEventListener('input', updateSlider);
        range.addEventListener('change', updateSlider);
        
        // Use ResizeObserver to keep img-after width in sync with container
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                imgAfter.style.width = entry.contentRect.width + 'px';
            }
        });
        resizeObserver.observe(clonedSlider);
        
        // Initial setup
        requestAnimationFrame(() => {
            imgAfter.style.width = clonedSlider.offsetWidth + 'px';
            updateSlider();
        });
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function openFullscreenVertical(btn) {
    const mediaContainer = btn.closest('.project-media') || btn.closest('.vertical-scroll-container'); // fallback just in case
    if (!mediaContainer) return;
    
    const modal = document.getElementById('fullscreen-image-modal');
    const wrapper = modal.querySelector('.fullscreen-content-wrapper');
    
    const clonedContainer = mediaContainer.cloneNode(true);
    const expandBtn = clonedContainer.querySelector('.expand-image-btn');
    if (expandBtn) expandBtn.remove();
    
    const images = clonedContainer.querySelectorAll('img');
    images.forEach(img => {
        img.classList.remove('scroll-image');
        img.style.position = 'static';
        img.style.width = '100%';
        img.style.height = 'auto';
    });
    
    // Disable scrolling inside the modal since the wrapper itself scrolls
    const scrollInner = clonedContainer.classList.contains('vertical-scroll-container') ? clonedContainer : clonedContainer.querySelector('.vertical-scroll-container');
    if(scrollInner) {
        scrollInner.style.height = 'auto';
        scrollInner.style.overflow = 'visible';
    }
    
    // Add project-card class to wrapper to preserve switcher styles
    const group = document.createElement('div');
    group.className = 'project-card';
    group.style.background = 'transparent';
    group.style.boxShadow = 'none';
    group.style.padding = '0';
    group.style.height = 'auto';
    
    clonedContainer.style.height = 'auto';
    clonedContainer.style.overflow = 'visible';
    
    group.appendChild(clonedContainer);
    wrapper.innerHTML = '';
    wrapper.appendChild(group);
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('fullscreen-image-modal');
    if(modal) {
        const closeBtn = modal.querySelector('.modal-close');
        
        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
            setTimeout(() => {
                modal.querySelector('.fullscreen-content-wrapper').innerHTML = '';
            }, 300);
        };
        
        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
});

// ==========================================================================
// Vertical Auto-Scroll Logic
// ==========================================================================
function initAutoScroll() {
    const containers = document.querySelectorAll('.vertical-scroll-container');
    
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.dataset.isVisible = 'true';
            } else {
                entry.target.dataset.isVisible = 'false';
            }
        });
    }, { threshold: 0.1 });
    
    containers.forEach(container => {
        let scrollSpeed = 0.5;
        let isHovered = false;
        let isTouching = false;
        let direction = 1;
        
        scrollObserver.observe(container);
        
        const scrollFrame = () => {
            if (!isHovered && !isTouching && container.dataset.isVisible === 'true') {
                container.scrollTop += (scrollSpeed * direction);
                
                // Reverse direction at bounds
                if (container.scrollTop <= 0) {
                    direction = 1;
                } else if (container.scrollTop + container.clientHeight >= container.scrollHeight - 1) {
                    direction = -1;
                }
            }
            requestAnimationFrame(scrollFrame);
        };
        
        container.addEventListener('mouseenter', () => isHovered = true);
        container.addEventListener('mouseleave', () => isHovered = false);
        container.addEventListener('touchstart', () => isTouching = true, {passive: true});
        container.addEventListener('touchend', () => {
            setTimeout(() => { isTouching = false; }, 1000);
        });
        
        requestAnimationFrame(scrollFrame);
    });
}
document.addEventListener('DOMContentLoaded', initAutoScroll);

// ==========================================================================
// Project Image Switcher
// ==========================================================================
function switchProjectImage(btn, type) {
    const switcherContainer = btn.closest('.project-image-switcher');
    const projectCard = btn.closest('.project-card') || btn.closest('.glass-card');
    const scrollContainer = projectCard.querySelector('.vertical-scroll-container');
    
    if (!scrollContainer) return;
    
    // Update active button state
    const buttons = switcherContainer.querySelectorAll('.switcher-btn');
    buttons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Toggle images
    const imgBefore = scrollContainer.querySelector('.project-img-before');
    const imgAfter = scrollContainer.querySelector('.project-img-after');
    
    if (type === 'before') {
        if(imgBefore) imgBefore.style.display = 'block';
        if(imgAfter) imgAfter.style.display = 'none';
    } else {
        if(imgBefore) imgBefore.style.display = 'none';
        if(imgAfter) imgAfter.style.display = 'block';
    }
}

