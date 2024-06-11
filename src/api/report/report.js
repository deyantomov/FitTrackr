import { buildUrl } from "../index";
import { endpoints } from "../endpoints";

export const reportABug = async (report) => {
  if (!report) {
    throw new Error("Bug report cannot be empty");
  }

  const url = buildUrl(endpoints.reportABug);

  try {
    const response = await fetch(`${url}`, {
      method: "Post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(report)

    });
    
    return response.json();
  } catch (err) {
    throw new Error("Couldn't upload bug report");
  }
}