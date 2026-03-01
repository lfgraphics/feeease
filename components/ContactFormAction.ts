// components/ContactFormAction.ts
"use server";

export async function submitContactForm(formData: FormData) {
  const scriptUrl = process.env.GOOGLE_SCRIPT_URL;

  if (!scriptUrl) {
    console.error("GOOGLE_SCRIPT_URL is not defined in environment variables");
    return { success: false, error: "Server configuration error" };
  }

  const params = new URLSearchParams();
  formData.forEach((value, key) => {
    params.append(key, value.toString());
  });

  try {
    const response = await fetch(scriptUrl, {
      method: "POST",
      body: params,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.result === 'success') {
      return { success: true, row: data.row };
    } else {
      return { success: false, error: data.error || 'Submission failed' };
    }

  } catch (error) {
    console.error("Server Action Error:", error);
    return { success: false, error: "Failed to connect to submission server." };
  }
}
