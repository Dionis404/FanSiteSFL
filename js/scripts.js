// RSS Feed URL
const RSS_URL = 'https://teletype.in/rss/urg';

// Function to fetch and parse RSS feed
async function fetchRSSFeed() {
    try {
        const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}`);
        const data = await response.json();
        return data.items;
    } catch (error) {
        console.error('Error fetching RSS feed:', error);
        return [];
    }
}

// Function to create carousel items
function createCarouselItems(items) {
    const container = document.getElementById('carouselContainer');
    const controls = document.getElementById('carouselControls');
    
    // Clear existing content
    container.innerHTML = '';
    controls.innerHTML = '';

    items.forEach((item, index) => {
        // Create carousel item
        const carouselItem = document.createElement('div');
        carouselItem.className = 'carousel-item';
        
        // Clean description text (remove HTML tags)
        const cleanDescription = item.description
            .replace(/<[^>]+>/g, '') // Remove HTML tags
            .replace(/\s+/g, ' ') // Normalize whitespace
            .trim();

        carouselItem.innerHTML = `
            <h3><a href="${item.link}" target="_blank">${item.title}</a></h3>
            <div class="content-wrapper">
                <div class="text-content">
                    <p>${cleanDescription}</p>
                </div>
            </div>
        `;
        container.appendChild(carouselItem);

        // Create dot
        const dot = document.createElement('div');
        dot.className = 'carousel-dot' + (index === 0 ? ' active' : '');
        dot.addEventListener('click', () => goToSlide(index));
        controls.appendChild(dot);
    });
}

// Function to go to specific slide
function goToSlide(index) {
    const container = document.getElementById('carouselContainer');
    const dots = document.querySelectorAll('.carousel-dot');
    
    container.style.transform = `translateX(-${index * 100}%)`;
    
    // Update active dot
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

// Initialize carousel
async function initCarousel() {
    const items = await fetchRSSFeed();
    if (items.length > 0) {
        createCarouselItems(items);
        
        // Auto-advance slides every 5 seconds
        let currentSlide = 0;
        setInterval(() => {
            currentSlide = (currentSlide + 1) % items.length;
            goToSlide(currentSlide);
        }, 5000);
    }
}

// Modal functions
function openLinksModal() {
    const modal = document.getElementById('linksModal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Предотвращаем прокрутку фона
    }
}

function closeLinksModal() {
    const modal = document.getElementById('linksModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = ''; // Возвращаем прокрутку
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initialize carousel
    initCarousel();

    // Modal click handlers
    const officialLinks = document.getElementById('official-links');
    const modal = document.getElementById('linksModal');
    const closeBtn = modal?.querySelector('.modal-close-btn');

    // Обработчик для открытия модального окна
    if (officialLinks) {
        officialLinks.addEventListener('click', openLinksModal);
    }

    // Обработчик для кнопки закрытия
    if (closeBtn) {
        closeBtn.addEventListener('click', closeLinksModal);
    }

    // Закрытие по клику вне модального окна
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeLinksModal();
            }
        });
    }

    // Закрытие по ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeLinksModal();
        }
    });

    // Guide click handler
    document.getElementById('guide').addEventListener('click', function() {
        window.open('https://dionis404.github.io/Goblin-Guide/', '_self');
    });
});