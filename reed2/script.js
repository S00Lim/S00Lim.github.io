document.addEventListener('DOMContentLoaded', function() {
    const words = document.querySelectorAll('.column span');

    words.forEach(function(word) {
        // 각 단어에 대해 audio 객체 생성
        const audioSrc = word.getAttribute('data-audio');
        let audio = audioSrc ? new Audio(audioSrc) : null; // data-audio 속성이 있으면 audio 객체 생성

        // 원래 텍스트 저장
        const originalText = word.textContent;
        word.setAttribute('data-original-text', originalText);

        // 마우스 enter 이벤트 (mouseenter)
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
            if (audio) {
                audio.currentTime = 0; // 오디오를 처음부터 다시 시작
                audio.play().catch(function(error) {
                    console.error('오디오 재생 오류:', error); // 재생 오류 확인
                });
            }
        });

        // 마우스 leave 이벤트 (mouseleave)
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
            }
        });

        // 클릭 이벤트 (click)
        word.addEventListener('click', function() {
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
            word.classList.add('clicked');

            // 오디오가 있을 경우 노래 재생
            if (audio) {
                audio.currentTime = 0; // 오디오를 처음부터 다시 시작
                audio.play().catch(function(error) {
                    console.error('오디오 재생 오류:', error); // 재생 오류 확인
                });
            }

            // 3초 뒤에 fade-out 효과 추가
            setTimeout(function() {
                newTextSpan.classList.add('fade-out'); // fade-out 클래스를 추가하여 텍스트를 서서히 사라지게 함
            }, 3000); // 3초 후에 실행
        });

        // 텍스트의 opacity가 0으로 변할 때 새로운 텍스트 삭제
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