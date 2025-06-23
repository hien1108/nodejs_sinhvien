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
		logoutIcon.addEventListener('click', async () => {
			if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
				try {
					// Gọi API logout để xóa session
					const response = await fetch('/logout', {
						method: 'POST',
						credentials: 'include',
					});

					if (response.ok) {
						// Redirect sau khi logout thành công
						window.location.href = '/login';
					} else {
						// Nếu API logout lỗi, vẫn redirect (fallback)
						console.warn('Logout API failed, redirecting anyway');
						window.location.href = '/login';
					}
				} catch (error) {
					console.error('Logout error:', error);
					// Fallback: redirect even if API fails
					window.location.href = '/login';
				}
			}
		});
	}

	// Use event delegation for menu items
	document.body.addEventListener('click', function (e) {
		const menuItem = e.target.closest('.menu-item');
		if (menuItem) {
			e.preventDefault();
			e.stopPropagation();

			const page = menuItem.getAttribute('data-page');
			console.log('Menu clicked via delegation:', page);
			loadContent(page);
		}
	});

	loadContent('trangchu'); // Trang mặc định khi vào
});

// ========== LOAD NỘI DUNG PARTIAL (.hbs từ server) ==========
let isLoading = false; // Prevent multiple simultaneous requests

function loadContent(page) {
	// Prevent multiple concurrent requests
	if (isLoading) {
		console.log('Already loading content, skipping...');
		return;
	}

	isLoading = true;

	let url = `/home/partials/${page}`;
	if (page === 'khoa') url = '/khoa';
	if (page === 'lop') url = '/lop';
	if (page === 'sinhvien') url = '/sinhvien';
	if (page === 'quanlymonhoc') url = '/quanlymonhoc';
	if (page === 'quanlydiem') url = '/quanlydiem';
	if (page === 'diemdanh') url = '/diemdanh';

	fetch(url)
		.then((response) => {
			if (!response.ok) throw new Error('Không thể tải nội dung');
			return response.text();
		})
		.then((html) => {
			const contentArea = document.getElementById('content-area');
			contentArea.innerHTML = html;
			evalScripts(html);

			// No need to attach events anymore - using event delegation

			if (typeof Chart !== 'undefined') initCharts(); // ✅ Nạp lại JS riêng cho từng trang nếu cần

			if (page === 'diemdanh') {
				// Xóa script cũ nếu có
				const oldScript = document.querySelector(
					'script[src="/js/diemdanh.js"]'
				);
				if (oldScript) oldScript.remove();

				// Load script mới và đợi nó load xong
				const script = document.createElement('script');
				script.src = '/js/diemdanh.js';
				script.onload = function () {
					console.log('✅ Diemdanh.js loaded successfully');
					// Call init function after script loads
					if (typeof window.initAttendanceManagement === 'function') {
						window.initAttendanceManagement();
					}
				};
				script.onerror = function () {
					console.error('❌ Failed to load diemdanh.js');
				};
				document.body.appendChild(script);
			}
			if (page === 'khoa') {
				// Xóa script cũ nếu có
				const oldScript = document.querySelector(
					'script[src="/js/khoa.js"]'
				);
				if (oldScript) oldScript.remove();

				// Load script mới và đợi nó load xong
				const script = document.createElement('script');
				script.src = '/js/khoa.js';
				script.onload = function () {
					console.log('✅ Khoa.js loaded successfully');
					// Call init function after script loads
					if (typeof window.initKhoaFunctionality === 'function') {
						window.initKhoaFunctionality();
					}
				};
				script.onerror = function () {
					console.error('❌ Failed to load khoa.js');
				};
				document.body.appendChild(script);
			}
			if (page === 'lop') {
				// Xóa script cũ nếu có
				const oldScript = document.querySelector(
					'script[src="/js/class.js"]'
				);
				if (oldScript) oldScript.remove();

				// Load script mới và đợi nó load xong
				const script = document.createElement('script');
				script.src = '/js/class.js';
				script.onload = function () {
					console.log('✅ Class.js loaded successfully');
					// Call init function after script loads
					if (typeof window.initClassManagement === 'function') {
						window.initClassManagement();
					}
				};
				script.onerror = function () {
					console.error('❌ Failed to load class.js');
				};
				document.body.appendChild(script);
			}
			if (page === 'sinhvien') {
				// Xóa script cũ nếu có
				const oldScript = document.querySelector(
					'script[src="/js/student.js"]'
				);
				if (oldScript) oldScript.remove();

				// Load script mới và đợi nó load xong
				const script = document.createElement('script');
				script.src = '/js/student.js';
				script.onload = function () {
					console.log('✅ Student.js loaded successfully');
					// Call init function after script loads
					if (typeof window.initStudentManagement === 'function') {
						window.initStudentManagement();
					}
				};
				script.onerror = function () {
					console.error('❌ Failed to load student.js');
				};
				document.body.appendChild(script);
			}
			if (page === 'quanlymonhoc') {
				// Xóa script cũ nếu có
				const oldScript = document.querySelector(
					'script[src="/js/subject.js"]'
				);
				if (oldScript) oldScript.remove();

				// Load script mới và đợi nó load xong
				const script = document.createElement('script');
				script.src = '/js/subject.js';
				script.onload = function () {
					console.log('✅ Subject.js loaded successfully');
					// Call init function after script loads
					if (typeof window.initSubjectManagement === 'function') {
						window.initSubjectManagement();
					}
				};
				script.onerror = function () {
					console.error('❌ Failed to load subject.js');
				};
				document.body.appendChild(script);
			}
			if (page === 'quanlydiem') {
				// Xóa script cũ nếu có
				const oldScript = document.querySelector(
					'script[src="/js/grade.js"]'
				);
				if (oldScript) oldScript.remove();

				// Load script mới và đợi nó load xong
				const script = document.createElement('script');
				script.src = '/js/grade.js';
				script.onload = function () {
					console.log('✅ Grade.js loaded successfully');
					// Call init function after script loads
					if (typeof window.initGradeManagement === 'function') {
						window.initGradeManagement();
					}
				};
				script.onerror = function () {
					console.error('❌ Failed to load grade.js');
				};
				document.body.appendChild(script);
			}
		})
		.catch((error) => {
			console.error('Lỗi khi tải nội dung:', error);
			document.getElementById('content-area').innerHTML =
				'<p>Lỗi khi tải nội dung.</p>';
		})
		.finally(() => {
			isLoading = false; // Reset loading flag
		});
}

