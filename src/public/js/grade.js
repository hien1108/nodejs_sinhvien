// ===== GRADE MANAGEMENT FUNCTIONS =====
// Global functions for SPA compatibility

// Show toast notification
function showToast(message, type = 'success') {
	const toast = document.getElementById('toast');
	const toastMessage = document.getElementById('toastMessage');

	if (toast && toastMessage) {
		toastMessage.textContent = message;
		toast.className = `toast ${type}`;
		toast.classList.add('show');

		setTimeout(() => {
			toast.classList.remove('show');
		}, 3000);
	}
}

// Show/hide loading spinner
function showLoading() {
	const spinner = document.getElementById('loadingSpinner');
	if (spinner) spinner.style.display = 'flex';
}

function hideLoading() {
	const spinner = document.getElementById('loadingSpinner');
	if (spinner) spinner.style.display = 'none';
}

// Open modal for add/edit grade
function openGradeModal(
	id = '',
	studentId = '',
	subjectId = '',
	diemQT = '',
	diemThi = ''
) {
	const modal = document.getElementById('gradeModal');
	const form = document.getElementById('gradeForm');
	const title = document.getElementById('gradeModalTitle');

	if (!modal || !form || !title) {
		console.error('Grade modal elements not found');
		return;
	}

	document.getElementById('studentSelect').value = studentId;
	document.getElementById('subjectSelect').value = subjectId;
	document.getElementById('diemQTInput').value = diemQT;
	document.getElementById('diemThiInput').value = diemThi;
	document.getElementById('editingGradeId').value = id;

	title.textContent = id ? 'Sửa Điểm' : 'Thêm Điểm';
	modal.style.display = 'flex';
}

// Close modal
function closeGradeModal() {
	const modal = document.getElementById('gradeModal');
	const form = document.getElementById('gradeForm');

	if (modal) modal.style.display = 'none';
	if (form) form.reset();
}

// Delete grade function
async function deleteGrade(id) {
	if (!confirm('Bạn có chắc chắn muốn xóa điểm này?')) return;

	showLoading();
	try {
		const response = await fetch(`/api/grade/delete/${id}`, {
			method: 'DELETE',
			credentials: 'include',
		});

		const result = await response.json();

		if (response.ok) {
			showToast('Xóa điểm thành công!', 'success');
			// Cập nhật bảng dữ liệu thay vì reload trang
			await refreshGradeTable();
		} else {
			showToast(result.message || 'Lỗi khi xóa điểm', 'error');
		}
	} catch (error) {
		console.error('Delete grade error:', error);
		showToast('Lỗi kết nối khi xóa điểm', 'error');
	} finally {
		hideLoading();
	}
}

// Refresh grade table data without page reload
async function refreshGradeTable() {
	try {
		showLoading();
		const response = await fetch('/quanlydiem', {
			credentials: 'include',
		});

		if (response.ok) {
			const html = await response.text();
			const parser = new DOMParser();
			const doc = parser.parseFromString(html, 'text/html');
			const newTableBody = doc.querySelector('#gradeTableBody');

			if (newTableBody) {
				const currentTableBody =
					document.getElementById('gradeTableBody');
				if (currentTableBody) {
					currentTableBody.innerHTML = newTableBody.innerHTML;
				}
			}
		}
	} catch (error) {
		console.error('Error refreshing grade table:', error);
	} finally {
		hideLoading();
	}
}

