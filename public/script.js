document.addEventListener('DOMContentLoaded', function() {
    const thursdayBtn = document.getElementById('thursdayBtn');
    const fridayBtn = document.getElementById('fridayBtn');
    const noBtn = document.getElementById('noBtn');
    const locationSelection = document.getElementById('locationSelection');
    const responseForm = document.getElementById('responseForm');
    const proposalForm = document.getElementById('proposalForm');
    const resultMessage = document.getElementById('resultMessage');
    const heartsContainer = document.querySelector('.floating-hearts');
    const locationBtns = document.querySelectorAll('.location-btn');
    const customLocationField = document.getElementById('customLocation');
    
    let selectedDate = '';
    let selectedLocation = '';
    let customLocation = '';
    
    // Create floating hearts
    createHearts();
    
    // Button event listeners
    thursdayBtn.addEventListener('click', function() {
        selectedDate = 'Thursday, September 25th';
        showLocationSelection();
    });
    
    fridayBtn.addEventListener('click', function() {
        selectedDate = 'Friday, September 26th';
        showLocationSelection();
    });
    
    noBtn.addEventListener('click', function() {
        selectedDate = 'none';
        showResponseForm("Thanks for letting me know! Maybe another time?");
    });
    
    // Location selection
    locationBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove selected class from all buttons
            locationBtns.forEach(b => b.classList.remove('selected'));
            // Add selected class to clicked button
            this.classList.add('selected');
            
            selectedLocation = this.getAttribute('data-location');
            showResponseForm("Great choice! Just a few more details...");
        });
    });
    
    // Custom location input
    customLocationField.addEventListener('input', function() {
        customLocation = this.value;
        selectedLocation = 'custom';
    });
    
    // Form submission
    proposalForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const contact = document.getElementById('contact').value;
        const message = document.getElementById('message').value;
        
        // Prepare data for submission
        const formData = {
            name: name,
            contact: contact,
            answer: selectedDate === 'none' ? 'No' : 'Yes',
            message: message,
            location: selectedLocation,
            customLocation: customLocation
        };
        
        // Send data to server
        fetch('/submit-response', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                responseForm.classList.add('hidden');
                resultMessage.classList.remove('hidden');
                
                // Create celebration effect for "Yes" response
                if (selectedDate !== 'none') {
                    createCelebration();
                }
                
                // Scroll to result message
                resultMessage.scrollIntoView({ behavior: 'smooth' });
            } else {
                alert('There was an error submitting your response. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('There was an error submitting your response. Please try again.');
        });
    });
    
    function showLocationSelection() {
        locationSelection.classList.remove('hidden');
        locationSelection.scrollIntoView({ behavior: 'smooth' });
    }
    
    function showResponseForm(message) {
        // Update form heading based on selection
        const formHeading = responseForm.querySelector('h3');
        formHeading.innerHTML = `<i class="fas fa-heart"></i> ${message}`;
        
        responseForm.classList.remove('hidden');
        locationSelection.classList.add('hidden');
        
        // Scroll to form
        responseForm.scrollIntoView({ behavior: 'smooth' });
    }
    
    function createHearts() {
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                createHeart();
            }, i * 300);
        }
        
        // Continue creating hearts periodically
        setInterval(createHeart, 2000);
    }
    
    function createHeart() {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        
        // Random position and size
        const size = Math.random() * 15 + 10;
        const left = Math.random() * 100;
        
        heart.style.width = `${size}px`;
        heart.style.height = `${size}px`;
        heart.style.left = `${left}%`;
        heart.style.animation = `heartFloat ${Math.random() * 10 + 10}s linear forwards`;
        
        // Random color
        const colors = ['#6C63FF', '#4CD7D0', '#FF6584', '#FF8E8E'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        heart.style.background = color;
        
        heartsContainer.appendChild(heart);
        
        // Remove heart after animation completes
        setTimeout(() => {
            if (heart.parentNode === heartsContainer) {
                heartsContainer.removeChild(heart);
            }
        }, 15000);
    }
    
    function createCelebration() {
        // Create additional floating hearts
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                createHeart();
            }, i * 100);
        }
        
        // Add a special message animation
        const celebrationMsg = document.createElement('div');
        celebrationMsg.innerHTML = '🎉 Awesome! Can\'t wait! 🎉';
        celebrationMsg.style.position = 'fixed';
        celebrationMsg.style.top = '50%';
        celebrationMsg.style.left = '50%';
        celebrationMsg.style.transform = 'translate(-50%, -50%)';
        celebrationMsg.style.fontSize = '2rem';
        celebrationMsg.style.color = 'var(--primary)';
        celebrationMsg.style.fontWeight = 'bold';
        celebrationMsg.style.zIndex = '1000';
        celebrationMsg.style.textShadow = '2px 2px 10px rgba(255,255,255,0.8)';
        celebrationMsg.style.animation = 'fadeIn 1s ease-out';
        celebrationMsg.style.background = 'rgba(255,255,255,0.9)';
        celebrationMsg.style.padding = '20px 30px';
        celebrationMsg.style.borderRadius = '15px';
        celebrationMsg.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
        celebrationMsg.style.textAlign = 'center';
        
        document.body.appendChild(celebrationMsg);
        
        // Remove after 3 seconds
        setTimeout(() => {
            celebrationMsg.style.animation = 'fadeOut 1s ease-out forwards';
            setTimeout(() => {
                if (celebrationMsg.parentNode) {
                    celebrationMsg.parentNode.removeChild(celebrationMsg);
                }
            }, 1000);
        }, 3000);
    }
    
    // Add fadeOut animation to CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
});
