import express from 'express';
import path from 'path';

import * as sockets from './sockets';

const app = express();
const port = process.env.PORT || process.env.port || 8870;

const server = app.listen(port, () => console.log(`server listen on ${port} port`));

app.use(express.static(path.join(__dirname, '../dist')));
app.use(express.static(path.join(__dirname, '../assets')));

sockets.init(server);

// error handlers
app.use((error, req, res, next) => {
    res.send(error);
});
