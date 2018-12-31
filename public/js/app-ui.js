(function () {
    var modals = document.querySelectorAll('.modal');
    var navs = document.querySelectorAll('.sidenav');
    var tabs = document.getElementById('tabs');
    var floatingButton = document.getElementById('floating-button');
    var tooltips = document.querySelectorAll('.tooltipped');

    M.Modal.init(modals);
    M.Sidenav.init(navs, {});
    M.Tabs.init(tabs)
    M.FloatingActionButton.init(floatingButton);
    M.Tooltip.init(tooltips);
})();