// Initialize grade management page
function initGradeManagement() {
	console.log('🚀 Initializing Grade Management...');

	// Try to attach form submit handler
	let retryCount = 0;
	function attachFormHandler() {
		const form = document.getElementById('gradeForm');

		if (!form && retryCount < 5) {
			retryCount++;
			console.log(`⏳ Grade form not ready, retry ${retryCount}/5...`);
			setTimeout(attachFormHandler, 200);
			return;
		}

		if (!form) {
			console.error('❌ Grade form not found after retries');
			return;
		}

		// Remove existing listeners to prevent duplicates
		form.removeEventListener('submit', handleGradeFormSubmit);
		form.addEventListener('submit', handleGradeFormSubmit);
		console.log('✅ Grade form handler attached');
	}

	attachFormHandler();

	// Attach search handler
	setTimeout(() => {
		const searchInput = document.getElementById('searchGrade');
		if (searchInput) {
			searchInput.removeEventListener('input', handleGradeSearch);
			searchInput.addEventListener('input', handleGradeSearch);
			console.log('✅ Grade search handler attached');
		}
	}, 100);

	// Attach modal click outside handler
	setTimeout(() => {
		window.removeEventListener('click', handleModalClick);
		window.addEventListener('click', handleModalClick);
		console.log('✅ Grade modal click handler attached');
	}, 100);
}

// Handle form submission
async function handleGradeFormSubmit(e) {
	e.preventDefault();
	console.log('📝 Grade form submitted');

	const form = e.target;
	const id = document.getElementById('editingGradeId').value;
	const student = document.getElementById('studentSelect').value;
	const subject = document.getElementById('subjectSelect').value;
	const diemQT = document.getElementById('diemQTInput').value.trim();
	const diemThi = document.getElementById('diemThiInput').value.trim();

	if (!student || !subject || !diemQT || !diemThi) {
		showToast('Vui lòng điền đầy đủ thông tin', 'error');
		return;
	}

	// Validate điểm số
	const diemQTNum = parseFloat(diemQT);
	const diemThiNum = parseFloat(diemThi);

	if (
		isNaN(diemQTNum) ||
		isNaN(diemThiNum) ||
		diemQTNum < 0 ||
		diemQTNum > 10 ||
		diemThiNum < 0 ||
		diemThiNum > 10
	) {
		showToast('Điểm số phải từ 0 đến 10', 'error');
		return;
	}

	const isEdit = !!id;
	const url = isEdit ? `/api/grade/update/${id}` : '/api/grade/create';
	const method = 'POST';

	console.log(`🔄 ${isEdit ? 'Updating' : 'Creating'} grade:`, {
		student,
		subject,
		diemQT,
		diemThi,
	});

	showLoading();
	try {
		const response = await fetch(url, {
			method,
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			body: JSON.stringify({ student, subject, diemQT, diemThi }),
		});

		const result = await response.json();

		if (response.ok) {
			showToast(
				result.message ||
					`${isEdit ? 'Cập nhật' : 'Thêm'} điểm thành công!`,
				'success'
			);
			closeGradeModal();
			// Cập nhật bảng dữ liệu thay vì reload trang
			await refreshGradeTable();
		} else {
			showToast(
				result.message ||
					`Lỗi khi ${isEdit ? 'cập nhật' : 'thêm'} điểm`,
				'error'
			);
		}
	} catch (error) {
		console.error('Form submit error:', error);
		showToast('Lỗi kết nối', 'error');
	} finally {
		hideLoading();
	}
}

// Handle search functionality
function handleGradeSearch(e) {
	const term = e.target.value.toLowerCase();
	const rows = document.querySelectorAll('#gradeTable tbody tr');

	rows.forEach((row) => {
		const maSV = row.cells[0].textContent.toLowerCase();
		const tenSV = row.cells[1].textContent.toLowerCase();
		const maMH = row.cells[2].textContent.toLowerCase();
		const tenMH = row.cells[3].textContent.toLowerCase();

		row.style.display =
			maSV.includes(term) ||
			tenSV.includes(term) ||
			maMH.includes(term) ||
			tenMH.includes(term)
				? ''
				: 'none';
	});
}

// Handle modal click outside
function handleModalClick(e) {
	const modal = document.getElementById('gradeModal');
	if (e.target === modal) {
		closeGradeModal();
	}
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initGradeManagement);
} else {
	initGradeManagement();
}
