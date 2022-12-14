const reading = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKSHELF_APPS';

document.addEventListener('DOMContentLoaded', function () {
    const formInput = document.getElementById('form-input');
    formInput.addEventListener('submit', function (event) {
        event.preventDefault();
        tambahBuku();
        alert('Data Buku Telah Ditambahkan');
    });
    if (isStorageExist()) {
        loadDataFromStorage();
      }
});

function tambahBuku() {
    const textJudul = document.getElementById('title').value;
    const textPenulis = document.getElementById('author').value;
    const textTahun = document.getElementById('year').value;
    const finishedReading = finishedReadingBook();
    const uniqueId = generateUniqueId();
    const books = generateBooks(uniqueId, textJudul, textPenulis, textTahun, finishedReading)
    reading.push(books);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function finishedReadingBook() {
    const checkBox = document.getElementById('checkComplete');

    if (checkBox.checked) {
        return true;
    } else {
        return false;
    }
}

function generateUniqueId() {
    return +new Date();
}

function generateBooks(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
}

function showBooks(books) {
    const judulBuku = document.createElement('h2');
    judulBuku.innerText = books.title;

    const penulisBuku = document.createElement('p');
    penulisBuku.innerText = books.author;

    const tahunBuku = document.createElement('p');
    tahunBuku.innerText = books.year;

    const bacaUlang = document.createElement('button');
        bacaUlang.classList.add('baca-ulang');
        bacaUlang.innerText = 'Baca Ulang';

        const hapusBuku = document.createElement('button');
        hapusBuku.classList.add('hapus-buku');
        hapusBuku.innerText = 'Hapus Buku';

        const selesaiMemebaca = document.createElement('button');
        selesaiMemebaca.classList.add('selesai-membaca');
        selesaiMemebaca.innerText = 'Selesai Membaca';


    const textContent = document.createElement('div');
    textContent.classList.add('tampil');
    textContent.append(judulBuku, penulisBuku, tahunBuku);

    const content = document.createElement('div');
    content.classList.add('book', 'shadow');
    content.append(textContent);
    content.setAttribute('id', `read-${books.id}`);

    if (books.isCompleted) {
        

        bacaUlang.addEventListener('click', function () {
            if (confirm('Apakah Kamu Ingin Membaca Ulang Buku Ini?')) {
                alert('Selamat Membaca')
                bacaUlangBuku(books.id);
            } else {
                alert('Tidak Jadi Membaca Ulang')
            }
        });

        

        hapusBuku.addEventListener('click', function () {
            if (confirm('Apakah Kamu Ingin Menghapus Data Buku Ini?')) {
                alert('Data Buku Berhasil Dihapus')
                hapusDataBuku(books.id);
            } else {
                alert('Data Buku Tidak Jadi Dihapus')
            } 
        });

        content.append(bacaUlang, hapusBuku);

    } else {

        hapusBuku.addEventListener('click', function () {
            if (confirm('Apakah Kamu Ingin Menghapus Data Buku Ini?')) {
                alert('Data Buku Berhasil Dihapus')
                hapusDataBuku(books.id);
            } else {
                alert('Data Buku Tidak Jadi Dihapus')
            } 
        });
        
        selesaiMemebaca.addEventListener('click', function () {
            selesaiMemebacaBuku(books.id);
            alert('Selamat Kamu Telah Selesai Membaca Buku Ini');
        });

        content.append(selesaiMemebaca, hapusBuku);
    }

    return content;
}

document.addEventListener(RENDER_EVENT, function () {
    const belumSelesaiMembaca = document.getElementById('reading');
    belumSelesaiMembaca.innerHTML = '';
   
    const sudahSelesaiMembaca = document.getElementById('finished-reading');
    sudahSelesaiMembaca.innerHTML = '';
   
    for (const listBook of reading) {
        const bookElement = showBooks(listBook);
        if (!listBook.isCompleted)
        belumSelesaiMembaca.append(bookElement);
        else
        sudahSelesaiMembaca.append(bookElement);
    }
});

function selesaiMemebacaBuku (bookId) {
    const thatBook = cariBuku(bookId);

    if (thatBook == null) return;

    thatBook.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function cariBuku(bookId) {
    for (const listBook of reading) {
        if (listBook.id === bookId) {
            return listBook;
        }
    }
    return null;
}

function hapusDataBuku(bookId) {
    const thatBook = findIndexofBook(bookId);

    if (thatBook === -1) return;

    reading.splice(thatBook, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function bacaUlangBuku(bookId) {
    const thatBook = cariBuku(bookId);

    if (thatBook == null) return;

    thatBook.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findIndexofBook(bookId) {
    for (const bookIndex in reading) {
        if (reading[bookIndex].id === bookId) {
            return bookIndex;
        }
    }
    return -1;
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(reading);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
    const serialData = localStorage.getItem(STORAGE_KEY);
    let dataBuku = JSON.parse(serialData);

    if (dataBuku !== null) {
        for (const read of dataBuku) {
            reading.push(read);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}