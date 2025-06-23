// public/js/subject.js
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('subjectForm');

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const id = document.getElementById('editingSubjectRowIndex').value;
    const data = {
      maMon: document.getElementById('maSubject').value,
      tenMon: document.getElementById('tenSubject').value,
      soTinChi: document.getElementById('soTinChi').value
    };

    const url = id ? `/quanlymonhoc/update/${id}` : '/quanlymonhoc/create';
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    window.location.reload();
  });

  document.getElementById('searchSubject').addEventListener('input', async function () {
    const query = this.value;
    const res = await fetch(`/quanlymonhoc/search?q=${query}`);
    const html = await res.text();
    document.querySelector('#subjectTable tbody').innerHTML = html;
  });
});

function editSubject(id, maMon, tenMon, soTinChi) {
  document.getElementById('editingSubjectRowIndex').value = id;
  document.getElementById('maSubject').value = maMon;
  document.getElementById('tenSubject').value = tenMon;
  document.getElementById('soTinChi').value = soTinChi;
  document.getElementById('subjectModalTitle').innerText = 'Sửa Môn học';
  openSubjectModal();
}

function deleteSubject(id) {
  if (confirm("Bạn có chắc chắn muốn xóa không?")) {
    fetch(`/quanlymonhoc/delete/${id}`, {
      method: 'POST'
    }).then(() => window.location.reload());
  }
}
