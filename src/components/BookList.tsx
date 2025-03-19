import React, { useMemo } from 'react';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import type { Book } from '../type/interface';
import Pagination from './board/Pagination';


interface BookListProps {
    books: Book[];
    openModal: (type: string, book?: Book) => void;
    onDelete: (id: string) => void;
}

const BookList: React.FC<BookListProps> = ({ books, openModal, onDelete }) => {
    const [currentPage, setCurrentPage] = React.useState(1);
    const booksPerPage = 5; // 페이지당 책 수

    const currentBooks = React.useMemo(() => {
        const indexOfLastBook = currentPage * booksPerPage;
        const indexOfFirstBook = indexOfLastBook - booksPerPage;
        return books.slice(indexOfFirstBook, indexOfLastBook);
    }, [currentPage, books]);

    const sortedBooks = React.useMemo(() => {
        return [...currentBooks].sort((a, b) => {
            const idA = a.id ?? NaN; // undefined일 경우 NaN 처리
            const idB = b.id ?? NaN; // undefined일 경우 NaN 처리
            return (idA - idB); // NaN 처리로 undefined가 맨 뒤로 배치됨
        });
    }, [books]);

    const columns = useMemo<ColumnDef<Book, any>[]>(() => [
        { header: 'ID', accessorKey: 'id' },
        { header: '제목', accessorKey: 'title' },
        { header: '작가', accessorKey: 'author' },
        { header: '출판사', accessorKey: 'publisher' },
        { header: '재고', accessorKey: 'stock' },
        {
            header: '삭제',
            cell: ({ row }) => <button onClick={(e) => {
                e.stopPropagation();
                const id = row.original.idKey;
                if (id) {
                    onDelete(id);
                }
            }}>삭제</button>
        },
    ], [onDelete]);

    const table = useReactTable({ data: sortedBooks, columns, getCoreRowModel: getCoreRowModel(), });

    return (
        <div id='booklist'>
            <table>
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(columns => (
                                <th key={columns.id}>
                                    {flexRender(columns.column.columnDef.header, columns.getContext())}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id} onClick={() => {
                            openModal('bookContents', row.original);
                        }}>
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <Pagination
                totalBooks={books.length}
                booksPerPages={booksPerPage}
                currentPage={currentPage}
                paginate={setCurrentPage}
            />
        </div>
    );
}

export default BookList;
