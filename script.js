window.addEventListener('load', () => {
    // Dismiss preloader
    setTimeout(() => {
        document.body.classList.add('loaded');
        
        // Trigger initial video entrance animations after preloader clears
        gsap.to('.video-section .hook-line', { y: 0, opacity: 1, duration: 1.2, ease: "power4.out", delay: 0.2 });
        gsap.to('.video-section .video-wrapper', { y: 0, opacity: 1, duration: 1.2, ease: "power4.out", delay: 0.4 });
    }, 600);
});

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Initialize Lenis for Smooth Scrolling ("like cheese")
    const lenis = new Lenis({
        duration: 1.3,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);


    // 2. Register GSAP & ScrollTrigger Animations
    gsap.registerPlugin(ScrollTrigger);

    // Video Section initial entrance states before onload animation
    gsap.set(['.video-section .hook-line', '.video-section .video-wrapper'], { y: 60, opacity: 0 });

    // Stagger fade-up template for standard text or containers
    const fadeUpElements = document.querySelectorAll('.g-fade-up');
    fadeUpElements.forEach((el) => {
        // Skip elements animated on initial load to prevent visual stuttering
        if (el.closest('.video-section') && !el.classList.contains('video-discussion')) return;

        gsap.fromTo(el, 
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 88%", 
                    toggleActions: "play none none reverse"
                }
            }
        );
    });

    // Stagger animation for the 6-Grid Services
    gsap.fromTo('.services-grid .service-card', 
        { y: 60, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
                trigger: '.services-grid',
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        }
    );

    // Stagger animation for the Video Split Layout
    gsap.fromTo('.video-right-col .bundle-item-card', 
        { y: 40, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
                trigger: '.video-split-layout',
                start: "top 82%",
                toggleActions: "play none none reverse"
            }
        }
    );

    // Discussion checks animation
    gsap.fromTo('.discussion-item', 
        { x: -30, opacity: 0 },
        {
            x: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
                trigger: '.video-discussion',
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        }
    );

    // Expert section presentation staggers
    gsap.fromTo('.expert-image-col', 
        { scale: 0.95, opacity: 0 },
        {
            scale: 1,
            opacity: 1,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: '.expert-content',
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        }
    );

    gsap.fromTo('.expert-text-col > *', 
        { y: 30, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
                trigger: '.expert-text-col',
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        }
    );

    // Scale Up Animation for Pricing Card
    const scaleUpElements = document.querySelectorAll('.g-scale-up');
    scaleUpElements.forEach((el) => {
        gsap.fromTo(el, 
            { scale: 0.92, opacity: 0 },
            {
                scale: 1,
                opacity: 1,
                duration: 1,
                ease: "back.out(1.4)",
                scrollTrigger: {
                    trigger: el,
                    start: "top 82%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });


    // 3. FOMO Countdown Timer Logic
    // Set timer to count down from 2 hours, 45 minutes, 30 seconds
    let targetTime = new Date().getTime() + (2 * 60 * 60 * 1000) + (45 * 60 * 1000) + (30 * 1000);

    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    function updateTimer() {
        if (!hoursEl || !minutesEl || !secondsEl) return;

        const now = new Date().getTime();
        const distance = targetTime - now;

        if (distance < 0) {
            // Loop timer to keep the FOMO urgency alive
            targetTime = new Date().getTime() + (2 * 60 * 60 * 1000) + (45 * 60 * 1000) + (30 * 1000);
            return;
        }

        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        hoursEl.innerText = hours.toString().padStart(2, '0');
        minutesEl.innerText = minutes.toString().padStart(2, '0');
        secondsEl.innerText = seconds.toString().padStart(2, '0');
    }

    if (hoursEl && minutesEl && secondsEl) {
        setInterval(updateTimer, 1000);
        updateTimer();
    }


    // 4. FAQ Accordion Logic
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const isActive = question.classList.contains('active');
            
            // Close other open FAQ panels
            faqQuestions.forEach(q => {
                q.classList.remove('active');
                q.nextElementSibling.style.maxHeight = null;
            });

            // Toggle active panel
            if (!isActive) {
                question.classList.add('active');
                const answer = question.nextElementSibling;
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });

});
