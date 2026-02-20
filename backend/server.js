const express = require("express");
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("./database.db");
const cors = require("cors");

db.run(
  `
    CREATE TABLE IF NOT EXISTS cards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL 
    )
`,
  (err) => {
    //adding default cards if table is empty
    db.get("SELECT COUNT(*) AS count FROM cards", (err, row) => {
      if (err) {
        console.error("Database error:", err);
        return;
      }

      if (row.count === 0) {
        const cards = [
          {
            category: "level-1",
            link: "https://picsum.photos/id/13/200",
          },
          {
            category: "level-1",
            link: "https://picsum.photos/id/155/200",
          },
          {
            category: "level-1",
            link: "https://picsum.photos/id/193/200",
          },
          {
            category: "level-1",
            link: "https://picsum.photos/id/211/200",
          },
          {
            category: "level-1",
            link: "https://picsum.photos/id/237/200",
          },
          {
            category: "level-1",
            link: "https://picsum.photos/id/250/200",
          },
          // level 2
          {
            category: "level-2",
            link: "https://images.unsplash.com/photo-1510253687831-0f982d7862fc",
          },
          {
            category: "level-2",
            link: "https://sana.ae/wp-content/uploads/2018/10/00-holding-wroclaw-poland-travel-guide.jpg",
          },
          {
            category: "level-2",
            link: "https://onestep4ward.com/wp-content/uploads/2011/08/dreamstime_xxl_55742473-1536x1207.jpg",
          },
          {
            category: "level-2",
            link: "https://hamlettours.com/wp-content/uploads/Nyhavn-ikke-til-print-1024x681.jpg",
          },
          {
            category: "level-2",
            link: "https://images.unsplash.com/photo-1549144511-f099e773c147-paris",
          },
          {
            category: "level-2",
            link: "https://plus.unsplash.com/premium_photo-1730145749791-28fc538d7203",
          },
          {
            category: "level-2",
            link: "https://images.unsplash.com/photo-1548013146-72479768bada",
          },
          {
            category: "level-2",
            link: "https://images.unsplash.com/photo-1549145177-238518f1ec1a",
          },
          {
            category: "level-2",
            link: "https://images.unsplash.com/photo-1591139308596-9b663fa6d0a0",
          },
          {
            category: "level-2",
            link: "https://images.unsplash.com/photo-1603852452378-a4e8d84324a2",
          },
          {
            category: "level-2",
            link: "https://images.unsplash.com/photo-1627932384339-3c0fdf74679e",
          },
          {
            category: "level-2",
            link: "https://images.unsplash.com/photo-1526997237335-45a11b46ecb3",
          },
        ];

        let values = cards.map((card) => `('${card.link}', '${card.category}')`).join(", ");
        db.run(`INSERT INTO cards (name, category) VALUES ${values}`);

        console.log("Default cards inserted!");
      }
    });
  },
);

const app = express();

app.use(cors());

const PORT = 8000;
//defualt endpoint
app.get("/", (req, res) => {
  res.send("Hello Express");
});

//endpoint to get all cards from SQLite
app.get("/api/cards", (req, res) => {
  let sql = "SELECT * FROM cards";

  const category = req.query.category;
  if (category) {
    sql += ` WHERE category = '${category}' `;
  }

  db.all(sql, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
