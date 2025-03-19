import { useState } from "react";
import type { Book } from "../../type/interface";

interface ModifyProps {
    book: Book | null;
    onClose: () => void;
    onSave: (updatedBook: Book) => void;
}

const Modify: React.FC<ModifyProps> = ({ book, onClose, onSave }) => {
    const defaultBook: Book = { idKey: "", title: "", author: [], publisher: "", stock: 0 };
    const currentBook = book ?? defaultBook;

    const [title, setTitle] = useState(currentBook.title);
    const [author, setAuthor] = useState(Array.isArray(currentBook.author) ? currentBook.author.join(",") : currentBook.author);
    const [publisher, setPublisehr] = useState(currentBook.publisher);
    const [stock, setStock] = useState(currentBook.stock.toString());

    const saveHandler = () => {
        const updatedBook: Book = {
            ...currentBook,
            idKey: currentBook.idKey,
            title,
            author: author ? author.split(",").map(name => name.trim()) : [],
            publisher,
            stock: parseInt(stock, 10),
        };
        onSave(updatedBook);
        onClose();
    }

    return (
        <div>
            <h2>책 정보 수정</h2>
            책 제목 : <input type="text" value={title} placeholder="새로운 제목 입력" onChange={(e) => setTitle(e.target.value)} /><br />
            저자 : <input type="text" value={author} placeholder="저자 입력" onChange={(e) => setAuthor(e.target.value)} /><br />
            출판사 : <input type="text" value={publisher} placeholder="출판사 입력" onChange={(e) => setPublisehr(e.target.value)} /><br />
            재고 : <input type="number" value={stock} placeholder="재고 입력" onChange={(e) => setStock(e.target.value)} /><br />
            <button onClick={saveHandler}>저장</button>
            <button onClick={onClose}>취소</button>
        </div>
    );
}

export default Modify