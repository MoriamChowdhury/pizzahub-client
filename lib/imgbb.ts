export async function uploadToImgBB(file: File): Promise<string> {
  const key = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  if (!key) throw new Error("ImgBB API key is missing");

  const fd = new FormData();
  fd.append("image", file);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, {
    method: "POST",
    body: fd,
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error("Image upload failed");
  return data.data.url as string;
}