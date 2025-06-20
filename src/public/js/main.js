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
  
  
  // XỬ LÝ ĐĂNG XUẤT
const logoutIcon = document.getElementById('log_out');
if (logoutIcon) {
  logoutIcon.addEventListener('click', function () {
    window.location.href = '/login';
  });
}

// HÀM LOAD NỘI DUNG PARTIAL TỪ SERVER
function loadContent(page) {
  fetch(`/home/partials/${page}`)
    .then(response => {
      if (!response.ok) throw new Error("Không thể tải nội dung");
      return response.text();
    })
    .then(html => {
      const contentArea = document.getElementById('content-area');
      contentArea.innerHTML = html;

      if (typeof Chart !== 'undefined') {
        initCharts();
      }
    })
    .catch(error => {
      console.error("Lỗi khi tải nội dung:", error);
      document.getElementById('content-area').innerHTML = "<p>Lỗi khi tải nội dung.</p>";
    });
}

// GẮN SỰ KIỆN CHO MENU
const menuItems = document.querySelectorAll(".menu-item");
menuItems.forEach(item => {
  item.addEventListener("click", function () {
    const page = this.getAttribute("data-page");
    loadContent(page);
  });
});

// TẠO BIỂU ĐỒ
function initCharts() {
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw} người`;
          }
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
            callback: value => (value === 6000 ? '≥6000' : value + ' người')
          }
        }
      },
      plugins: {
        title: { display: true, text: 'THỐNG KÊ SINH VIÊN', font: { size: 16 } }
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
            callback: value => (value === 100 ? '≥100' : value + ' người')
          }
        }
      },
      plugins: {
        title: { display: true, text: 'THỐNG KÊ GIÁO VIÊN', font: { size: 16 } }
      }
    }
  });
}

// HỖ TRỢ VẼ CHART
function createChart(id, config) {
  const canvas = document.getElementById(id);
  if (!canvas) return;

  if (canvas.chart) {
    canvas.chart.destroy();
  }

  canvas.chart = new Chart(canvas.getContext('2d'), config);
}

// KHỞI TẠO TRANG MẶC ĐỊNH
window.addEventListener('DOMContentLoaded', () => {
  loadContent('trangchu');
});