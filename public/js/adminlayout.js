
document.addEventListener('DOMContentLoaded', function() {
    var dropdowns = document.querySelectorAll('#headeradmin .nav-menu ul li a[href="#"]');

    dropdowns.forEach(function(dropdown) {
        dropdown.addEventListener('click', function(event) {
            event.preventDefault();
            var dropdownContent = this.nextElementSibling;
            if (dropdownContent.style.display === "block") {
                dropdownContent.style.display = "none";
            } else {
                dropdownContent.style.display = "block";
            }
        });
    });
});
