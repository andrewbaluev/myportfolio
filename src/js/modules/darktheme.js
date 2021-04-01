const darktheme = () => {
    const toggleTheme = document.querySelector("#toggle-theme");
    const html = document.documentElement;

    toggleTheme.addEventListener("click", function () {
        if (html.hasAttribute("theme")) {
            html.removeAttribute("theme");
        } else {
            html.setAttribute("theme", "dark");
        }
    });
};

export default darktheme;