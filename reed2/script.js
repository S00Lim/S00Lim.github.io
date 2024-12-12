document.addEventListener('DOMContentLoaded', function() {
    const words = document.querySelectorAll('.column span');

    words.forEach(function(word) {
        const audioSrc = word.getAttribute('data-audio');
        let audio = audioSrc ? new Audio(audioSrc) : null;

        const originalText = word.textContent;
        word.setAttribute('data-original-text', originalText);

        word.addEventListener('mouseenter', function() {
            const newText = word.getAttribute('data-new-text');

            const existingTextSpan = word.querySelector('.new-text');
            if (existingTextSpan) {
                existingTextSpan.remove();
            }

            let newTextSpan = document.createElement('span');
            newTextSpan.textContent = newText;
            newTextSpan.classList.add('new-text', 'show');
            word.appendChild(newTextSpan);

            word.classList.add('hovered');

            if (audio) {
                audio.currentTime = 0;
                audio.play().catch(function(error) {
                    console.error('Audio play error:', error);
                });
            }
        });

        word.addEventListener('mouseleave', function() {
            word.classList.remove('hovered');

            const newTextSpans = word.querySelectorAll('.new-text');
            newTextSpans.forEach(function(newTextSpan) {
                newTextSpan.classList.remove('show');
            });

            newTextSpans.forEach(function(newTextSpan) {
                newTextSpan.addEventListener('transitionend', function() {
                    if (!newTextSpan.classList.contains('show')) {
                        word.removeChild(newTextSpan);
                    }
                });
            });

            if (audio) {
                audio.pause();
                audio.currentTime = 0;
            }
        });

        word.addEventListener('click', function() {
            const newText = word.getAttribute('data-new-text');

            const existingTextSpan = word.querySelector('.new-text');
            if (existingTextSpan) {
                existingTextSpan.remove();
            }

            let newTextSpan = document.createElement('span');
            newTextSpan.textContent = newText;
            newTextSpan.classList.add('new-text', 'show');
            word.appendChild(newTextSpan);

            word.classList.add('clicked');

            if (audio) {
                audio.currentTime = 0;
                audio.play().catch(function(error) {
                    console.error('Audio play error:', error);
                });
            }

            setTimeout(function() {
                newTextSpan.classList.add('fade-out');
            }, 500);
        });

        word.addEventListener('transitionend', function(event) {
            if (event.propertyName === 'opacity') {
                const newTextSpans = word.querySelectorAll('.new-text');
                newTextSpans.forEach(function(newTextSpan) {
                    if (!newTextSpan.classList.contains('show')) {
                        word.removeChild(newTextSpan);
                    }
                });
            }
        });
    });
});