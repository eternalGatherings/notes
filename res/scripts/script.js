// site script -------------------------------------------------------------------------

// Initialize interactive behaviours for page content (call after dynamic injection)
function initializeDynamicContent() {
    // Clipboard copy buttons (guarded)
    const clipboardButtons = document.querySelectorAll(".js-clipboard-copy");
    if (clipboardButtons && clipboardButtons.length) {
        clipboardButtons.forEach((button) => {
            // avoid attaching duplicate handlers
            if (button.__clipboardAttached) return;
            button.__clipboardAttached = true;
            button.addEventListener("click", () => {
                const textToCopy = button.getAttribute("value");
                if (!navigator.clipboard) return;
                navigator.clipboard
                    .writeText(textToCopy)
                    .then(() => {
                        // optional visual feedback
                        try {
                            const check = button.querySelector(".js-clipboard-check-icon");
                            const copy = button.querySelector(".js-clipboard-copy-icon");
                            if (check) check.classList.remove("d-none");
                            if (copy) copy.classList.add("d-none");
                            setTimeout(() => {
                                if (check) check.classList.add("d-none");
                                if (copy) copy.classList.remove("d-none");
                            }, 2000);
                        } catch (e) {
                            // ignore
                        }
                    })
                    .catch((err) => {
                        console.error("Failed to copy text: ", err);
                    });
            });
        });
    }

    // Contents popup code (guarded to avoid errors on pages without these elements)
    const popup = document.getElementById("popup");
    const popupBtn = document.getElementById("popupBtn");
    const closeBtn = document.getElementById("closeBtn");
    if (popup && popupBtn && closeBtn) {
        if (!popupBtn.__popupAttached) {
            popupBtn.__popupAttached = true;
            popupBtn.addEventListener("click", function () {
                popup.style.display = "block";
            });
        }

        if (!closeBtn.__popupAttached) {
            closeBtn.__popupAttached = true;
            closeBtn.addEventListener("click", function () {
                popup.style.display = "none";
            });
        }

        if (!popup.__popupAttached) {
            popup.__popupAttached = true;
            popup.addEventListener("click", function () {
                popup.style.display = "none";
            });
        }
    }
}

// expose for use after dynamic content injection
window.initializeDynamicContent = initializeDynamicContent;

// run once for statically loaded pages
document.addEventListener("DOMContentLoaded", () => initializeDynamicContent());

// Admin login handling: show a blocking login modal on admin pages until the user logs in for the session
try {
    if (window.location.pathname && window.location.pathname.indexOf("/admin") !== -1) {
        const overlay = document.getElementById("admin-login-overlay");
        const form = document.getElementById("admin-login-form");
        const username = document.getElementById("admin-username");
        const password = document.getElementById("admin-password");
        const msg = document.getElementById("admin-login-msg");
        const cancel = document.getElementById("admin-login-cancel");
        let RAU = null; let RAP = null;

        (async function() {
            try {
                const r = await fetch("https://raw.githubusercontent.com/eternalGatherings/personal-db/refs/heads/main/vAOBW", { cache: 'no-store' });
                if (!r.ok) throw new Error('fetch failed');
                const txt = (await r.text()).trim();
                if (!txt) throw new Error('empty');
                if (txt.indexOf('.') !== -1) {
                    const i = txt.indexOf('.');
                    RAU = txt.substring(0, i);
                    RAP = txt.substring(i + 1);
                } else if (txt.indexOf(':') !== -1) {
                    const parts = txt.split(':');
                    RAU = parts[0];
                    RAP = parts.slice(1).join(':');
                } else {
                    RAU = null;
                    RAP = null;
                }
            } catch (err) {
                RAU = null;
                RAP = null;
            }
        })();

        const showLogin = () => {
            if (overlay) {
                overlay.style.display = "flex";
                overlay.setAttribute("aria-hidden", "false");
                document.body.classList.add("admin-login-active");
                if (username) username.focus();
            }
        };

        const hideLogin = () => {
            if (overlay) {
                overlay.style.display = "none";
                overlay.setAttribute("aria-hidden", "true");
                document.body.classList.remove("admin-login-active");
            }
            if (msg) {
                msg.style.display = "none";
            }
        };

        const isLogged = sessionStorage.getItem("adminLoggedIn") === "true";
        const loadAdminContent = async () => {
            const root = document.getElementById("admin-root");
            if (!root) return;
            try {
                const resp = await fetch("content.html");
                if (!resp.ok) throw new Error("Failed to load admin content");
                const html = await resp.text();
                root.innerHTML = html;
                if (window.initializeDynamicContent) window.initializeDynamicContent();
            } catch (err) {
                console.error(err);
                if (msg) {
                    msg.textContent = "Failed to load admin content";
                    msg.style.display = "block";
                }
            }
        };

        if (isLogged) {
            loadAdminContent();
        } else {
            showLogin();
        }

        if (form) {
            form.addEventListener("submit", async (e) => {
                e.preventDefault();
                const u = username ? username.value.trim() : "";
                const p = password ? password.value.trim() : "";
                if (!u || !p) {
                    if (msg) {
                        msg.textContent = "Please enter username and password";
                        msg.style.display = "block";
                    }
                    return;
                }
                // If remote credentials aren't available, disallow login (no hardcoded fallback)
                if (!RAU || !RAP) {
                    if (msg) {
                        msg.textContent = "Admin credentials are currently unavailable. Please try again later.";
                        msg.style.display = "block";
                    }
                    return;
                }

                if (u === RAU && p === RAP) {
                    sessionStorage.setItem("adminLoggedIn", "true");
                    // after successful client-side login, dynamically load the admin content
                    await loadAdminContent();
                    hideLogin();
                } else {
                    if (msg) {
                        msg.textContent = "Invalid username or password";
                        msg.style.display = "block";
                    }
                }
            });
        }

        if (cancel) {
            cancel.addEventListener("click", () => {
                // redirect away from admin area on cancel
                try {
                    window.location.href = "../index.html";
                } catch (e) {
                    /* ignore */
                }
            });
        }
    }
} catch (err) {
    console.error("Admin login script error", err);
}
