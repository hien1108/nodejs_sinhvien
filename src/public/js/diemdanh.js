// ===== ATTENDANCE MANAGEMENT FUNCTIONS =====
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

// Open modal for add/edit attendance
async function openAttendanceModal(
	id = '',
	date = '',
	classId = '',
	studentId = '',
	status = 'present',
	note = ''
) {
	const modal = document.getElementById('attendanceModal');
	const form = document.getElementById('attendanceForm');
	const title = document.getElementById('attendanceModalTitle');

	if (!modal || !form || !title) {
		console.error('Attendance modal elements not found');
		return;
	}

	document.getElementById('attendanceDate').value = date;
	document.getElementById('attendanceClass').value = classId;
	document.querySelector(
		`input[name="attendanceStatus"][value="${status}"]`
	).checked = true;
	document.getElementById('attendanceNote').value = note;
	document.getElementById('editingAttendanceId').value = id;

	title.textContent = id ? 'Sửa Điểm danh' : 'Thêm Điểm danh';

	// Nếu có classId, fetch students của lớp đó
	if (classId) {
		await fetchStudentsByClass(classId);
		// Sau khi fetch xong, set studentId nếu đang edit
		if (studentId) {
			document.getElementById('attendanceStudent').value = studentId;
		}
	}

	modal.style.display = 'flex';
}

// Close modal
function closeAttendanceModal() {
	const modal = document.getElementById('attendanceModal');
	const form = document.getElementById('attendanceForm');

	if (modal) modal.style.display = 'none';
	if (form) form.reset();
}

// Refresh attendance table
async function refreshAttendanceTable() {
	try {
		const response = await fetch('/attendance', {
			credentials: 'include',
		});

		if (response.ok) {
			const html = await response.text();
			const parser = new DOMParser();
			const doc = parser.parseFromString(html, 'text/html');

			// Update table body
			const newTableBody = doc.querySelector('#attendanceTableBody');
			const currentTableBody = document.getElementById(
				'attendanceTableBody'
			);

			if (newTableBody && currentTableBody) {
				currentTableBody.innerHTML = newTableBody.innerHTML;
			}
		} else {
			console.error('Failed to refresh attendance table');
		}
	} catch (error) {
		console.error('Error refreshing attendance table:', error);
	}
}
async function deleteAttendance(id) {
	if (!confirm('Bạn có chắc chắn muốn xóa bản ghi điểm danh này?')) return;

	showLoading();
	try {
		const response = await fetch(`/api/attendance/delete/${id}`, {
			method: 'DELETE',
			credentials: 'include',
		});
		const result = await response.json();
		if (response.ok) {
			showToast('Xóa điểm danh thành công!', 'success');
			await refreshAttendanceTable(); // Cập nhật bảng động thay vì reload
		} else {
			showToast(result.message || 'Lỗi khi xóa điểm danh', 'error');
		}
	} catch (error) {
		console.error('Delete attendance error:', error);
		showToast('Lỗi kết nối khi xóa điểm danh', 'error');
	} finally {
		hideLoading();
	}
}

// Fetch students by class
async function fetchStudentsByClass(classId) {
	if (!classId) {
		// Clear student select if no class selected
		const studentSelect = document.getElementById('attendanceStudent');
		if (studentSelect) {
			studentSelect.innerHTML =
				'<option value="">-- Chọn sinh viên --</option>';
		}
		return;
	}

	try {
		const response = await fetch(`/api/student/by-class/${classId}`, {
			credentials: 'include',
		});

		if (response.ok) {
			const result = await response.json();
			const studentSelect = document.getElementById('attendanceStudent');

			if (studentSelect) {
				// Clear current options
				studentSelect.innerHTML =
					'<option value="">-- Chọn sinh viên --</option>';

				// Add students from the selected class
				result.students.forEach((student) => {
					const option = document.createElement('option');
					option.value = student._id;
					option.textContent = `${student.studentId} - ${student.name}`;
					studentSelect.appendChild(option);
				});
			}
		} else {
			console.error('Failed to fetch students by class');
			showToast('Lỗi khi lấy danh sách sinh viên của lớp', 'error');
		}
	} catch (error) {
		console.error('Error fetching students by class:', error);
		showToast('Lỗi kết nối khi lấy danh sách sinh viên', 'error');
	}
}

// Handle class selection change
function handleClassSelectionChange(e) {
	const classId = e.target.value;
	fetchStudentsByClass(classId);
}

// Handle filter change
function handleFilterChange() {
	const selectedDate = document.getElementById('filterDate').value;
	const selectedClass = document.getElementById('filterClass').value;

	filterAttendanceTable(selectedDate, selectedClass);
}

// Filter attendance table by date and class
function filterAttendanceTable(filterDate, filterClass) {
	const rows = document.querySelectorAll('#attendanceTable tbody tr');

	rows.forEach((row) => {
		let showRow = true;

		// Get row data
		const rowDate = row.cells[1].textContent; // Ngày
		const rowClass = row.cells[2].textContent; // Lớp

		// Filter by date
		if (filterDate) {
			const formattedFilterDate = new Date(filterDate).toLocaleDateString(
				'vi-VN'
			);
			if (rowDate !== formattedFilterDate) {
				showRow = false;
			}
		}

		// Filter by class
		if (filterClass && showRow) {
			// So sánh bằng text content của lớp
			const classSelect = document.getElementById('filterClass');
			const selectedOption = classSelect.querySelector(
				`option[value="${filterClass}"]`
			);
			if (selectedOption && rowClass !== selectedOption.textContent) {
				showRow = false;
			}
		}

		// Show/hide row
		row.style.display = showRow ? '' : 'none';
	});

	// Update row numbers (STT)
	updateRowNumbers();
}

