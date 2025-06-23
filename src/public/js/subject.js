// ===== SUBJECT MANAGEMENT FUNCTIONS =====
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

// Open modal for add/edit subject
function openSubjectModal(id = '', maMon = '', tenMon = '', tinChi = '') {
	const modal = document.getElementById('subjectModal');
	const form = document.getElementById('subjectForm');
	const title = document.getElementById('subjectModalTitle');

	if (!modal || !form || !title) {
		console.error('Subject modal elements not found');
		return;
	}

	document.getElementById('maSubject').value = maMon;
	document.getElementById('tenSubject').value = tenMon;
	document.getElementById('soTinChi').value = tinChi;
	document.getElementById('editingSubjectId').value = id;

	title.textContent = id ? 'Sửa Môn học' : 'Thêm Môn học';
	modal.style.display = 'flex';
}

// Close modal
function closeSubjectModal() {
	const modal = document.getElementById('subjectModal');
	const form = document.getElementById('subjectForm');

	if (modal) modal.style.display = 'none';
	if (form) form.reset();
}

// Delete subject function
async function deleteSubject(id) {
	if (!confirm('Bạn có chắc chắn muốn xóa môn học này?')) return;

	showLoading();
	try {
		const response = await fetch(`/api/subject/delete/${id}`, {
			method: 'DELETE',
			credentials: 'include',
		});

		const result = await response.json();
		if (response.ok) {
			showToast('Xóa môn học thành công!', 'success');
			// Cập nhật bảng dữ liệu thay vì reload trang
			await refreshSubjectTable();
		} else {
			showToast(result.message || 'Lỗi khi xóa môn học', 'error');
		}
	} catch (error) {
		console.error('Delete subject error:', error);
		showToast('Lỗi kết nối khi xóa môn học', 'error');
	} finally {
		hideLoading();
	}
}

// Refresh subject table data without page reload
async function refreshSubjectTable() {
	try {
		showLoading();
		const response = await fetch('/quanlymonhoc', {
			credentials: 'include',
		});

		if (response.ok) {
			const html = await response.text();
			const parser = new DOMParser();
			const doc = parser.parseFromString(html, 'text/html');
			const newTableBody = doc.querySelector('#subjectTableBody');

			if (newTableBody) {
				const currentTableBody =
					document.getElementById('subjectTableBody');
				if (currentTableBody) {
					currentTableBody.innerHTML = newTableBody.innerHTML;
				}
			}
		}
	} catch (error) {
		console.error('Error refreshing subject table:', error);
	} finally {
		hideLoading();
	}
}

// Initialize subject management page
function initSubjectManagement() {
	console.log('🚀 Initializing Subject Management...');

	// Try to attach form submit handler
	let retryCount = 0;
	function attachFormHandler() {
		const form = document.getElementById('subjectForm');

		if (!form && retryCount < 5) {
			retryCount++;
			console.log(`⏳ Subject form not ready, retry ${retryCount}/5...`);
			setTimeout(attachFormHandler, 200);
			return;
		}

		if (!form) {
			console.error('❌ Subject form not found after retries');
			return;
		}

		// Remove existing listeners to prevent duplicates
		form.removeEventListener('submit', handleSubjectFormSubmit);
		form.addEventListener('submit', handleSubjectFormSubmit);
		console.log('✅ Subject form handler attached');
	}

	attachFormHandler();

	// Attach search handler
	setTimeout(() => {
		const searchInput = document.getElementById('searchSubject');
		if (searchInput) {
			searchInput.removeEventListener('input', handleSubjectSearch);
			searchInput.addEventListener('input', handleSubjectSearch);
			console.log('✅ Subject search handler attached');
		}
	}, 100);

	// Attach modal click outside handler
	setTimeout(() => {
		window.removeEventListener('click', handleModalClick);
		window.addEventListener('click', handleModalClick);
		console.log('✅ Subject modal click handler attached');
	}, 100);
}

// Handle form submission
async function handleSubjectFormSubmit(e) {
	e.preventDefault();
	console.log('📝 Subject form submitted');

	const form = e.target;
	const id = document.getElementById('editingSubjectId').value;
	const maMon = document.getElementById('maSubject').value.trim();
	const tenMon = document.getElementById('tenSubject').value.trim();
	const soTinChi = document.getElementById('soTinChi').value.trim();

	if (!maMon || !tenMon || !soTinChi) {
		showToast('Vui lòng điền đầy đủ thông tin', 'error');
		return;
	}

	// Validate số tín chỉ
	const tinChi = parseInt(soTinChi);
	if (isNaN(tinChi) || tinChi < 1 || tinChi > 10) {
		showToast('Số tín chỉ phải là số từ 1 đến 10', 'error');
		return;
	}

	const isEdit = !!id;
	const url = isEdit ? `/api/subject/update/${id}` : '/api/subject/create';
	const method = 'POST';

	console.log(`🔄 ${isEdit ? 'Updating' : 'Creating'} subject:`, {
		maMon,
		tenMon,
		soTinChi,
	});

	showLoading();
	try {
		const response = await fetch(url, {
			method,
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			body: JSON.stringify({ maMon, tenMon, soTinChi }),
		});

		const result = await response.json();
		if (response.ok) {
			showToast(
				result.message ||
					`${isEdit ? 'Cập nhật' : 'Thêm'} môn học thành công!`,
				'success'
			);
			closeSubjectModal();
			// Cập nhật bảng dữ liệu thay vì reload trang
			await refreshSubjectTable();
		} else {
			showToast(
				result.message ||
					`Lỗi khi ${isEdit ? 'cập nhật' : 'thêm'} môn học`,
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
function handleSubjectSearch(e) {
	const term = e.target.value.toLowerCase();
	const rows = document.querySelectorAll('#subjectTable tbody tr');

	rows.forEach((row) => {
		const ma = row.cells[0].textContent.toLowerCase();
		const ten = row.cells[1].textContent.toLowerCase();
		const tinChi = row.cells[2].textContent.toLowerCase();
		row.style.display =
			ma.includes(term) || ten.includes(term) || tinChi.includes(term)
				? ''
				: 'none';
	});
}

// Handle modal click outside
function handleModalClick(e) {
	const modal = document.getElementById('subjectModal');
	if (e.target === modal) {
		closeSubjectModal();
	}
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initSubjectManagement);
} else {
	initSubjectManagement();
}