// ========== CHẠY SCRIPT CỦA PARTIAL (nếu có) ==========
function evalScripts(html) {
	const temp = document.createElement('div');
	temp.innerHTML = html;

	temp.querySelectorAll('script').forEach((script) => {
		if (!script.src) {
			const newScript = document.createElement('script');
			newScript.src = script.src;
			newScript.textContent = script.textContent;
			document.body.appendChild(newScript);
		}
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
					label: (ctx) => `${ctx.dataset.label}: ${ctx.raw} người`,
				},
			},
		},
	};

	createChart('studentGenderChart', {
		type: 'bar',
		data: {
			labels: ['CNTT', 'HTTT', 'KHMT'],
			datasets: [
				{
					label: 'Sinh viên Nam',
					data: [4500, 3800, 4200],
					backgroundColor: '#2E8B57',
				},
				{
					label: 'Sinh viên Nữ',
					data: [3800, 4200, 3900],
					backgroundColor: '#1E90FF',
				},
			],
		},
		options: {
			...commonOptions,
			scales: {
				y: {
					beginAtZero: true,
					max: 6000,
					ticks: {
						stepSize: 1000,
						callback: (val) =>
							val === 6000 ? '≥6000' : val + ' người',
					},
				},
			},
			plugins: {
				title: {
					display: true,
					text: 'THỐNG KÊ SINH VIÊN',
					font: { size: 16 },
				},
			},
		},
	});

	createChart('teacherGenderChart', {
		type: 'bar',
		data: {
			labels: ['CNTT', 'HTTT', 'KHMT'],
			datasets: [
				{
					label: 'Giáo viên Nam',
					data: [45, 60, 35],
					backgroundColor: '#3CB371',
				},
				{
					label: 'Giáo viên Nữ',
					data: [55, 40, 65],
					backgroundColor: '#D2691E',
				},
			],
		},
		options: {
			...commonOptions,
			scales: {
				y: {
					beginAtZero: true,
					max: 100,
					ticks: {
						stepSize: 20,
						callback: (val) =>
							val === 100 ? '≥100' : val + ' người',
					},
				},
			},
			plugins: {
				title: {
					display: true,
					text: 'THỐNG KÊ GIÁO VIÊN',
					font: { size: 16 },
				},
			},
		},
	});
}

// ========== HỖ TRỢ VẼ CHART ==========
function createChart(id, config) {
	const canvas = document.getElementById(id);
	if (!canvas) return;

	if (canvas.chart) canvas.chart.destroy();
	canvas.chart = new Chart(canvas.getContext('2d'), config);
}
