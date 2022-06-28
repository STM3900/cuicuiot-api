require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
var cors = require("cors");
const app = express();
const port = 8080;

const mysql = require("mysql");
const { Sequelize } = require("sequelize");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cors());

// Declare sql infos
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    dialect: "mysql",
    host: process.env.DB_HOST,
  }
);

console.log(process.env.DB_NAME);

// Data model for Users
const Device = sequelize.define(
  "device", // Sequelize uses the pluralized form of the model name to search for the represented table. (devices in this case)
  {
    date: {
      type: Sequelize.STRING,
    },
    name: {
      type: Sequelize.STRING,
    },
    temp: {
      type: Sequelize.FLOAT,
    },
    humidity: {
      type: Sequelize.FLOAT,
    },
    airPressure: {
      type: Sequelize.FLOAT,
    },
    lightLevel: {
      type: Sequelize.FLOAT,
    },
    batteryLevel: {
      type: Sequelize.FLOAT,
    },
    fireWarning: {
      type: Sequelize.BOOLEAN,
    },
  },
  {
    timestamps: false,
  }
);

// Insert device
const addDevice = async (device) => {
  await Device.create({
    date: device.date,
    name: device.name,
    temp: device.temp,
    humidity: device.humidity,
    airPressure: device.airPressure,
    lightLevel: device.lightLevel,
    batteryLevel: device.batteryLevel,
    fireWarning: device.fireWarning,
  }).catch((err) => {
    console.log(err);
  });
};

// Delete device
const deleteDevice = async (id) => {
  await Device.destroy({ where: { id: id } }).catch((err) => {
    console.log(err);
  });
};

// Base url
app.get("/", (req, res) => {
  res.send("Cuicuiot API");
});

// Get all devices
app.get("/getdevices", (req, res) => {
  // TODO : maybe do better code (async function)
  try {
    sequelize.authenticate();
    sequelize.query("SELECT * FROM `devices`").then(([results, metadata]) => {
      console.log(results);
      res.send(results);
    });
  } catch (error) {
    console.error("Error at line selection : ", error);
    res.send(error);
  }
});

// Add user to database
app.post("/adddevice", function (req, res) {
  console.log(req.body); // your JSON

  const device = req.body;

  console.log("device name : " + device);
  // addDevice(device);

  res.send(`${device} inserted in ${process.env.DB_NAME}`);
});

// Delete user to database
app.post("/deletedevice", function (req, res) {
  const id = req.body.id;
  deleteDevice(id);

  res.send(`Device successfully deleted in ${process.env.DB_NAME}`);
});

// Listen configured port
app.listen(port, () => {
  console.log(`Cuicuiot api listening on port ${port}`);
});

let truc = {
  id: 1,
  date: "28/06/2022",
  name: "device1",
  temp: 24,
  humidity: 56,
  airPressure: 1024,
  lightLevel: 230,
  batteryLevel: 22,
  fireWarning: 0,
};
