const fs = require('fs');

const dataPath = './puid.json';

const GetProjectId = () => {
  try {
    const data = fs.readFileSync(dataPath, 'utf8');
    return data;
  } catch (err) {
    // If the file does not exist, return an empty object
    return "";
  }
};

// Function to write data to the file
const saveProjectId = (data) => {
  fs.writeFileSync(dataPath, data, 'utf8');
};

module.exports = {
  GetProjectId: GetProjectId,
  saveProjectId: saveProjectId,
};
