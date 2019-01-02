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
    var quantityInput = document.getElementById("money-to-spend");
    var categoryInput = document.getElementById("category-spent");
    var descriptionInput = document.getElementById("spend-description");
    var magicButtons = document.querySelectorAll('.magic-button');
    var todayTotalSpent = document.getElementById("spent-number");
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
            quantityInput.value,
            categoryInput.value,
            descriptionInput.value
        );
    });

    socket.on('expense-inserted', (response) => {
        if (!response.success) {
            M.toast({ html: "Error, could not registered new expense." });
            return;
        }
        todayTotalSpent.innerHTML = response.total;
        quantityInput.value = '';
        categoryInput.value = '';
        descriptionInput.value = '';
        M.updateTextFields();
        M.toast({ html: response.message, displayLength: 1000 });
    });

    magicButtons.forEach(magicButton => magicButton.addEventListener("click", function () {
        newExpense(
            this.dataset.quantity,
            this.dataset.category,
            this.dataset.description
        );
    }));

    function newExpense(quantity, category, description) {
        socket.emit('new-expense', {
            date: new Date(),
            quantity: parseInt(quantity),
            category: category,
            description: description
        });
    }
}