document.addEventListener('DOMContentLoaded', function() {
    const wordGroups = document.querySelectorAll('.word-group'); // 단어 그룹을 선택
    const daySound = new Audio('audio/word1.mp3'); // 기본 오디오 파일
    const nightSound = new Audio('audio/night.mp3'); // 나이트 모드 오디오 파일
    
    let isPlaying = false; // 오디오 재생 상태를 확인

    // 오디오가 끝났을 때 isPlaying 상태 리셋
    daySound.addEventListener('ended', function() {
        isPlaying = false;
    });

    nightSound.addEventListener('ended', function() {
        isPlaying = false;
    });

    wordGroups.forEach(function(group) {
        const words = group.querySelectorAll('span'); // 각 그룹 내의 단어들을 선택

        words.forEach(function(word) {
            word.addEventListener('mouseenter', function() {
                // 새로운 텍스트(span) 추가
                const newText = word.getAttribute('data-new-text');
                let newTextSpan = document.createElement('span');
                newTextSpan.textContent = newText;
                newTextSpan.classList.add('new-text');
                word.appendChild(newTextSpan);

                // 새로운 텍스트 애니메이션
                setTimeout(() => newTextSpan.classList.add('show'), 0);
                word.classList.add('hovered');

                // 오디오 재생 시작 (사운드가 활성화된 경우에만)
                if (!isPlaying && isSoundOn) {
                    const audio = document.body.classList.contains('night-mode') ? nightSound : daySound;
                    audio.currentTime = 0;
                    audio.play().then(() => {
                        isPlaying = true;  // 오디오 재생 상태 설정
                    }).catch(error => {
                        console.error('오디오 재생 오류:', error);
                    });
                }
            });

            word.addEventListener('mouseleave', function() {
                // 단어에서 마우스가 벗어나면 새로운 텍스트 제거
                word.classList.remove('hovered');
                const newTextSpans = word.querySelectorAll('.new-text');
                newTextSpans.forEach(function(newTextSpan) {
                    newTextSpan.classList.remove('show');
                    
                    // transitionend 이벤트가 끝날 때까지 기다린 후 텍스트 삭제
                    newTextSpan.addEventListener('transitionend', function() {
                        newTextSpan.remove(); // 이제 요소를 완전히 제거
                    });
                });
            });
        });

        group.addEventListener('mouseleave', function() {
            // 그룹을 벗어나면 모든 단어에서 호버 상태를 제거하고 오디오 멈춤
            const words = group.querySelectorAll('span');
            words.forEach(function(word) {
                word.classList.remove('hovered');
                const newTextSpans = word.querySelectorAll('.new-text');
                newTextSpans.forEach(function(newTextSpan) {
                    newTextSpan.classList.remove('show');
                    newTextSpan.addEventListener('transitionend', function() {
                        newTextSpan.remove(); // 텍스트 완전 제거
                    });
                });
            });

            // 그룹을 벗어났을 때만 오디오 멈춤
            if (!document.querySelector('.hovered')) {
                daySound.pause();
                nightSound.pause();
                daySound.currentTime = 0;
                nightSound.currentTime = 0;
                isPlaying = false;
            }
        });
    });

    // 기본적으로 sound가 활성화되어 있다고 가정
    let isSoundOn = true; // sound 상태를 관리

    const soundButton = document.getElementById('soundButton');
    const wordGroup = document.querySelectorAll('.word-group span');

    // 사운드가 활성화된 상태일 때 오디오를 재생하는 함수
    const playSound = (audioFile) => {
        if (isSoundOn) {
            const audio = new Audio(audioFile);
            audio.play();
        }
    };

    // 사운드 버튼 클릭 시 상태 변경
    soundButton.addEventListener('click', () => {
        // sound 상태 토글
        isSoundOn = !isSoundOn;

        // 버튼의 data-sound 값을 변경하여 상태 반영
        soundButton.setAttribute('data-sound', isSoundOn ? 'on' : 'off');
    });

    // 마우스 오버 시 소리 나도록 설정 (sound가 활성화된 경우만)
    wordGroup.forEach(span => {
        span.addEventListener('mouseover', (e) => {
            // sound가 켜져있을 때만 소리가 난다
            if (isSoundOn) {
                const audioFile = e.target.getAttribute('data-audio');
                playSound(audioFile);
            }
        });
    });



    

    // Night Mode 버튼 처리
    const nightModeButton = document.getElementById('nightModeButton');
    
    if (nightModeButton) {
        nightModeButton.addEventListener('click', function() {
            document.body.classList.toggle('night-mode');
            
            if (document.body.classList.contains('night-mode')) {
                this.textContent = 'Light';
            } else {
                this.textContent = 'Night';
            }

            const event = new Event('classChange');
            document.body.dispatchEvent(event);
        });
    } else {
        console.error("Night mode button not found!");
    }

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