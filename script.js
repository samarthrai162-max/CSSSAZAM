
/* =========================================
   CHILDREN SENIOR SECONDARY SCHOOL
   WEBSITE INTERACTIONS
========================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================
       1. MOBILE NAVIGATION
    ===================================== */

    const menuToggle = document.getElementById("menu-toggle");
    const navigation = document.getElementById("navigation");

    if (menuToggle && navigation) {

        function closeMenu() {
            menuToggle.classList.remove("active");
            navigation.classList.remove("active");

            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Open navigation");
        }

        function openMenu() {
            menuToggle.classList.add("active");
            navigation.classList.add("active");

            menuToggle.setAttribute("aria-expanded", "true");
            menuToggle.setAttribute("aria-label", "Close navigation");
        }

        menuToggle.addEventListener("click", () => {

            const isOpen = navigation.classList.contains("active");

            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }

        });

        // Close menu after clicking a link

        navigation.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", closeMenu);

        });

        // Close menu when clicking outside

        document.addEventListener("click", event => {

            const clickedInside =
                navigation.contains(event.target) ||
                menuToggle.contains(event.target);

            if (!clickedInside) {
                closeMenu();
            }

        });

        // Close menu using Escape key

        document.addEventListener("keydown", event => {

            if (event.key === "Escape") {
                closeMenu();
            }

        });

        // Close menu when screen becomes desktop size

        window.addEventListener("resize", () => {

            if (window.innerWidth > 760) {
                closeMenu();
            }

        });

    }


    /* =====================================
       2. ACTIVE NAVIGATION
    ===================================== */

    const currentPage =
        window.location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll(".navigation a").forEach(link => {

        const linkPage = link.getAttribute("href");

        if (linkPage === currentPage) {

            link.classList.add("active");

        } else {

            link.classList.remove("active");

        }

    });


    /* =====================================
       3. SCROLL REVEAL ANIMATION
    ===================================== */

    const revealElements = document.querySelectorAll(
        ".quick-card, .about-image, .about-content, " +
        ".highlight-card, .gallery-item, .admission-cta, " +
        ".section-heading"
    );

    revealElements.forEach(element => {

        element.classList.add("reveal");

    });

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if ("IntersectionObserver" in window && !reducedMotion) {

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("show");

                        observer.unobserve(entry.target);

                    }

                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -35px 0px"
            }
        );

        revealElements.forEach(element => {

            revealObserver.observe(element);

        });

    } else {

        revealElements.forEach(element => {

            element.classList.add("show");

        });

    }


    /* =====================================
       4. IMAGE ERROR HANDLING
    ===================================== */

    document.querySelectorAll("img").forEach(image => {

        image.addEventListener("error", () => {

            image.classList.add("image-error");

            image.alt = "Image currently unavailable";

        });

    });


    /* =====================================
       5. SMOOTH SCROLL
    ===================================== */

    document.querySelectorAll('a[href^="#"]').forEach(link => {

        link.addEventListener("click", event => {

            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);

            if (target) {

                event.preventDefault();

                target.scrollIntoView({
                    behavior: reducedMotion ? "auto" : "smooth",
                    block: "start"
                });

            }

        });

    });


    /* =====================================
       6. CONSOLE MESSAGE
    ===================================== */

    console.log(
        "%c CHILDREN SENIOR SECONDARY SCHOOL ",
        "background:#c5a253;color:white;padding:10px;font-weight:bold;"
    );

    console.log(
        "Website Concept Loaded Successfully."
    );

});
