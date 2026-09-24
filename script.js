document.addEventListener("DOMContentLoaded", () => {
    const tabButtons = document.querySelectorAll(".tab-button");
    const tabContents = document.querySelectorAll(".tab-content");
    const progressBar = document.getElementById("progressBar");
    const scrollTopButton = document.getElementById("scrollTop");

    const tabAliases = {
        leadership: "extracurriculars",
        extracurriculars: "leadership"
    };

    function showTab(tabName, updateUrl = true) {
        const resolvedTabName = document.getElementById(tabName)
            ? tabName
            : tabAliases[tabName];

        const selectedContent =
            document.getElementById(resolvedTabName);

        if (!selectedContent) {
            console.error(`No section found for tab: ${tabName}`);
            return;
        }

        tabButtons.forEach((button) => {
            const buttonTab = button.getAttribute("data-tab");

            button.classList.toggle(
                "active",
                buttonTab === tabName ||
                buttonTab === resolvedTabName
            );
        });

        tabContents.forEach((content) => {
            content.classList.toggle(
                "active",
                content.id === resolvedTabName
            );
        });

        if (updateUrl) {
            history.replaceState(null, "", `#${tabName}`);
        }
    }

    tabButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
            event.preventDefault();

            const tabName = button.getAttribute("data-tab");
            showTab(tabName);

            if (window.innerWidth <= 700) {
                document.querySelector("main").scrollIntoView({
                    behavior: "smooth"
                });
            }
        });
    });

    const startingTab = window.location.hash.replace("#", "");

    if (startingTab) {
        showTab(startingTab, false);
    }

    window.addEventListener("hashchange", () => {
        const tabName = window.location.hash.replace("#", "");

        if (tabName) {
            showTab(tabName, false);
        }
    });

    function updateScrollUi() {
        const scrollTop =
            document.body.scrollTop ||
            document.documentElement.scrollTop;

        const scrollHeight =
            document.documentElement.scrollHeight -
            document.documentElement.clientHeight;

        if (progressBar) {
            progressBar.style.width = `${
                scrollHeight
                    ? (scrollTop / scrollHeight) * 100
                    : 0
            }%`;
        }

        if (scrollTopButton) {
            scrollTopButton.classList.toggle(
                "visible",
                scrollTop > 300
            );
        }
    }

    window.addEventListener("scroll", updateScrollUi, {
        passive: true
    });

    if (scrollTopButton) {
        scrollTopButton.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    updateScrollUi();
});
