const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

require("dotenv").config();

const mongoose = require("mongoose");
const User = require("./models/User");

const checkUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected");

    const user = await User.findOne({
      email: "hibu@example.com",
    });

    console.log("USER FROM DATABASE:");
    console.log(user);

    console.log("COMPANY ID:");
    console.log(user?.companyId);

    await mongoose.disconnect();
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
};

checkUser();