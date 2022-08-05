const express = require('express');
const db = require('./lib/dbconn')
const app = express();
const cors = require('cors');
// set up port
const PORT = process.env.PORT || 4001;
app.use(express.json());
app.use(cors());
// add routes
const router = require('./routes/router.js');
app.use('/api', router);
// run server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));