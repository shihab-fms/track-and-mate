const mongoose = require('mongoose');
const dotenv = require('dotenv');

const app = require('./app');

dotenv.config({ path: './config.env' });

const DB =
  `mongodb+srv://shahshiful:<password>@cluster0.ubmnbga.mongodb.net/`.replace(
    '<password>',
    process.env.DATABASE_PASSWORD,
  );

mongoose.set('strictQuery', false);

mongoose.connect(DB).then(() => {
  console.log('Database connnection successfull');
});

const port = process.env.PORT || 3001;

const server = app.listen(port, () => {
  console.log(`App running on port: ${port}, Thanks.....`);
});
