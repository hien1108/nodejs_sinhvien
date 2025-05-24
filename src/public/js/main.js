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
  
  
    // Xử lý logout
    const logoutIcon = document.getElementById('log_out');
    if (logoutIcon) {
      logoutIcon.addEventListener('click', function() {
        window.location.href = 'dangnhap.html';
      });
    }
  
    // ========== PHẦN LOAD NỘI DUNG (CHỈ 1 HÀM) ==========
    function loadContent(page) {
      fetch(`pages/${page}`)
        .then(response => {
          if (!response.ok) throw new Error("Không thể tải nội dung");
          return response.text();
        })
        .then(html => {
          const contentArea = document.getElementById('content-area');
          contentArea.innerHTML = html;
          
          // Kiểm tra Chart.js trước khi khởi tạo đồ thị
          if (typeof Chart !== 'undefined') {
            initCharts();
          } else {
            console.error("Chart.js chưa được tải!");
          }
        })
        .catch(error => {
          console.error("Lỗi khi tải nội dung:", error);
          document.getElementById('content-area').innerHTML = "<p>Lỗi khi tải nội dung.</p>";
        });
    }
  
    // Xử lý menu items
    const menuItems = document.querySelectorAll(".menu-item");
    menuItems.forEach(item => {
      item.addEventListener("click", function() {
        const page = this.getAttribute("data-page");
        loadContent(page);
      });
    });
  
    // ========== PHẦN XỬ LÝ ĐỒ THỊ ==========
    function initCharts() {
      // Cấu hình chung
      const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.dataset.label}: ${context.raw} người`;
              }
            }
          }
        }
      };
  
      // Biểu đồ sinh viên (giới hạn 6000)
      createChart('studentGenderChart', {
        type: 'bar',
        data: {
          labels: ['CNTT', 'HTTT', 'KHMT'],
          datasets: [
            { 
              label: 'Sinh viên Nam', 
              data: [4500, 3800, 4200], 
              backgroundColor: '#2E8B57',
              borderWidth: 1
            },
            { 
              label: 'Sinh viên Nữ', 
              data: [3800, 4200, 3900], 
              backgroundColor: '#1E90FF',
              borderWidth: 1
            }
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
                callback: function(value) {
                  return value === 6000 ? '≥6000' : value + ' người';
                }
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
  
      // Biểu đồ giáo viên (giới hạn 100)
      createChart('teacherGenderChart', {
        type: 'bar',
        data: {
          labels: ['CNTT', 'HTTT', 'KHMT'],
          datasets: [
            { 
              label: 'Giáo viên Nam', 
              data: [45, 60, 35], 
              backgroundColor: '#3CB371',
              borderWidth: 1
            },
            { 
              label: 'Giáo viên Nữ', 
              data: [55, 40, 65], 
              backgroundColor: '#D2691E',
              borderWidth: 1
            }
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
                callback: function(value) {
                  return value === 100 ? '≥100' : value + ' người';
                }
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
  
    // Hàm tạo biểu đồ
    function createChart(id, config) {
      const ctx = document.getElementById(id);
      if (!ctx) {
        console.warn(`Không tìm thấy canvas #${id}`);
        return;
      }
  
      // Xóa biểu đồ cũ nếu tồn tại
      if (ctx.chart) {
        ctx.chart.destroy();
      }
  
      try {
        ctx.chart = new Chart(ctx.getContext('2d'), config);
      } catch (e) {
        console.error(`Lỗi khi tạo biểu đồ ${id}:`, e);
      }
    }
  
    // ========== KHỞI CHẠY BAN ĐẦU ==========
    // Kiểm tra Chart.js trước khi load
    if (typeof Chart === 'undefined') {
      console.error("Vui lòng nhúng Chart.js trước khi sử dụng!");
    } else {
      loadContent("trangchu.html");
    }
  