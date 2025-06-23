// ===== KHOA.JS - Faculty Management (SPA Version) =====
console.log('🔄 Loading khoa.js...');

// ===== GLOBAL FUNCTIONS (Available immediately) =====

// Mở modal thêm/sửa khoa
window.openKhoaModal = function (id = '', maKhoa = '', tenKhoa = '') {
	console.log('📂 Opening modal:', { id, maKhoa, tenKhoa });

	const modal = document.getElementById('khoaModal');
	const form = document.getElementById('khoaForm');

	if (!modal || !form) {
		console.error('❌ Modal elements not found');
		return;
	}

	// Reset form
	form.reset();
	form.removeAttribute('data-id');

	// Set title
	const modalTitle = document.getElementById('modalTitle');
	if (modalTitle) {
		modalTitle.textContent = id ? 'Chỉnh sửa Khoa' : 'Thêm Khoa';
	}

	// Fill data for edit
	if (id) {
		const maKhoaInput = document.getElementById('maKhoa');
		const tenKhoaInput = document.getElementById('tenKhoa');

		if (maKhoaInput) maKhoaInput.value = maKhoa;
		if (tenKhoaInput) tenKhoaInput.value = tenKhoa;
		form.dataset.id = id;
	}

	// Show modal with flexbox centering
	modal.style.display = 'flex';
	setTimeout(() => modal.classList.add('show'), 10);
};

// Đóng modal
window.closeKhoaModal = function () {
	console.log('❌ Closing modal');
	const modal = document.getElementById('khoaModal');
	if (modal) {
		modal.classList.remove('show');
		setTimeout(() => (modal.style.display = 'none'), 300);
	}
};

// Edit khoa
window.editKhoa = function (id, maKhoa, tenKhoa) {
	console.log('✏️ Edit khoa:', { id, maKhoa, tenKhoa });
	window.openKhoaModal(id, maKhoa, tenKhoa);
};

// Delete khoa
window.deleteKhoa = async function (id) {
	console.log('🗑️ Delete khoa:', id);

	if (!confirm('Bạn có chắc chắn muốn xóa khoa này không?')) {
		return;
	}

	try {
		showLoading();

		const response = await fetch(`/api/faculty/delete/${id}`, {
			method: 'DELETE',
			credentials: 'include',
		});

		hideLoading();
		if (response.ok) {
			showToast('Xóa khoa thành công', 'success');
			// Cập nhật bảng dữ liệu thay vì reload trang
			await refreshFacultyTable();
		} else {
			const errorData = await response.json();
			showToast(errorData.message || 'Xóa không thành công', 'error');
		}
	} catch (error) {
		console.error('Error:', error);
		hideLoading();
		showToast('Có lỗi kết nối đến server', 'error');
	}
};

// Refresh faculty table data without page reload
async function refreshFacultyTable() {
	try {
		showLoading();
		const response = await fetch('/khoa', {
			credentials: 'include',
		});

		if (response.ok) {
			const html = await response.text();
			const parser = new DOMParser();
			const doc = parser.parseFromString(html, 'text/html');
			const newTableBody = doc.querySelector('#facultyTableBody');

			if (newTableBody) {
				const currentTableBody =
					document.getElementById('facultyTableBody');
				if (currentTableBody) {
					currentTableBody.innerHTML = newTableBody.innerHTML;
				}
			}
		}
	} catch (error) {
		console.error('Error refreshing faculty table:', error);
	} finally {
		hideLoading();
	}
}

// ===== UTILITY FUNCTIONS =====

function showLoading() {
	const spinner = document.getElementById('loadingSpinner');
	if (spinner) {
		spinner.style.display = 'flex';
	}
}

function hideLoading() {
	const spinner = document.getElementById('loadingSpinner');
	if (spinner) {
		spinner.style.display = 'none';
	}
}

function showToast(message, type = 'success') {
	console.log('📢 Toast:', message, type);

	const toast = document.getElementById('toast');
	if (!toast) {
		console.error('❌ Toast element not found');
		return;
	}

	const icon = toast.querySelector('.toast-icon');
	const messageEl = toast.querySelector('.toast-message');

	if (messageEl) messageEl.textContent = message;

	toast.className = `toast ${type}`;
	if (icon) {
		if (type === 'success') {
			icon.className = 'toast-icon bx bx-check-circle';
		} else if (type === 'error') {
			icon.className = 'toast-icon bx bx-error-circle';
		}
	}

	toast.classList.add('show');

	setTimeout(() => {
		toast.classList.remove('show');
	}, 3000);
}