// Update row numbers after filtering
function updateRowNumbers() {
	const visibleRows = document.querySelectorAll(
		'#attendanceTable tbody tr[style=""], #attendanceTable tbody tr:not([style])'
	);

	visibleRows.forEach((row, index) => {
		row.cells[0].textContent = index + 1; // Update STT
	});
}

// Clear all filters
function clearFilters() {
	document.getElementById('filterDate').value = '';
	document.getElementById('filterClass').value = '';
	filterAttendanceTable('', '');
}

// Initialize attendance management
function initAttendanceManagement() {
	console.log('🚀 Initializing Attendance Management...');

	// Attach form handler
	setTimeout(() => {
		const form = document.getElementById('attendanceForm');
		if (form) {
			form.removeEventListener('submit', handleAttendanceFormSubmit);
			form.addEventListener('submit', handleAttendanceFormSubmit);
			console.log('✅ Attendance form handler attached');
		}
	}, 100);

	// Attach search handler
	setTimeout(() => {
		const searchInput = document.getElementById('searchAttendance');
		if (searchInput) {
			searchInput.removeEventListener('input', handleAttendanceSearch);
			searchInput.addEventListener('input', handleAttendanceSearch);
			console.log('✅ Attendance search handler attached');
		}
	}, 100);

	// Attach class selection handler
	setTimeout(() => {
		const classSelect = document.getElementById('attendanceClass');
		if (classSelect) {
			classSelect.removeEventListener(
				'change',
				handleClassSelectionChange
			);
			classSelect.addEventListener('change', handleClassSelectionChange);
			console.log('✅ Attendance class selection handler attached');
		}
	}, 100);

	// Attach filter handlers
	setTimeout(() => {
		const filterDate = document.getElementById('filterDate');
		const filterClass = document.getElementById('filterClass');

		if (filterDate) {
			filterDate.removeEventListener('change', handleFilterChange);
			filterDate.addEventListener('change', handleFilterChange);
			console.log('✅ Date filter handler attached');
		}

		if (filterClass) {
			filterClass.removeEventListener('change', handleFilterChange);
			filterClass.addEventListener('change', handleFilterChange);
			console.log('✅ Class filter handler attached');
		}
	}, 100);

	// Attach modal click outside handler
	setTimeout(() => {
		window.removeEventListener('click', handleModalClick);
		window.addEventListener('click', handleModalClick);
		console.log('✅ Attendance modal click handler attached');
	}, 100);
}

// Handle form submission
async function handleAttendanceFormSubmit(e) {
	e.preventDefault();

	const id = document.getElementById('editingAttendanceId').value;
	const date = document.getElementById('attendanceDate').value;
	const classId = document.getElementById('attendanceClass').value;
	const studentId = document.getElementById('attendanceStudent').value;
	const status = document.querySelector(
		'input[name="attendanceStatus"]:checked'
	).value;
	const note = document.getElementById('attendanceNote').value.trim();

	if (!date || !classId || !studentId) {
		showToast('Vui lòng điền đầy đủ thông tin bắt buộc', 'error');
		return;
	}

	const isEdit = !!id;
	const url = isEdit
		? `/api/attendance/update/${id}`
		: '/api/attendance/create';

	showLoading();
	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			body: JSON.stringify({
				date,
				class: classId,
				student: studentId,
				status,
				note,
			}),
		});

		const result = await response.json();
		if (response.ok) {
			showToast(
				result.message ||
					`${isEdit ? 'Cập nhật' : 'Thêm'} điểm danh thành công!`,
				'success'
			);
			closeAttendanceModal();
			await refreshAttendanceTable(); // Cập nhật bảng động thay vì reload
		} else {
			showToast(
				result.message ||
					`Lỗi khi ${isEdit ? 'cập nhật' : 'thêm'} điểm danh`,
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
function handleAttendanceSearch(e) {
	const term = e.target.value.toLowerCase();
	const rows = document.querySelectorAll('#attendanceTable tbody tr');

	rows.forEach((row) => {
		const date = row.cells[1].textContent.toLowerCase();
		const className = row.cells[2].textContent.toLowerCase();
		const studentId = row.cells[3].textContent.toLowerCase();
		const studentName = row.cells[4].textContent.toLowerCase();
		const status = row.cells[5].textContent.toLowerCase();

		row.style.display =
			date.includes(term) ||
			className.includes(term) ||
			studentId.includes(term) ||
			studentName.includes(term) ||
			status.includes(term)
				? ''
				: 'none';
	});
}

// Handle modal click outside
function handleModalClick(e) {
	const modal = document.getElementById('attendanceModal');
	if (e.target === modal) {
		closeAttendanceModal();
	}
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initAttendanceManagement);
} else {
	initAttendanceManagement();
}
