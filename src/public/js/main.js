// document.addEventListener("DOMContentLoaded", function() {
//     const loginForm = document.getElementById('login-form');
//     if (loginForm) {
//       loginForm.addEventListener('submit', function(event) {
//         event.preventDefault();
//         const studentId = document.getElementById('studentId').value;
//         const password = document.getElementById('password').value;
  
//         if (studentId === '671417' && password === '123456a@') {
//           window.location.href = 'home.html';
//         } else {
//           alert('Mã sinh viên hoặc mật khẩu không đúng.');
//         }
//       });
//     }
//   });
  
  
// ========== ĐĂNG XUẤT ==========
window.addEventListener('DOMContentLoaded', () => {
  const logoutIcon = document.getElementById('log_out');
  if (logoutIcon) {
    logoutIcon.addEventListener('click', () => {
      window.location.href = '/login';
    });
  }

  attachMenuEvents();       // Gắn menu click
  loadContent('trangchu');  // Trang mặc định khi vào
});

// ========== GẮN SỰ KIỆN CHO MENU ==========
function attachMenuEvents() {
  document.querySelectorAll(".menu-item").forEach(item => {
    item.addEventListener("click", function () {
      const page = this.getAttribute("data-page");
      loadContent(page);
    });
  });
}

// ========== LOAD NỘI DUNG PARTIAL (.hbs từ server) ==========
function loadContent(page) {
  let url = `/home/partials/${page}`;
  if (page === 'khoa') url = '/khoa'; // Gọi controller nếu là khoa

  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error("Không thể tải nội dung");
      return response.text();
    })
    .then(html => {
      const contentArea = document.getElementById('content-area');
      contentArea.innerHTML = html;

      evalScripts(html);     // Chạy script nếu có
      attachMenuEvents();    // Gắn lại menu nếu DOM thay đổi

      if (typeof Chart !== 'undefined') initCharts();
    })
    .catch(error => {
      console.error("Lỗi khi tải nội dung:", error);
      document.getElementById('content-area').innerHTML = "<p>Lỗi khi tải nội dung.</p>";
    });
}

// ========== CHẠY SCRIPT CỦA PARTIAL (nếu có) ==========
function evalScripts(html) {
  const temp = document.createElement('div');
  temp.innerHTML = html;

  temp.querySelectorAll('script').forEach(script => {
    const newScript = document.createElement('script');
    if (script.src) {
      newScript.src = script.src;
    } else {
      newScript.textContent = script.textContent;
    }
    document.body.appendChild(newScript);
  });
}

// ========== VẼ BIỂU ĐỒ ==========
function initCharts() {
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          label: ctx => `${ctx.dataset.label}: ${ctx.raw} người`
        }
      }
    }
  };

  createChart('studentGenderChart', {
    type: 'bar',
    data: {
      labels: ['CNTT', 'HTTT', 'KHMT'],
      datasets: [
        { label: 'Sinh viên Nam', data: [4500, 3800, 4200], backgroundColor: '#2E8B57' },
        { label: 'Sinh viên Nữ', data: [3800, 4200, 3900], backgroundColor: '#1E90FF' }
      ]
    },
    options: {
      ...commonOptions,
      scales: {
        y: {
          beginAtZero: true,
          max: 6000,
          ticks: {
            stepSize: 1000,
            callback: val => val === 6000 ? '≥6000' : val + ' người'
          }
        }
      },
      plugins: {
        title: {
          display: true,
          text: 'THỐNG KÊ SINH VIÊN',
          font: { size: 16 }
        }
      }
    }
  });

  createChart('teacherGenderChart', {
    type: 'bar',
    data: {
      labels: ['CNTT', 'HTTT', 'KHMT'],
      datasets: [
        { label: 'Giáo viên Nam', data: [45, 60, 35], backgroundColor: '#3CB371' },
        { label: 'Giáo viên Nữ', data: [55, 40, 65], backgroundColor: '#D2691E' }
      ]
    },
    options: {
      ...commonOptions,
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            stepSize: 20,
            callback: val => val === 100 ? '≥100' : val + ' người'
          }
        }
      },
      plugins: {
        title: {
          display: true,
          text: 'THỐNG KÊ GIÁO VIÊN',
          font: { size: 16 }
        }
      }
    }
  });
}

// ========== HỖ TRỢ VẼ CHART ==========
function createChart(id, config) {
  const canvas = document.getElementById(id);
  if (!canvas) return;

  if (canvas.chart) canvas.chart.destroy();
  canvas.chart = new Chart(canvas.getContext('2d'), config);
}

