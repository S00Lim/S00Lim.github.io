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
            
            if (!existingTextSpan) {
                // 텍스트가 없다면 추가
                let newTextSpan = document.createElement('span');
                newTextSpan.textContent = newText;
                newTextSpan.classList.add('new-text');
                word.appendChild(newTextSpan);
                
                // opacity 애니메이션 추가
                setTimeout(() => newTextSpan.classList.add('show'), 0);
            }

            word.classList.add('hovered');

            if (audio) {
                audio.currentTime = 0;
                audio.play().catch(function(error) {
                    console.error('오디오 재생 오류:', error);
                });
            }
        });

        word.addEventListener('mouseleave', function() {
            word.classList.remove('hovered');
            const newTextSpans = word.querySelectorAll('.new-text');

            newTextSpans.forEach(function(newTextSpan) {
                // 'mouseleave'에서 텍스트 사라지게 만들기
                newTextSpan.classList.remove('show');
                // 애니메이션 종료 후 텍스트 삭제
                newTextSpan.addEventListener('transitionend', function() {
                    word.removeChild(newTextSpan);
                });
            });

            if (audio) {
                audio.pause();
                audio.currentTime = 0;
            }
        });
    });

    // Night Mode 버튼 처리
    const nightModeButton = document.getElementById('nightModeButton');
    
    if (!nightModeButton) {
        console.error("Button not found!");
        return;
    }

    console.log("Button found:", nightModeButton);

    nightModeButton.addEventListener('click', function() {
        document.body.classList.toggle('night-mode');
        
        if (document.body.classList.contains('night-mode')) {
            console.log("Night mode activated");
            this.textContent = 'Light';
        } else {
            console.log("Night mode deactivated");
            this.textContent = 'Night';
        }

        const event = new Event('classChange');
        document.body.dispatchEvent(event);
    });

    // 반딧불이 생성 코드
    let fireflies = [];
    const maxFireflies = 15;

    function createFirefly() {
        if (fireflies.length >= maxFireflies) {
            return;
        }

        const firefly = document.createElement('div');
        firefly.classList.add('firefly');

        firefly.style.top = `${Math.random() * 100}%`;
        firefly.style.left = `${Math.random() * 100}%`;

        const randomMoveDuration = Math.random() * 3 + 7 + 's';
        const randomGlowDuration = Math.random() * 1 + 1.5 + 's';

        firefly.style.animationDuration = `${randomMoveDuration}, ${randomGlowDuration}`;

        document.body.appendChild(firefly);
        fireflies.push(firefly);
    }

    setInterval(createFirefly, 300);
});