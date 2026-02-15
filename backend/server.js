const express = require('express');
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./database.db');

db.run(`
    CREATE TABLE IF NOT EXISTS cards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
    )
`, (err) => {
    //adding default cards if table is empty
    db.get('SELECT COUNT(*) AS count FROM cards', (err, row) => {
        if (err) {
            console.error('Database error:', err);
            return;
        }

        if (row.count === 0) {

            const cards = [
                "https://picsum.photos/id/13/200",
                "https://picsum.photos/id/155/200",
                "https://picsum.photos/id/193/200",
                "https://picsum.photos/id/211/200",
                "https://picsum.photos/id/237/200",
                "https://picsum.photos/id/250/200"
            ];

            for (let i = 0; i < cards.length; i++) {
                db.run(`INSERT INTO cards (name) VALUES ('${cards[i]}')`);
            }

            console.log("Default cards inserted!");
        }
    });
});

const app = express();

const PORT = 5000;
//defualt endpoint
app.get('/', (req, res) => {
    res.send('Hello Express');
});

//endpoint to get all cards from SQLite
app.get('/api/cards', (req, res) => {
    db.all('SELECT * FROM cards', (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }

        res.json(rows);
    });
});

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
});