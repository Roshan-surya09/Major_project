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
   initData.data = initData.data.map((obj) => ({...obj, owner: "670007fcd3d4221e3c157af8"}));
  await Listing.insertMany(initData.data);
  console.log("Data was initilized");
};

initDb();
