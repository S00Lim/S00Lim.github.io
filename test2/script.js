document.addEventListener('DOMContentLoaded', function() {
    const words = document.querySelectorAll('.column span');

    // 디바이스 타입 확인 (모바일 여부 판단)
    const isTouchDevice = ('ontouchstart' in window || navigator.maxTouchPoints > 0);

    words.forEach(function(word) {
        const audioSrc = word.getAttribute('data-audio');
        let audio = audioSrc ? new Audio(audioSrc) : null;

        // 원래 텍스트 저장
        const originalText = word.textContent;
        word.setAttribute('data-original-text', originalText);

        if (isTouchDevice) {
            // 모바일: 클릭 인터랙션
            word.addEventListener('click', function() {
                handleInteraction(word, audio);
            });
        } else {
            // 데스크톱: 호버 인터랙션
            word.addEventListener('mouseenter', function() {
                handleInteraction(word, audio);
            });
            word.addEventListener('mouseleave', function() {
                resetInteraction(word, audio);
            });
        }
    });

    function handleInteraction(word, audio) {
        const newText = word.getAttribute('data-new-text');
        
        // 새로운 텍스트 추가
        const newTextSpan = document.createElement('span');
        newTextSpan.textContent = newText;
        newTextSpan.classList.add('new-text', 'show');
        word.appendChild(newTextSpan);
        word.classList.add('hovered');

        // 오디오 재생
        if (audio) {
            audio.play().catch(error => console.error('Playback error:', error));
        }
    }

    function resetInteraction(word, audio) {
        word.classList.remove('hovered');

        // 새로운 텍스트 제거
        const newTextSpans = word.querySelectorAll('.new-text');
        newTextSpans.forEach(function(newTextSpan) {
            newTextSpan.remove();
        });

        // 오디오 정지
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
    }
});