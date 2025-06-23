// ===== CLASS MANAGEMENT FUNCTIONS =====
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

// Open modal for add/edit class
function openClassModal(id = '', maLop = '', tenLop = '') {
	const modal = document.getElementById('classModal');
	const form = document.getElementById('classForm');
	const title = document.getElementById('classModalTitle');

	if (!modal || !form || !title) {
		console.error('Modal elements not found');
		return;
	}

	document.getElementById('maClass').value = maLop;
	document.getElementById('tenClass').value = tenLop;
	form.dataset.id = id || '';
	title.textContent = id ? 'Sửa Lớp' : 'Thêm Lớp';
	modal.style.display = 'flex';
}

// Close modal
function closeClassModal() {
	const modal = document.getElementById('classModal');
	const form = document.getElementById('classForm');

	if (modal) modal.style.display = 'none';
	if (form) form.reset();
}

// Delete class function
async function deleteClass(id) {
	if (!confirm('Bạn có chắc chắn muốn xóa lớp này?')) return;

	showLoading();
	try {
		const response = await fetch(`/api/class/delete/${id}`, {
			method: 'DELETE',
			credentials: 'include',
		});

		const result = await response.json();
		if (response.ok) {
			showToast('Xóa lớp thành công!', 'success');
			// Cập nhật bảng dữ liệu thay vì reload trang
			await refreshClassTable();
		} else {
			showToast(result.message || 'Lỗi khi xóa lớp', 'error');
		}
	} catch (error) {
		console.error('Delete class error:', error);
		showToast('Lỗi kết nối khi xóa lớp', 'error');
	} finally {
		hideLoading();
	}
}

// Refresh class table data without page reload
async function refreshClassTable() {
	try {
		showLoading();
		const response = await fetch('/lop', {
			credentials: 'include',
		});

		if (response.ok) {
			const html = await response.text();
			const parser = new DOMParser();
			const doc = parser.parseFromString(html, 'text/html');
			const newTableBody = doc.querySelector('#classTableBody');

			if (newTableBody) {
				const currentTableBody =
					document.getElementById('classTableBody');
				if (currentTableBody) {
					currentTableBody.innerHTML = newTableBody.innerHTML;
				}
			}
		}
	} catch (error) {
		console.error('Error refreshing class table:', error);
	} finally {
		hideLoading();
	}
}

// Initialize class management page
function initClassManagement() {
	console.log('🚀 Initializing Class Management...');

	// Try to attach form submit handler
	let retryCount = 0;
	function attachFormHandler() {
		const form = document.getElementById('classForm');

		if (!form && retryCount < 5) {
			retryCount++;
			console.log(`⏳ Form not ready, retry ${retryCount}/5...`);
			setTimeout(attachFormHandler, 200);
			return;
		}

		if (!form) {
			console.error('❌ Class form not found after retries');
			return;
		}

		// Remove existing listeners to prevent duplicates
		form.removeEventListener('submit', handleClassFormSubmit);
		form.addEventListener('submit', handleClassFormSubmit);
		console.log('✅ Class form handler attached');
	}

	attachFormHandler();

	// Attach search handler
	setTimeout(() => {
		const searchInput = document.getElementById('searchClass');
		if (searchInput) {
			searchInput.removeEventListener('input', handleClassSearch);
			searchInput.addEventListener('input', handleClassSearch);
			console.log('✅ Class search handler attached');
		}
	}, 100);

	// Attach modal click outside handler
	setTimeout(() => {
		window.removeEventListener('click', handleModalClick);
		window.addEventListener('click', handleModalClick);
		console.log('✅ Class modal click handler attached');
	}, 100);
}

// Handle form submission
async function handleClassFormSubmit(e) {
	e.preventDefault();
	console.log('📝 Class form submitted');

	const form = e.target;
	const id = form.dataset.id;
	const maLop = document.getElementById('maClass').value.trim();
	const tenLop = document.getElementById('tenClass').value.trim();

	if (!maLop || !tenLop) {
		showToast('Vui lòng điền đầy đủ thông tin', 'error');
		return;
	}

	const isEdit = !!id;
	const url = isEdit ? `/api/class/update/${id}` : '/api/class/create';
	const method = 'POST';

	console.log(`🔄 ${isEdit ? 'Updating' : 'Creating'} class:`, {
		maLop,
		tenLop,
	});

	showLoading();
	try {
		const response = await fetch(url, {
			method,
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			body: JSON.stringify({ maLop, tenLop }),
		});

		const result = await response.json();
		if (response.ok) {
			showToast(
				result.message ||
					`${isEdit ? 'Cập nhật' : 'Thêm'} lớp thành công!`,
				'success'
			);
			closeClassModal();
			// Cập nhật bảng dữ liệu thay vì reload trang
			await refreshClassTable();
		} else {
			showToast(
				result.message || `Lỗi khi ${isEdit ? 'cập nhật' : 'thêm'} lớp`,
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
function handleClassSearch(e) {
	const term = e.target.value.toLowerCase();
	const rows = document.querySelectorAll('#classTable tbody tr');

	rows.forEach((row) => {
		const ma = row.cells[0].textContent.toLowerCase();
		const ten = row.cells[1].textContent.toLowerCase();
		row.style.display =
			ma.includes(term) || ten.includes(term) ? '' : 'none';
	});
}

// Handle modal click outside
function handleModalClick(e) {
	const modal = document.getElementById('classModal');
	if (e.target === modal) {
		closeClassModal();
	}
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initClassManagement);
} else {
	initClassManagement();
}
