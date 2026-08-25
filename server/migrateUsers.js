require("dotenv").config();
const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = require("./config/DB");
const User = require("./models/User");
const Company = require("./models/Company");

const migrateUsers = async () => {
  try {
    await connectDB();

    console.log("✅ Database connection successful");

    const users = await User.find({
      companyId: { $exists: false },
    });

    console.log(`Found ${users.length} users without companyId`);

    for (const user of users) {
      let company = await Company.findOne({
        email: user.email,
      });

      if (!company) {
        company = await Company.create({
          name: `${user.name}'s Company`,
          email: user.email,
        });

        console.log(`✅ Company created for ${user.email}`);
      }

      user.companyId = company._id;

      await user.save();

      console.log(`✅ companyId added to ${user.email}`);
    }

    console.log("🎉 Migration completed successfully");

    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
};

migrateUsers();