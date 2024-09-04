CREATE TABLE IF NOT EXISTS documents (
    title TEXT,
    content TEXT,
    created_at DATE DEFAULT (datetime('now','localtime'))
);

INSERT INTO documents (title, content)
VALUES ("Test", "Lorem ipsum dolor sit amet.");

UPDATE documents
SET
title = "Uppdaterat dokument",
content = "Hello World..."
WHERE rowid = 3;