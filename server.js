const mongoose = require('mongoose');
const dotenv = require('dotenv');

const app = require('./app');

dotenv.config({ path: './config.env' });

const DB = process.env.DATA_BASE_USERNAME.replace(
  '<password>',
  process.env.DATA_BASE_PASSWORD,
);

mongoose.set('strictQuery', false);

mongoose.connect(DB).then(() => {
  console.log('Database connnection successfull');
});

const port = process.env.PORT || 3001;

const server = app.listen(port, () => {
  console.log(`App running on port: ${port}, Thanks.....`);
});
