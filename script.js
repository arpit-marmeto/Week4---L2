document.addEventListener('DOMContentLoaded', () => {
    const addImageBtn = document.getElementById('addImageBtn');
    const imageUrlInput = document.getElementById('imageUrl');
    const imageNameInput = document.getElementById('imageName');
    const searchInput = document.getElementById('searchInput');
    const gallery = document.getElementById('gallery');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');

    const itemsPerPage = 13;
    let currentPage = 1;
    let images = JSON.parse(localStorage.getItem('images')) || [];

    addImageBtn.addEventListener('click', () => {
        const imageUrl = imageUrlInput.value.trim();
        const imageName = imageNameInput.value.trim() || ''; // Default to an empty string if the name is not provided

        if (isValidUrl(imageUrl)) {
            images.unshift({ url: imageUrl, name: imageName.toLowerCase() }); // Add image to the beginning of the array
            updateLocalStorage();
            currentPage = 1; // Reset to the first page
            displayImages();
            imageUrlInput.value = '';
            imageNameInput.value = '';
        } else {
            alert('Please enter a valid image URL.');
        }
    });

    searchInput.addEventListener('input', () => {
        displayImages();
    });

    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayImages();
        }
    });

    nextPageBtn.addEventListener('click', () => {
        if (currentPage * itemsPerPage < filteredImages().length) {
            currentPage++;
            displayImages();
        }
    });

    function isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch (_) {
            return false;
        }
    }

    function filteredImages() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        return images.filter(img =>
            img.name.includes(searchTerm) || img.url.toLowerCase().includes(searchTerm)
        );
    }

    function displayImages() {
        gallery.innerHTML = '';
        const filtered = filteredImages();
        
        if (filtered.length === 0) {
            const message = document.createElement('p');
            message.textContent = 'The gallery is empty. Please add some images.';
            gallery.appendChild(message);
        } else {
            const startIndex = (currentPage - 1) * itemsPerPage;
            const paginatedImages = filtered.slice(startIndex, startIndex + itemsPerPage);
    
            paginatedImages.forEach((img, index) => {
                const container = document.createElement('div');
                container.classList.add('image-container');
    
                const imgElement = document.createElement('img');
                imgElement.src = img.url;
                imgElement.alt = img.name || 'Unnamed Image'; // Provide a default alt text if name is not provided
                container.appendChild(imgElement);
    
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'X';
                deleteBtn.classList.add('delete-btn');
                deleteBtn.addEventListener('click', () => {
                    // Remove image from storage and update display
                    images.splice(images.indexOf(img), 1);
                    updateLocalStorage();
                    displayImages();
                });
                container.appendChild(deleteBtn);
    
                gallery.appendChild(container);
            });
    
            pageInfo.textContent = `Page ${currentPage} of ${Math.ceil(filtered.length / itemsPerPage)}`;
            prevPageBtn.disabled = currentPage === 1;
            nextPageBtn.disabled = currentPage * itemsPerPage >= filtered.length;
        }
    }

    function updateLocalStorage() {
        localStorage.setItem('images', JSON.stringify(images));
    }

    displayImages();
});
