import fs from 'fs';

const dataPath = './puid.json';

export const GetProjectId = () => {
    try {
      const data = fs.readFileSync(dataPath, 'utf8');
      return data;
    } catch (err) {
      // If the file does not exist, return an empty object
      return "";
    }
  };
  
  // Function to write data to the file
  export const saveProjectId = (data) => {
    fs.writeFileSync(dataPath, data, 'utf8');
  };