console.log('Script loaded'); // 스크립트 로드 확인

document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM fully loaded');

    // 버튼 클릭 이벤트 리스너
    const toggleButton = document.getElementById('dark-mode-toggle');
    toggleButton.addEventListener('click', function () {
        console.log('Button clicked');
        document.body.classList.toggle('dark-mode'); // 다크 모드 토글
    });
});