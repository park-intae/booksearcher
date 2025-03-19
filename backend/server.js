require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(cors());
app.use(express.json());

//MySQL 연결
const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "123456",
    database: process.env.DB_NAME || "BookSearcher",
});

db.connect((err) => {
    if (err) {
        console.error("My SQL 연결 실패 : ", err);
        return;
    }
    console.log("MySQL 연결 성공");
})

// API로 도서 목록 가져오기
app.get("/books", async (req, res) => {
    db.query("SELECT * FROM books", (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json(result);
    });
});

app.put("/books/:idKey", (req, res) => {
    const { idKey } = req.params;
    const { title, author, publisher, stock } = req.body;

    db.query(
        "UPDATE books SET title = ?, author = ?, publisher = ?, stock = ? WHERE idKey = ?",
        [title, author, publisher, stock, idKey],
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Book not found" });
            }
            res.json({ idKey, title, author, publisher, stock });
        }
    )
});

app.post("/books", (req, res) => {
    const { title, author, publisher, stock } = req.body;
    const idKey = uuidv4();

    db.query(
        "INSERT INTO books (idKey, title, author, publisher, stock) VALUES (?, ?, ?, ?, ?)",
        [idKey, title, author, publisher, stock],
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ id: result.insertId, idKey, title, author, publisher, stock });
        }
    );
});

app.delete("/books/:idKey", (req, res) => {
    const { idKey } = req.params;

    db.query(
        "DELETE FROM books WHERE idKey = ?",
        [idKey],
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Book not found" });
            }
            res.json({ message: "Book deleted" });
        }
    )
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("Backend running on port" + PORT);
});
