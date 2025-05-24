document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById('login-form');
    const studentId = document.getElementById('studentId');
    const password = document.getElementById('password');
  
    if (form) {
      form.addEventListener('submit', function () {
        if (!studentId.value || !password.value) {
          alert('Vui lòng điền đầy đủ thông tin!');
        }
        // Không cần preventDefault, vì đã gửi tới server để xử lý
      });
    }
  });
  