(function () {
    const LEFT_BRACKET = 219;
    const RIGHT_BRACKET = 221;

    const locationHash = location.hash.split('-');
    const slides = document.getElementsByClassName('slide');

    const slidesAlreadyLoaded = {};

    let slideIndex, currentSlide, subslides;
    let subslideIndex = 0;

    // Save subslides in memory if they are available and haven't already been loaded
    const setSubslides = (slide) => {
        if (!slidesAlreadyLoaded[slideIndex] && /has-subslides/.test(slide.className)) {
            const subslideWrapper = slide.querySelector('.subslides');
            subslides = subslideWrapper ? subslideWrapper.children : null;
            subslideIndex = 0;
        } else {
            subslides = null;
        }
    }

    // If the URL includes an anchor link to a particular slide, set the current slide to that slide
    // Otherwise, set the current slide to the first slide
    if (locationHash.length > 1) {
        slideIndex = parseInt(locationHash[1], 10);
        currentSlide = slides[slideIndex];
        setSubslides(currentSlide);
    } else {
        slideIndex = 0;
        currentSlide = slides[0];
    }

    // Show a subslide within the current slide
    const showSubslide = () => {
        subslides[subslideIndex].classList.remove('hidden');
        subslides[subslideIndex].classList.add('visible');
        subslideIndex += 1;
        if (subslideIndex === subslides.length) {
            subslides = null;
            slidesAlreadyLoaded[slideIndex] = true;
        }
    }

    // Navigate to the last or next slide, depending on the keyCode
    const navigateToSlide = (keyCode) => {
        if (subslides && keyCode === RIGHT_BRACKET && subslideIndex <= subslides.length - 1) {
            showSubslide();
        } else {
            if (keyCode === LEFT_BRACKET && slideIndex > 0) {
                slideIndex -= 1;
            } else if (keyCode === RIGHT_BRACKET && slideIndex < slides.length - 1) {
                slideIndex += 1;
            }

            currentSlide = document.getElementById(`slide-${slideIndex}`);
            currentSlide.scrollIntoView();
            setSubslides(currentSlide);
        }
    }

    // Add a keydown event to listen for last or next slide requests (via square bracket keys)
    document.body.addEventListener('keydown', event => {
        const { keyCode } = event;

        if (keyCode === LEFT_BRACKET || keyCode === RIGHT_BRACKET) {
            navigateToSlide(keyCode);
            return;
        }
    });

    // Add events to replace image sources on click
    document.querySelectorAll('.has-next-image').forEach(el => el.addEventListener('click', function () {
        const nextImageSrc = `images/${this.dataset.nextImage}`;
        this.className += ' has-fade-in';
        this.src = nextImageSrc;
    }));

    // Add events to update editable CSS textareas on blur
    document.querySelectorAll('.editable').forEach(el => el.addEventListener('blur', function () {
        const targetEl = document.getElementById(this.dataset.targetElementId);
        if (this.value.length > 0) {
            targetEl.style = this.value;
        }
    }));
})();
