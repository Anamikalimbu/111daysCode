import fs from "fs/promises";

async function readData() {
  try {
    const data = await fs.readFile("file1.txt", "utf-8");
    console.log(data);
  } catch (error) {
    console.log(error);
  }finally {
    console.log("This will always be executed");
  }
}
readData();

const readMultipleData = async () => {
    const data1 = await fs.readFile("file1.txt", "utf-8");
    const data2 = await fs.readFile("file2.txt", "utf-8");
    const data3 = await fs.readFile("file3.txt", "utf-8");
    console.log(data1);
    console.log(data2);
    console.log(data3);
};
readMultipleData();