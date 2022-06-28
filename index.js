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
app.use(cors());

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
    temp: device.temperature,
    humidity: device.humidity,
    airPressure: device.pressure,
    lightLevel: device.light,
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
      let data = results;

      let finalData = {
        allData: [
          {
            deviceName: data[0].name,
            deviceData: {
              temp: [],
              humidity: [],
              airPressure: [],
              lightLevel: [],
              batteryLevel: [],
              fireWarning: [],
            },
          },
        ],
      };

      for (let i = 0; i < data.length; i++) {
        finalData.allData[0].deviceData.temp.push({
          date: data[i].date,
          value: data[i].temp,
        });
        finalData.allData[0].deviceData.humidity.push({
          date: data[i].date,
          value: data[i].humidity,
        });
        finalData.allData[0].deviceData.airPressure.push({
          date: data[i].date,
          value: data[i].airPressure,
        });
        finalData.allData[0].deviceData.lightLevel.push({
          date: data[i].date,
          value: data[i].lightLevel,
        });
        finalData.allData[0].deviceData.batteryLevel.push({
          date: data[i].date,
          value: data[i].batteryLevel,
        });
        finalData.allData[0].deviceData.fireWarning.push({
          date: data[i].date,
          value: data[i].fireWarning,
        });
      }

      console.log(finalData);
      res.send(finalData);
    });
  } catch (error) {
    console.error("Error at line selection : ", error);
    res.send(error);
  }
});

// Add user to database
app.post("/adddevice", function (req, res) {
  console.log(req.body); // your JSON

  let device = req.body;
  device.name = "deviceHome";

  const dt = new Date();
  const finalDate = `${(dt.getMonth() + 1).toString().padStart(2, "0")}/${dt
    .getDate()
    .toString()
    .padStart(2, "0")}/${dt.getFullYear().toString().padStart(4, "0")} ${dt
    .getHours()
    .toString()
    .padStart(2, "0")}:${dt.getMinutes().toString().padStart(2, "0")}`;

  device.date = finalDate;
  device.batteryLevel = 3.7;

  console.log(device.name);
  console.log(device.date);
  addDevice(device);

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

/*
let data = [
  {
    id: 1,
    date: "28/06/2022",
    name: "device1",
    temp: 24,
    humidity: 56,
    airPressure: 1024,
    lightLevel: 230,
    batteryLevel: 22,
    fireWarning: 0,
  },
  {
    id: 4,
    date: "28/06/2022",
    name: "deviceHome",
    temp: 26.554,
    humidity: 50.482,
    airPressure: 990,
    lightLevel: 173,
    batteryLevel: 3.7,
    fireWarning: 0,
  },
  {
    id: 5,
    date: "06/28/2022 12:15",
    name: "deviceHome",
    temp: 26.554,
    humidity: 50.482,
    airPressure: 990,
    lightLevel: 173,
    batteryLevel: 3.7,
    fireWarning: 0,
  },
];

let finalData = {
  allData: [
    {
      deviceName: data[0].name,
      deviceData: {
        temp: [],
        humidity: [],
        airPressure: [],
        lightLevel: [],
        batteryLevel: [],
        fireWarning: [],
      },
    },
  ],
};

for (let i = 0; i < data.length; i++) {
  finalData.allData[0].deviceData.temp.push({
    date: data[i].date,
    value: data[i].temp,
  });
  finalData.allData[0].deviceData.humidity.push({
    date: data[i].date,
    value: data[i].humidity,
  });
  finalData.allData[0].deviceData.airPressure.push({
    date: data[i].date,
    value: data[i].airPressure,
  });
  finalData.allData[0].deviceData.lightLevel.push({
    date: data[i].date,
    value: data[i].lightLevel,
  });
  finalData.allData[0].deviceData.batteryLevel.push({
    date: data[i].date,
    value: data[i].batteryLevel,
  });
  finalData.allData[0].deviceData.fireWarning.push({
    date: data[i].date,
    value: data[i].fireWarning,
  });
}

console.log(finalData.allData[0].deviceData);
*/
