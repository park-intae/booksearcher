interface Book {
    idKey: string
    id?: number;
    title: string;
    author: string[];
    publisher: string;
    stock: number;
}

export type { Book };