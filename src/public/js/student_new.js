// ===== STUDENT MANAGEMENT FUNCTIONS =====
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

// Open modal for add/edit student
function openStudentModal(
	id = '',
	studentId = '',
	name = '',
	dob = '',
	gender = '',
	maKhoa = '',
	classId = '',
	email = '',
	phone = '',
	address = ''
) {
	const modal = document.getElementById('studentModal');
	const form = document.getElementById('studentForm');
	const title = document.getElementById('studentModalTitle');

	if (!modal || !form || !title) {
		console.error('Student modal elements not found');
		return;
	}

	// Fill form data
	document.getElementById('studentId').value = studentId;
	document.getElementById('studentName').value = name;
	document.getElementById('studentDob').value = dob
		? dob.split('/').reverse().join('-')
		: '';
	document.getElementById('studentGender').value = gender;
	document.getElementById('studentFaculty').value = maKhoa;
	document.getElementById('studentClass').value = classId;
	document.getElementById('studentEmail').value = email;
	document.getElementById('studentPhone').value = phone;
	document.getElementById('studentAddress').value = address;
	document.getElementById('editingStudentId').value = id;

	title.textContent = id ? 'Sửa Sinh viên' : 'Thêm Sinh viên';
	modal.style.display = 'flex';
}

// Close modal
function closeStudentModal() {
	const modal = document.getElementById('studentModal');
	const form = document.getElementById('studentForm');

	if (modal) modal.style.display = 'none';
	if (form) form.reset();
}

// Delete student function
async function deleteStudent(id) {
	if (!confirm('Bạn có chắc chắn muốn xóa sinh viên này?')) return;

	showLoading();
	try {
		const response = await fetch(`/api/student/delete/${id}`, {
			method: 'DELETE',
			credentials: 'include',
		});

		const result = await response.json();

		if (response.ok) {
			showToast('Xóa sinh viên thành công!', 'success');
			setTimeout(() => location.reload(), 1000);
		} else {
			showToast(result.message || 'Lỗi khi xóa sinh viên', 'error');
		}
	} catch (error) {
		console.error('Delete student error:', error);
		showToast('Lỗi kết nối khi xóa sinh viên', 'error');
	} finally {
		hideLoading();
	}
}

// Initialize student management page
function initStudentManagement() {
	console.log('🚀 Initializing Student Management...');

	// Try to attach form submit handler
	let retryCount = 0;
	function attachFormHandler() {
		const form = document.getElementById('studentForm');

		if (!form && retryCount < 5) {
			retryCount++;
			console.log(`⏳ Student form not ready, retry ${retryCount}/5...`);
			setTimeout(attachFormHandler, 200);
			return;
		}

		if (!form) {
			console.error('❌ Student form not found after retries');
			return;
		}

		// Remove existing listeners to prevent duplicates
		form.removeEventListener('submit', handleStudentFormSubmit);
		form.addEventListener('submit', handleStudentFormSubmit);
		console.log('✅ Student form handler attached');
	}

	attachFormHandler();

	// Attach search handler
	setTimeout(() => {
		const searchInput = document.getElementById('searchStudent');
		if (searchInput) {
			searchInput.removeEventListener('input', handleStudentSearch);
			searchInput.addEventListener('input', handleStudentSearch);
			console.log('✅ Student search handler attached');
		}
	}, 100);

	// Attach modal click outside handler
	setTimeout(() => {
		window.removeEventListener('click', handleModalClick);
		window.addEventListener('click', handleModalClick);
		console.log('✅ Student modal click handler attached');
	}, 100);
}

// Handle form submission
async function handleStudentFormSubmit(e) {
	e.preventDefault();
	console.log('📝 Student form submitted');

	const form = e.target;
	const id = document.getElementById('editingStudentId').value;

	const studentData = {
		studentId: document.getElementById('studentId').value.trim(),
		name: document.getElementById('studentName').value.trim(),
		dob: document.getElementById('studentDob').value,
		gender: document.getElementById('studentGender').value,
		maKhoa: document.getElementById('studentFaculty').value || null,
		class: document.getElementById('studentClass').value || null,
		email: document.getElementById('studentEmail').value.trim(),
		phone: document.getElementById('studentPhone').value.trim(),
		address: document.getElementById('studentAddress').value.trim(),
	};

	// Validate required fields
	if (!studentData.studentId || !studentData.name) {
		showToast('Mã sinh viên và tên sinh viên không được để trống', 'error');
		return;
	}

	const isEdit = !!id;
	const url = isEdit ? `/api/student/update/${id}` : '/api/student/create';
	const method = 'POST';

	console.log(`🔄 ${isEdit ? 'Updating' : 'Creating'} student:`, studentData);

	showLoading();
	try {
		const response = await fetch(url, {
			method,
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			body: JSON.stringify(studentData),
		});

		const result = await response.json();

		if (response.ok) {
			showToast(
				result.message ||
					`${isEdit ? 'Cập nhật' : 'Thêm'} sinh viên thành công!`,
				'success'
			);
			closeStudentModal();
			setTimeout(() => location.reload(), 1000);
		} else {
			showToast(
				result.message ||
					`Lỗi khi ${isEdit ? 'cập nhật' : 'thêm'} sinh viên`,
				'error'
			);
		}
	} catch (error) {
		console.error('Student form submit error:', error);
		showToast('Lỗi kết nối', 'error');
	} finally {
		hideLoading();
	}
}

// Handle search functionality
function handleStudentSearch(e) {
	const term = e.target.value.toLowerCase();
	const rows = document.querySelectorAll('#studentTable tbody tr');

	rows.forEach((row) => {
		const match = Array.from(row.cells).some((cell) =>
			cell.textContent.toLowerCase().includes(term)
		);
		row.style.display = match ? '' : 'none';
	});
}

// Handle modal click outside
function handleModalClick(e) {
	const modal = document.getElementById('studentModal');
	if (e.target === modal) {
		closeStudentModal();
	}
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initStudentManagement);
} else {
	initStudentManagement();
}
