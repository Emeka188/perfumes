function filterList() {
    // Declare variables
    let input, filter, ul, li, a, i, txtValue;
    input = document.getElementById('searchInput');
    filter = input.value.toUpperCase();
    ul = document.getElementById("myList");
    li = ul.getElementsByTagName('li');

    // Loop through all list items, and hide those who don't match the search list
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0]; // Get the <a> element inside the <li>
        txtValue = a.textContent || a.innerText; // Get the text content of the <a> element

        if (txtValue.toUpperCase().indexOf(filter) > -1) { //its like if(txt.value) just add its index properties
            li[i].style.display = ""; // Show the list item
        } else {
            li[i].style.display = "none"; // Hide the list item
        }
    }
}