// Form submit handler function (separate for better management)
async function handleKhoaFormSubmit(e) {
	e.preventDefault();
	console.log('📤 Form submitted');

	const form = e.target;
	const id = form.dataset.id;
	const maKhoa = document.getElementById('maKhoa')?.value?.trim();
	const tenKhoa = document.getElementById('tenKhoa')?.value?.trim();

	if (!maKhoa || !tenKhoa) {
		showToast('Vui lòng điền đầy đủ thông tin', 'error');
		return;
	}

	try {
		const url = id ? `/api/faculty/update/${id}` : '/api/faculty/create';

		showLoading();

		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ maKhoa, tenKhoa }),
			credentials: 'include',
		});

		const contentType = response.headers.get('content-type');
		if (!contentType || !contentType.includes('application/json')) {
			throw new Error('Invalid response from server');
		}

		const result = await response.json();
		hideLoading();

		if (response.ok) {
			showToast(
				id ? 'Cập nhật thành công!' : 'Thêm khoa thành công!',
				'success'
			);
			window.closeKhoaModal();
			// Cập nhật bảng dữ liệu thay vì reload trang
			await refreshFacultyTable();
		} else {
			showToast(result.message || 'Có lỗi xảy ra', 'error');
		}
	} catch (error) {
		console.error('Error:', error);
		hideLoading();
		showToast(error.message || 'Có lỗi kết nối đến server', 'error');
	}
}

// ===== INITIALIZATION FOR SPA =====
function initKhoaFunctionality() {
	console.log('✅ Initializing khoa functionality');

	// Wait for elements to be available
	const checkAndInit = () => {
		const khoaForm = document.getElementById('khoaForm');
		const searchInput = document.getElementById('searchKhoa');

		if (!khoaForm) {
			console.warn('⚠️ khoaForm not found, retrying in 100ms...');
			setTimeout(checkAndInit, 100);
			return;
		}

		console.log('📝 Setting up form handler');

		// Remove existing listeners to prevent duplicates
		khoaForm.removeEventListener('submit', handleKhoaFormSubmit);
		khoaForm.addEventListener('submit', handleKhoaFormSubmit);

		// Search handler
		if (searchInput) {
			console.log('🔍 Setting up search handler');

			let searchTimeout;
			searchInput.addEventListener('input', function (e) {
				const searchTerm = e.target.value.toLowerCase();
				clearTimeout(searchTimeout);

				if (searchTerm === '') {
					const rows = document.querySelectorAll(
						'#khoaTable tbody tr'
					);
					rows.forEach((row) => (row.style.display = ''));
					return;
				}

				// Frontend search
				const rows = document.querySelectorAll('#khoaTable tbody tr');
				rows.forEach((row) => {
					const maKhoa =
						row.cells[0]?.textContent.toLowerCase() || '';
					const tenKhoa =
						row.cells[1]?.textContent.toLowerCase() || '';

					if (
						maKhoa.includes(searchTerm) ||
						tenKhoa.includes(searchTerm)
					) {
						row.style.display = '';
					} else {
						row.style.display = 'none';
					}
				});
			});
		}

		// Modal click outside to close
		const modal = document.getElementById('khoaModal');
		if (modal) {
			modal.addEventListener('click', function (event) {
				if (event.target === modal) {
					window.closeKhoaModal();
				}
			});
		}

		console.log('🎉 Khoa functionality initialization complete');
	};

	checkAndInit();
}

// Auto-initialize based on context
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initKhoaFunctionality);
} else {
	// For SPA context, init after short delay
	setTimeout(initKhoaFunctionality, 100);
}

// Also expose init function globally for manual calling
window.initKhoaFunctionality = initKhoaFunctionality;

// Test functions are available
console.log('✅ khoa.js loaded - Global functions available:', {
	openKhoaModal: typeof window.openKhoaModal,
	closeKhoaModal: typeof window.closeKhoaModal,
	editKhoa: typeof window.editKhoa,
	deleteKhoa: typeof window.deleteKhoa,
});
