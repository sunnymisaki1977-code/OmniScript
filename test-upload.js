const { Client } = require("@notionhq/client");
const fs = require("fs");


async function testUpload() {
  try {
    const notion = new Client({ auth: process.env.NOTION_API_KEY });
    console.log("Creating upload session...");
    const uploadRes = await notion.fileUploads.create({
      mode: "single_part",
    });
    console.log("Upload session created:", uploadRes);

    const fileBuffer = fs.readFileSync("package.json");
    const blob = new Blob([fileBuffer], { type: "image/jpeg" });
    const uploadFormData = new FormData();
    uploadFormData.append("file", blob, "package.json");

    console.log("Sending file to:", uploadRes.upload_url);
    const sendRes = await fetch(uploadRes.upload_url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.NOTION_API_KEY}`,
        "Notion-Version": "2022-06-28"
      },
      body: uploadFormData
    });

    if (!sendRes.ok) {
      console.log("Upload failed:", sendRes.status, await sendRes.text());
    } else {
      console.log("Upload successful!");
    }
  } catch (error) {
    console.error("Test failed:", error);
  }
}

testUpload();
