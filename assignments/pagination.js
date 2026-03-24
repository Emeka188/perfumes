document.addEventListener('DOMContentLoaded', () => {
    const contentContainer = document.getElementById('content');
    const paginationContainer = document.getElementById('pagination');
    const itemsPerPage = 5;
    let currentPage = 1;

    // Sample data (replace with your actual data, e.g., from an API)
    const data = [
        "Item 1: This is the first sample text entry.",
        "Item 2: This entry is second in the list, demonstrating how items are paginated.",
        "Item 3: Here is a third piece of sample text for the example.",
        "Item 4: The fourth item is here to fill out the first page of content.",
        "Item 5: The fifth item marks the end of the first page.",
        "Item 6: The sixth item will appear on the second page.",
        "Item 7: This is the seventh item, continuing the list.",
        "Item 8: The eighth item is used for demonstration purposes.",
        "Item 9: This is the ninth and penultimate item for this example.",
        "Item 10: The tenth item finishes the list and the second page.",
        "Item 11: This is the eleventh item, expanding the pagination demo.",
        "Item 12: The twelfth item adds more content to the third page.",
        "Item 13: Here is the thirteenth piece of sample text.",
        "Item 14: The fourteenth item continues the list.",
        "Item 15: The fifteenth item marks the end of the third page.",
        "Item 16: The sixteenth item starts the fourth page.",
        "Item 17: This is the seventeenth item in the sequence.",
        "Item 18: The eighteenth item is here for demonstration.",
        "Item 19: This is the nineteenth and almost last item.",
        "Item 20: The twentieth item completes the list and the fourth page.",
    ];

    const totalPages = Math.ceil(data.length / itemsPerPage);

    function displayPage(page) {
        contentContainer.innerHTML = ''; // Clear current content
        currentPage = page;

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const itemsToShow = data.slice(startIndex, endIndex);

        itemsToShow.forEach(itemText => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('item');
            itemDiv.textContent = itemText;
            contentContainer.appendChild(itemDiv);
        });
        
        updatePaginationControls();
    }

    function updatePaginationControls() {
        paginationContainer.innerHTML = ''; // Clear existing buttons

        // Previous button
        const prevButton = createPaginationButton('Prev', currentPage > 1, () => displayPage(currentPage - 1));
        paginationContainer.appendChild(prevButton);

        // Page number buttons
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = createPaginationButton(i, true, () => displayPage(i));
            if (i === currentPage) {
                pageButton.classList.add('active');
            }
            paginationContainer.appendChild(pageButton);
        }

        // Next button
        const nextButton = createPaginationButton('Next', currentPage < totalPages, () => displayPage(currentPage + 1));
        paginationContainer.appendChild(nextButton);
    }

    function createPaginationButton(text, isEnabled, eventHandler) {
        const button = document.createElement('a');
        button.href = '#';
        button.textContent = text;
        button.classList.add('page-button');

        if (isEnabled) {
            button.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent default anchor link behavior
                eventHandler();
            });
        } else {
            button.style.opacity = '0.5'; // Visually disable the button
            button.style.cursor = 'not-allowed';
        }
        return button;
    }

    // Initialize the first page on load
    displayPage(1);
});
