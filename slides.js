(function () {
    // 1478 x 750 max space
    const LEFT_BRACKET = 188;
    const RIGHT_BRACKET = 190;

    const locationHash = location.hash.split('-');
    const slides = document.getElementsByClassName('slide');

    const slidesAlreadyLoaded = {};

    let slideIndex, currentSlide, subslides;
    let subslideIndex = 0;

    const setSubslides = (slide) => {
        if (!slidesAlreadyLoaded[slideIndex] && /has-subslides/.test(slide.className)) {
            const subslideWrapper = slide.querySelector('.subslides');
            subslides = subslideWrapper ? subslideWrapper.children : null;
            subslideIndex = 0;
        } else {
            subslides = null;
        }
    }

    if (locationHash.length > 1) {
        slideIndex = parseInt(locationHash[1], 10);
        currentSlide = slides[slideIndex];
        setSubslides(currentSlide);
    } else {
        slideIndex = 0;
        currentSlide = slides[0];
    }

    const showSubslide = () => {
        subslides[subslideIndex].classList.remove('hidden');
        subslides[subslideIndex].classList.add('visible');
        subslideIndex += 1;
        if (subslideIndex === subslides.length) {
            subslides = null;
            slidesAlreadyLoaded[slideIndex] = true;
        }
    }

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

    document.body.addEventListener('keydown', event => {
        const { keyCode } = event;

        if (keyCode === LEFT_BRACKET || keyCode === RIGHT_BRACKET) {
            navigateToSlide(keyCode);
            return;
        }
    });

    document.querySelectorAll('.has-next-image').forEach(el => el.addEventListener('click', function () {
        const nextImageSrc = `images/${this.dataset.nextImage}`;
        this.className += ' has-fade-in';
        this.src = nextImageSrc;
    }));

    document.querySelectorAll('.editable').forEach(el => el.addEventListener('blur', function () {
        const targetEl = document.getElementById(this.dataset.targetElementId);
        if (this.value.length > 0) {
            targetEl.style = this.value;
        }
    }));
})();
