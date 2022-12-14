document.getElementById('cari-buku').addEventListener("submit", function (event) {
    event.preventDefault();
   
    const cariBuku = document.getElementById('cariJudulBuku').value.toLowerCase();
    const listBuku = document.querySelectorAll('.book, .tampil > h2');
    for (dataBuku of listBuku) {
      if (dataBuku.innerText.toLowerCase().includes(cariBuku)) {
        dataBuku.parentElement.style.display = "block";
      } else {
        dataBuku.parentElement.style.display = "none";
      }
    }
  });  