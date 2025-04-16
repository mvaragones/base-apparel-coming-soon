import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    // Get the path to emails.json
    const filePath = path.join(
      process.cwd(),
      "src",
      "app",
      "data",
      "emails.json"
    );

    // Read existing data
    const jsonData = await fs.readFile(filePath, "utf8");
    const data = JSON.parse(jsonData);

    // Check for duplicate
    if (data.emails.includes(email)) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    // Add new email
    data.emails.push(email);

    // Write updated data back to file
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving email:", error);
    return NextResponse.json(
      { error: "Failed to save email" },
      { status: 500 }
    );
  }
}
