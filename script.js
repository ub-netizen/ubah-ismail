const tabButtons = document.querySelectorAll(".tab-button");
const tabContents = document.querySelectorAll(".tab-content");

function showTab(tabName, updateUrl = true) {
    const selectedContent = document.getElementById(tabName);

    if (!selectedContent) return;

    tabButtons.forEach((button) => {
        button.classList.toggle(
            "active",
            button.dataset.tab === tabName
        );
    });

    tabContents.forEach((content) => {
        content.classList.toggle(
            "active",
            content.id === tabName
        );
    });

    if (updateUrl) {
        history.replaceState(null, "", `#${tabName}`);
    }
}

tabButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
        event.preventDefault();

        showTab(button.dataset.tab);

        if (window.innerWidth <= 700) {
            document.querySelector("main").scrollIntoView({
                behavior: "smooth"
            });
        }
    });
});

const startingTab = window.location.hash.replace("#", "");

if (startingTab && document.getElementById(startingTab)) {
    showTab(startingTab, false);
}

const progressBar = document.getElementById("progressBar");
const scrollTopButton = document.getElementById("scrollTop");

function updateScrollUi() {
    const scrollTop =
        document.body.scrollTop ||
        document.documentElement.scrollTop;

    const scrollHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

    progressBar.style.width = `${
        scrollHeight ? (scrollTop / scrollHeight) * 100 : 0
    }%`;

    scrollTopButton.classList.toggle(
        "visible",
        scrollTop > 300
    );
}

window.addEventListener("scroll", updateScrollUi, {
    passive: true
});

scrollTopButton.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

updateScrollUi();
