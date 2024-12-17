document.addEventListener('DOMContentLoaded', function() {
    const wordGroups = document.querySelectorAll('.word-group');
    const daySound = new Audio('audio/word1.mp3');
    const nightSound = new Audio('audio/night.mp3');
    
    let isPlaying = false;

    daySound.addEventListener('ended', function() {
        isPlaying = false;
    });

    nightSound.addEventListener('ended', function() {
        isPlaying = false;
    });

    wordGroups.forEach(function(group) {
        const words = group.querySelectorAll('span');
        
        words.forEach(function(word) {
            word.addEventListener('mouseenter', function() {
                // 새로운 텍스트 추가
                const newText = word.getAttribute('data-new-text');
                let newTextSpan = document.createElement('span');
                newTextSpan.textContent = newText;
                newTextSpan.classList.add('new-text');
                word.appendChild(newTextSpan);

                // 애니메이션 시작
                setTimeout(() => newTextSpan.classList.add('show'), 0);
                word.classList.add('hovered');

                // 오디오 재생
                if (!isPlaying && isSoundOn) {
                    const audio = document.body.classList.contains('night-mode') ? nightSound : daySound;
                    audio.currentTime = 0;
                    audio.play().then(() => {
                        isPlaying = true;
                    }).catch(error => {
                        console.error('오디오 재생 오류:', error);
                    });
                }
            });

            word.addEventListener('mouseleave', function() {
                // 마우스가 벗어났을 때 텍스트 애니메이션 종료 후 삭제
                word.classList.remove('hovered');
                const newTextSpans = word.querySelectorAll('.new-text');
                newTextSpans.forEach(function(newTextSpan) {
                    newTextSpan.classList.remove('show');
                    
                    // transitionend 이벤트가 끝날 때 텍스트 삭제
                    newTextSpan.addEventListener('transitionend', function() {
                        newTextSpan.remove(); // 애니메이션 후 요소를 완전히 제거
                    });
                    
                    // transition이 끝나지 않았을 경우 강제로 삭제 (시간이 지났다면)
                    setTimeout(() => newTextSpan.remove(), 1000); // 예를 들어 500ms 후 강제로 삭제
                });
            });
        });

        group.addEventListener('mouseleave', function() {
            const words = group.querySelectorAll('span');
            words.forEach(function(word) {
                word.classList.remove('hovered');
                const newTextSpans = word.querySelectorAll('.new-text');
                newTextSpans.forEach(function(newTextSpan) {
                    newTextSpan.classList.remove('show');
                    newTextSpan.addEventListener('transitionend', function() {
                        newTextSpan.remove(); // 텍스트 완전 제거
                    });
                    
                    // transition이 끝나지 않은 경우 강제로 삭제
                    setTimeout(() => newTextSpan.remove(), 1000); // 예를 들어 500ms 후 강제로 삭제
                });
            });

            // 그룹을 벗어났을 때 오디오 멈춤
            if (!document.querySelector('.hovered')) {
                daySound.pause();
                nightSound.pause();
                daySound.currentTime = 0;
                nightSound.currentTime = 0;
                isPlaying = false;
            }
        });
    });

    let isSoundOn = true;

    const soundButton = document.getElementById('soundButton');
    const wordGroup = document.querySelectorAll('.word-group span');

    const playSound = (audioFile) => {
        if (isSoundOn) {
            const audio = new Audio(audioFile);
            audio.play();
        }
    };

    soundButton.addEventListener('click', () => {
        isSoundOn = !isSoundOn;
        soundButton.setAttribute('data-sound', isSoundOn ? 'on' : 'off');
    });

    wordGroup.forEach(span => {
        span.addEventListener('mouseover', (e) => {
            if (isSoundOn) {
                const audioFile = e.target.getAttribute('data-audio');
                playSound(audioFile);
            }
        });
    });

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
    }







const aboutTypeButton = document.getElementById('aboutTypeButton');
const columns = document.querySelectorAll('.column span');

// 다크모드 감지
const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

// 다크모드 여부에 따른 색상 변경 함수
function updateColorScheme() {
    const isDarkMode = darkModeMediaQuery.matches;

    columns.forEach(column => {
        // 텍스트 색상 설정 (다크모드 / 라이트모드에 맞게)
        if (isDarkMode) {
            column.style.color = 'white';  // 다크모드일 때 기본 텍스트 색상
        } else {
            column.style.color = '#333';  // 라이트모드일 때 기본 텍스트 색상
        }
    });
}

// 마우스 호버 시 색상 변경
aboutTypeButton.addEventListener('mouseenter', function() {
    const isDarkMode = darkModeMediaQuery.matches; // 현재 다크모드인지 확인

    columns.forEach(column => {
        // 다크모드일 때
        if (isDarkMode) {
            column.style.color = 'black';  // 다크모드에서 호버 시 텍스트 색상 변경
        } else {
            column.style.color = '#f4f4f4';  // 라이트모드에서 호버 시 텍스트 색상 변경
        }
    });
});

// 마우스가 벗어났을 때 기본 색상으로 복원
aboutTypeButton.addEventListener('mouseleave', function() {
    const isDarkMode = darkModeMediaQuery.matches; // 현재 다크모드인지 확인

    columns.forEach(column => {
        // 다크모드일 때
        if (isDarkMode) {
            column.style.color = 'white';  // 다크모드에서 기본 텍스트 색상
        } else {
            column.style.color = '#333';  // 라이트모드에서 기본 텍스트 색상
        }
    });
});

// 다크모드가 변경될 때마다 색상 업데이트
darkModeMediaQuery.addEventListener('change', updateColorScheme);

// 초기 로드시 색상 설정
updateColorScheme();









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




