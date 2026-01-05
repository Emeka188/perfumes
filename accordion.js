// Select all accordion headers
const accordionHeaders = document.querySelectorAll('.accordion-header');

accordionHeaders.forEach(header => {
  header.addEventListener('click', () => {
    const accordionItem = header.parentNode;
    accordionItem.classList.toggle('active');

    // Close other accordion items when one is opened.
    const allItems = document.querySelectorAll('.accordion-item');
    allItems.forEach(item => {
      if (item !== accordionItem && item.classList.contains('active')) {
        item.classList.remove('active');
      }
    });
  });
});
