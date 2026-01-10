// Get dropdown elements
const dropdownBtn = document.querySelector('.dropdown-btn');
const dropdownContent = document.querySelector('.dropdown-content');

// Toggle dropdown on button click
dropdownBtn.addEventListener('click', function() {
    dropdownContent.classList.toggle('show');
    dropdownBtn.classList.toggle('active');
});

// Close dropdown when clicking on a link
const dropdownLinks = document.querySelectorAll('.dropdown-content a');
dropdownLinks.forEach(link => {
    link.addEventListener('click', function() {
        dropdownContent.classList.remove('show');
        dropdownBtn.classList.remove('active');
    });
});

// Close dropdown when clicking outside
window.addEventListener('click', function(event) {
    if (!event.target.matches('.dropdown-btn')) {
        if (dropdownContent.classList.contains('show')) {
            dropdownContent.classList.remove('show');
            dropdownBtn.classList.remove('active');
        }
    }
});
