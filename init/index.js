const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing.js");

main().then( () => {
    console.log("connected to mongoose");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/tour")
};

const initDb = async () => {
  await  Listing.deleteMany({});
  await Listing.insertMany(initData.data);
  console.log("Data was initilized");
};

initDb();
