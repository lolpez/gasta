window.onload = function () {
    var loader = document.getElementById('loader');
    var navbar = document.getElementById('navbar');
    var content = document.getElementById('content');
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
    loader.style.display = 'none';
    navbar.style.display = 'block';
    content.style.display = 'block';
    var socket = io("/index");

    socket.emit('hi', {
        date: new Date(),
        cuantity: 10,
        user: "Luis"
    });

    socket.on('inserted', (object) => {
        M.toast({
            html: `Date: ${object.date}, Cuantity: ${object.cuantity}, User: ${object.user}`,
            displayLength: 10000
        });
    });
}