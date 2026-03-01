const mongoose = require('mongoose');
require('dotenv').config();

const UserSchema = new mongoose.Schema({
    email: String,
});

const User = mongoose.model('User', UserSchema);

async function checkUser() {
    try {
        console.log("Connecting to:", process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI);

        // Find ALL users
        const users = await User.find({});
        console.log(`Found ${users.length} users.`);
        users.forEach(u => console.log(` - ${u.email} (${u._id})`));

        // Check for specific user from python script
        const specificEmail = "omjangam041@gmail.com";
        const specificUser = users.find(u => u.email === specificEmail);

        if (specificUser) {
            console.log(`✅ User ${specificEmail} EXISTS.`);
        } else {
            console.log(`❌ User ${specificEmail} DOES NOT EXIST.`);
        }

        process.exit(0);
    } catch (e) {
        console.error("Error:", e);
        process.exit(1);
    }
}

checkUser();
