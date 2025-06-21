function openKhoaModal() {
    document.getElementById("khoaModal").style.display = "block";
}

function closeKhoaModal() {
    document.getElementById("khoaModal").style.display = "none";
}

function editKhoa(id, maKhoa, tenKhoa) {
    document.getElementById('maKhoa').value = maKhoa;
    document.getElementById('tenKhoa').value = tenKhoa;
    document.getElementById('editingRowIndex').value = id;
    document.getElementById('modalTitle').textContent = 'Chỉnh sửa Khoa';
    openKhoaModal();
}

function deleteKhoa(id) {
    if (confirm("Bạn có chắc chắn muốn xoá khoa này không?")) {
        // Gọi API xoá (chưa cài, bạn có thể viết sau)
        alert("Đã gửi yêu cầu xoá khoa có id: " + id);
    }
}
