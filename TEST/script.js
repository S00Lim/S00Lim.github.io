document.addEventListener('DOMContentLoaded', function() {
    const words = document.querySelectorAll('.column span');
    let isPlaying = false; // 전역적으로 소리 재생 상태를 추적

    words.forEach(function(word) {
        // 각 단어에 대해 audio 객체 생성
        const audioSrc = word.getAttribute('data-audio');
        let audio = audioSrc ? new Audio(audioSrc) : null; // data-audio 속성이 있으면 audio 객체 생성
        let isPlaying = false;

        // 원래 텍스트 저장
        const originalText = word.textContent;
        word.setAttribute('data-original-text', originalText);

        word.addEventListener('mouseenter', function() {
            // 새로운 텍스트로 변경
            const newText = word.getAttribute('data-new-text');
            console.log('New text:', newText); // 데이터 출력 확인

            // 기존의 새로운 텍스트가 있으면 먼저 제거
            const existingTextSpan = word.querySelector('.new-text');
            if (existingTextSpan) {
                existingTextSpan.remove(); // 기존 텍스트 제거
            }

            // 새로운 텍스트 요소 생성
            let newTextSpan = document.createElement('span');
            newTextSpan.textContent = newText;
            newTextSpan.classList.add('new-text', 'show'); // 새로운 텍스트 표시
            word.appendChild(newTextSpan); // 새로운 텍스트 추가

            // 기존 텍스트 숨기기
            word.classList.add('hovered');

            // 오디오가 있을 경우 노래 재생
            if (audio && !isPlaying) {
                audio.play()
                    .then(() => {
                        isPlaying = true; // 상태 업데이트
                    })
                    .catch(error => {
                        console.error('Playback error:', error);
                    });
            }
        });

        word.addEventListener('mouseleave', function() {
            // 마우스를 떼면 원래 상태로 복원
            word.classList.remove('hovered');
            
            // 새로운 텍스트 숨기기
            const newTextSpans = word.querySelectorAll('.new-text');
            newTextSpans.forEach(function(newTextSpan) {
                newTextSpan.classList.remove('show'); // 새로운 텍스트 숨기기
            });

            // opacity가 0으로 변할 때 DOM에서 새로운 텍스트 제거
            newTextSpans.forEach(function(newTextSpan) {
                newTextSpan.addEventListener('transitionend', function() {
                    if (!newTextSpan.classList.contains('show')) {
                        word.removeChild(newTextSpan); // 새로운 텍스트 삭제
                    }
                });
            });

            // 오디오가 있을 경우 노래 멈추기
            if (audio) {
                audio.pause();
                audio.currentTime = 0; // 노래가 다시 시작되도록 초기화
                isPlaying = false; // 재생 상태 초기화
            }
        });

        // 마지막 단어가 사라지지 않는 문제를 해결하기 위해서
        // 마우스가 떠난 후에도 `mouseleave` 이벤트가 확실히 실행되도록 합니다.
        word.addEventListener('transitionend', function(event) {
            if (event.propertyName === 'opacity') {  // opacity가 0으로 변할 때
                const newTextSpans = word.querySelectorAll('.new-text');
                newTextSpans.forEach(function(newTextSpan) {
                    if (!newTextSpan.classList.contains('show')) {
                        word.removeChild(newTextSpan); // 새로운 텍스트 삭제
                    }
                });
            }
        });
    });
});