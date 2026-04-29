import './bootstrap';

document.addEventListener('DOMContentLoaded', () => {
    const slider = document.querySelector('[data-home-slider]');
    if (slider) {
        const track = slider.querySelector('[data-slider-track]');
        const slides = slider.querySelectorAll('[data-slide]');
        const prev = slider.querySelector('[data-slider-prev]');
        const next = slider.querySelector('[data-slider-next]');
        let index = 0;

        const updateSlider = () => {
            if (track) {
                track.style.transform = `translateX(-${index * 100}%)`;
            }
        };

        prev?.addEventListener('click', () => {
            index = index === 0 ? slides.length - 1 : index - 1;
            updateSlider();
        });

        next?.addEventListener('click', () => {
            index = (index + 1) % slides.length;
            updateSlider();
        });

        setInterval(() => {
            index = (index + 1) % slides.length;
            updateSlider();
        }, 4500);
    }
});
