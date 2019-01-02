window.onload = function () {
    var socket = io("/index");
    var loader = document.getElementById('loader');
    var navbar = document.getElementById('navbar');
    var content = document.getElementById('content');
    var modals = document.querySelectorAll('.modal');
    var navs = document.querySelectorAll('.sidenav');
    var tabs = document.getElementById('tabs');
    var floatingButton = document.getElementById('floating-button');
    var tooltips = document.querySelectorAll('.tooltipped');
    var selects = document.querySelectorAll('select');
    var submitButton = document.getElementById('submit-button');
    var cuantityInput = document.getElementById("money-to-spend");
    var categoryInput = document.getElementById("category-spent");
    var descriptionInput = document.getElementById("spend-description");
    var magicButtons = document.querySelectorAll('.magic-button');
    M.Modal.init(modals);
    M.Sidenav.init(navs, {});
    M.Tabs.init(tabs)
    M.FloatingActionButton.init(floatingButton);
    M.Tooltip.init(tooltips);
    M.FormSelect.init(selects);
    loader.style.display = 'none';
    navbar.style.display = 'block';
    content.style.display = 'block';

    submitButton.addEventListener('click', () => {
        newExpense(
            cuantityInput.value,
            categoryInput.value,
            descriptionInput.value
        );
    });

    socket.on('expense-inserted', (response) => {
        (response.success) ? M.toast({ html: response.message, displayLength: 1000 }) : M.toast({ html: "Error, could not registered new expense." });
        cuantityInput.value = '';
        categoryInput.value = '';
        descriptionInput.value = '';
        M.updateTextFields();
    });

    magicButtons.forEach(magicButton => magicButton.addEventListener("click", function () {
        newExpense(
            this.dataset.cuantity,
            this.dataset.category,
            this.dataset.description
        );
    }));

    function newExpense(cuantity, category, description) {
        socket.emit('new-expense', {
            date: new Date(),
            cuantity: cuantity,
            category: category,
            description: description
        });
    }
}