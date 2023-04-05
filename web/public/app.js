var rootmenu = document.getElementsByClassName("root-left-part")[0];
function show_or_hide_the_menubar(op = null) {
    if (op == true) {
        rootmenu.classList.add("show");
        return;
    } else if (op == false) {
        rootmenu.classList.remove("show");
        return;
    }
    if (rootmenu.classList.contains("show")) {
        rootmenu.classList.remove("show");
    } else {
        rootmenu.classList.add("show");
    }
}