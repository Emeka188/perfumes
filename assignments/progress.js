// Get the progress bar and label elements
const progressBar = document.getElementById('progress-bar');
const progressLabel = document.getElementById('progress-label');

progressBar.value = 0;
// Function to change the progress value
function changeProgress(amount) {
    // Get the current value and max value
    let currentValue = parseInt(progressBar.value);
    const maxValue = parseInt(progressBar.max);

    // Calculate the new value
    let newValue = currentValue + amount;

    // Ensure the value stays within the 0 to max range
    if (newValue > maxValue) {
        newValue = maxValue;
    } else if (newValue < 0) {
        newValue = 0;
    }

    // Update the progress bar's value attribute
    progressBar.value = newValue;

    // Update the label text to show the percentage
    progressLabel.textContent = `${newValue}%`;

    // Add an alert if min/max is reached (as seen in search results)
    if (newValue === maxValue && amount > 0) {
        alert("Oga e don do na!"); 
    } else if (newValue === 0 && amount < 0) {
        alert("E don do seh");
    }
}
