// Function for Download E-Ticket
function downloadETicket() {
    alert("E-Ticket downloaded successfully!");
}

// Function for Cancel Booking
function cancelBooking() {
    const reason = document.getElementById('reason').value;
    if (!reason) {
        alert("Please select a reason for cancellation.");
        return;
    }

    const refundStatus = document.getElementById('refund-status');
    refundStatus.textContent = "Refund initiated. 50% will be refunded within 5-7 business days.";
    refundStatus.style.color = "green";
}

// Function for Redeem Points
function redeemPoints() {
    alert("Points redeemed successfully! You get 10% off on your next booking.");
}

// Function for Calculate Points
function calculatePoints() {
    const amount = document.getElementById('amount').value;
    if (!amount || amount < 0) {
        alert("Please enter a valid amount.");
        return;
    }

    const points = Math.floor(amount) * 100; // 100 points per $100
    const pointsResult = document.getElementById('points-result');
    pointsResult.textContent = `You will earn ${points} points!`;
    pointsResult.style.color = "green";
}

// Form Submission for Booking
document.getElementById('bookingForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Get form data
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const date = document.getElementById('date').value;
    const price = document.getElementById('price').value;

    // Mock booking details (you can replace these with dynamic values later)
    const bookingId = "123456";
    const cancellationPolicy = "50% refund if canceled within 24 hours.";

    // Prepare the request body
    const requestBody = {
        email: email,
        bookingId: bookingId,
        dates: date,
        price: parseInt(price), // Remove quotes and convert to number
        cancellationPolicy: cancellationPolicy,
        name: name
    };

    console.log("requestBody:", requestBody); //console log added.

    // Send the data to the backend API
    fetch('https://internship-backend-1-jcgd.onrender.com/send-booking-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    })
    .then(response => response.text())
    .then(data => {
        const bookingStatus = document.getElementById('booking-status');
        bookingStatus.textContent = `Booking confirmed for ${name} on ${date}. Confirmation sent to ${email}.`;
        bookingStatus.style.color = "green";
    })
    .catch(error => {
        console.error('Error:', error);
        const bookingStatus = document.getElementById('booking-status');
        bookingStatus.textContent = "Failed to send booking confirmation. Please try again.";
        bookingStatus.style.color = "red";
    });
});

// Dark Mode Toggle
const darkModeToggle = document.getElementById('dark-mode-toggle');
const body = document.body;
const icon = darkModeToggle.querySelector('i');

darkModeToggle.addEventListener('click', function () {
    body.classList.toggle('dark-mode');
    if (body.classList.contains('dark-mode')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
        darkModeToggle.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
    }
});