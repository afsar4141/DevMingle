const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://afsaralikhan4141_db_user:nL3DPSCnkbFdYM1b@cluster0.wcudvxf.mongodb.net/Namastenode"
    );
};

module.exports = connectDB;
