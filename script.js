/* =========================================================
   CSSSAZAM V2.0 — ACCESSIBLE WEBSITE INTERACTIONS
   No external libraries or data collection.
========================================================= */
"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.getElementById("menu-toggle");
    const navigation = document.getElementById("navigation");
    const mobileQuery = window.matchMedia("(max-width: 760px)");

    // Mobile navigation
    if (menuToggle && navigation) {
        const setMenu = (open) => {
            navigation.classList.toggle("active", open);
            menuToggle.classList.toggle("active", open);
            menuToggle.setAttribute("aria-expanded", String(open));
            menuToggle.setAttribute(
                "aria-label",
                open ? "Close navigation" : "Open navigation"
            );
        };

        menuToggle.addEventListener("click", (event) => {
            event.stopPropagation();
            setMenu(!navigation.classList.contains("active"));
        });

        navigation.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => setMenu(false));
        });

        document.addEventListener("click", (event) => {
            const clickedInsideMenu =
                navigation.contains(event.target) ||
                menuToggle.contains(event.target);

            if (!clickedInsideMenu) setMenu(false);
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                setMenu(false);
                menuToggle.focus();
            }
        });

        const handleViewportChange = () => {
            if (!mobileQuery.matches) setMenu(false);
        };

        if (typeof mobileQuery.addEventListener === "function") {
            mobileQuery.addEventListener("change", handleViewportChange);
        } else if (typeof mobileQuery.addListener === "function") {
            mobileQuery.addListener(handleViewportChange);
        }
    }

    // Mark the current page in the main navigation.
    const currentPage = (
        window.location.pathname.split("/").filter(Boolean).pop() || "index.html"
    ).toLowerCase();

    document.querySelectorAll(".navigation a").forEach((link) => {
        const href = (link.getAttribute("href") || "").split("#")[0].toLowerCase();
        const isCurrent = href === currentPage ||
            (currentPage === "" && href === "index.html");

        link.classList.toggle("active", isCurrent);

        if (isCurrent) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }
    });

    // Gallery category filters.
    const galleryFilters = document.querySelectorAll(".gallery-filter");
    const galleryItems = document.querySelectorAll(".gallery-item");

    if (galleryFilters.length && galleryItems.length) {
        galleryFilters.forEach((filterButton) => {
            filterButton.addEventListener("click", () => {
                const selected = filterButton.dataset.filter || "all";

                galleryFilters.forEach((button) => {
                    const active = button === filterButton;
                    button.classList.toggle("active", active);
                    button.setAttribute("aria-pressed", String(active));
                });

                galleryItems.forEach((item) => {
                    const matches = selected === "all" ||
                        item.dataset.category === selected;
                    item.hidden = !matches;
                });
            });
        });

        galleryFilters.forEach((button) => {
            button.setAttribute(
                "aria-pressed",
                String(button.classList.contains("active"))
            );
        });
    }

    // Demo forms: deliberately do not send or store personal information.
    const demoForms = [
        {
            id: "admission-form",
            message: "This is a website demo. Your admission enquiry has not been sent or stored."
        },
        {
            id: "contact-form",
            message: "This is a website demo. Your message has not been sent or stored."
        }
    ];

    demoForms.forEach(({ id, message }) => {
        const form = document.getElementById(id);
        if (!form) return;

        form.addEventListener("submit", (event) => {
            event.preventDefault();

            if (!form.reportValidity()) return;

            let status = form.querySelector(".demo-form-status");
            if (!status) {
                status = document.createElement("p");
                status.className = "demo-form-status";
                status.setAttribute("role", "status");
                status.setAttribute("aria-live", "polite");
                form.appendChild(status);
            }

            status.textContent = message;
            status.style.cssText =
                "margin-top:14px;padding:12px 14px;border-radius:10px;" +
                "background:#f6f0e3;color:#6f5728;font-size:13px;line-height:1.6;";
            form.reset();
        });
    });

    // Reveal animations only when the browser supports them and motion is allowed.
    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const revealElements = document.querySelectorAll(
        ".quick-card, .about-image, .about-content, .highlight-card, " +
        ".gallery-item, .admission-cta, .section-heading, .process-card, " +
        ".class-card, .fee-extra-card, .contact-card"
    );

    if ("IntersectionObserver" in window && !reduceMotion) {
        const observer = new IntersectionObserver((entries, activeObserver) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("show");
                    activeObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: "0px 0px -25px 0px"
        });

        revealElements.forEach((element) => {
            element.classList.add("reveal");
            observer.observe(element);
        });
    } else {
        revealElements.forEach((element) => {
            element.classList.add("show");
        });
    }

    // Mark unavailable images without changing their descriptive alt text.
    document.querySelectorAll("img").forEach((image) => {
        image.addEventListener("error", () => {
            image.classList.add("image-error");
            image.setAttribute("data-image-error", "true");
        }, { once: true });
    });

    // Smooth, brief transition between this site's local HTML pages.
    // External links, downloads, new-tab links and in-page anchors keep native behavior.
    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!prefersReducedMotion) {
        document.documentElement.classList.add("page-transitions");

        document.querySelectorAll('a[href]').forEach((link) => {
            link.addEventListener("click", (event) => {
                if (event.defaultPrevented || event.button !== 0 ||
                    event.metaKey || event.ctrlKey || event.shiftKey || event.altKey ||
                    link.target === "_blank" || link.hasAttribute("download")) return;

                const rawHref = link.getAttribute("href");
                if (!rawHref || rawHref.startsWith("#") || rawHref.startsWith("mailto:") ||
                    rawHref.startsWith("tel:") || rawHref.startsWith("javascript:")) return;

                let destination;
                try { destination = new URL(rawHref, window.location.href); }
                catch (_) { return; }

                if (destination.origin !== window.location.origin ||
                    destination.pathname === window.location.pathname) return;

                const isLocalPage = /\.html?$/i.test(destination.pathname) ||
                    destination.pathname.endsWith("/");
                if (!isLocalPage) return;

                event.preventDefault();
                document.body.classList.add("page-leaving");
                window.setTimeout(() => {
                    window.location.href = destination.href;
                }, 160);
            });
        });
    }

    // Smooth scrolling for valid on-page anchors.
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");
            if (!targetId || targetId === "#") return;

            const target = document.getElementById(targetId.slice(1));
            if (!target) return;

            event.preventDefault();
            target.scrollIntoView({
                behavior: reduceMotion ? "auto" : "smooth",
                block: "start"
            });
        });
    });
});
