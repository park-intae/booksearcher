import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import BookList from './components/BookList';
import Modal from './components/modal/Modal';
import type { Book } from './type/interface';
import Search from './components/board/Search';

function App() {
  const [books, setBooks] = useState<Book[]>([])

  //책 목록 가져오기
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/books");
        setBooks(response.data);
      } catch (error) {
        console.log("책 목록을 가져오지 못했습니다. 오류 :", error);
      }
    }
    fetchBooks();
  }, [])

  //Modal state management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contentType, setContentType] = useState("");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  //Modal open console
  const openModal = (type: string, book?: Book) => {
    setContentType(type);
    setSelectedBook(book ?? null); // book없으면 null로
    setIsModalOpen(true);
  };

  //Modal close console
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBook(null); // 모달 닫으면서 초기화
  }

  //Save Book
  const handleSaveBook = async (updatedBook: Book) => {
    try {
      await axios.put(`http://localhost:5000/books/${updatedBook.idKey}`, updatedBook);
      setBooks(prevBooks => prevBooks.map(book => book.idKey === updatedBook.idKey ? updatedBook : book));
    } catch (error) {
      console.log("책을 저장하지 못했습니다. 오류코드 :", error);
    }
  }

  //Add Book
  const handleAddBook = async (newBook: Book) => {
    const idKey = newBook.idKey || '';

    try {
      await axios.post("http://localhost:5000/books", { ...newBook, idKey });
      setBooks(prevBooks => [...prevBooks, newBook]);
    } catch (error) {
      console.log("책을 추가하지 못했습니다. 오류코드 :", error);
    }
  }

  //Delete Book
  const handleDeleteBook = async (idKey: string) => {
    if (!idKey) {
      console.log("책을 제거하지 못했습니다. id가 없습니다.");
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/books/${idKey}`);
      setBooks(prevBooks => prevBooks.filter(book => book.idKey !== idKey));
    } catch (error) {
      console.log("책을 제거하지 못했습니다. 오류코드 :", error);
    }
  }

  //Search State Management
  const [searchKey, setSearchKey] = useState<keyof Book>('title');
  const [searchValue, setSearchValue] = useState('');

  //Search
  const onSearch = (type: keyof Book, keyword: string) => {
    setSearchKey(type);
    setSearchValue(keyword);
  }
  //Search filter
  const filteredBooks = searchValue.trim()
    ? books.filter(book => book[searchKey]?.toString().toLowerCase().includes(searchValue.toLowerCase()))
    : books;


  return (
    <div>
      <header>
        {/* 로그인 버튼 */}
        <button onClick={() => openModal('loginButton')}>login</button>
      </header>
      <main>
        {/* 게시판 */}
        <div id='board'>
          <BookList books={filteredBooks} openModal={openModal} onDelete={handleDeleteBook} />
          {/* 검색, 추가 */}
          <Search onSearch={onSearch} />
          <button onClick={() => openModal('AddButton')}>추가</button>
        </div>
      </main>
      {/* 모달 */}
      {isModalOpen &&
        <Modal
          isOpen={isModalOpen}
          contentType={contentType}
          openModal={openModal}
          closeModal={closeModal}
          book={selectedBook}
          onSave={handleSaveBook}
          onAdd={handleAddBook}
        />}
    </div>
  );
}

export default App;
