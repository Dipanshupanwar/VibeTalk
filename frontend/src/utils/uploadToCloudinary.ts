// // utils/uploadToCloudinary.ts
// export const uploadToCloudinary = async (base64: string) => {
//   try {
//     const formData = new FormData();
//     formData.append("file", base64);
//     formData.append("upload_preset", "whatsupp_docs"); // ✅ Replace with your actual preset
//     // ❌ Don't add cloud_name here. It goes in the URL.

//     const res = await fetch("https://api.cloudinary.com/v1_1/dpxlmbw9s/auto/upload", {
//       method: "POST",
//       body: formData,
//     });
    

//     const data = await res.json();

//     if (!res.ok) {
//       console.error("Cloudinary error:", data);
//       throw new Error(data.error?.message || "Cloudinary upload failed");
//     }

//     return data.secure_url;
//   } catch (err) {
//     console.error("Cloudinary Upload Error:", err);
//     throw err;
//   }
// };
// utils/uploadToCloudinary.ts
export const uploadToCloudinary = async (base64: string) => {
  try {
    const formData = new FormData();
    formData.append("file", base64);
    formData.append("upload_preset", "whatsupp_docs");

    const res = await fetch("https://api.cloudinary.com/v1_1/dpxlmbw9s/auto/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error?.message || "Upload failed");
    }

    return {
      url: data.secure_url,
      type: data.resource_type, // <-- important
    };
  } catch (err) {
    console.error("Upload Error:", err);
    throw err;
  }
};
