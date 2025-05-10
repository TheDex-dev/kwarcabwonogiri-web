const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function tryImgurUpload(formData, attempt = 1) {
  const response = await fetch('https://api.imgur.com/3/upload', {
    method: 'POST',
    headers: {
      'Authorization': `Client-ID ${process.env.NEXT_PUBLIC_IMGUR_CLIENT_ID}`
    },
    body: formData
  });

  const data = await response.json();

  if (!response.ok) {
    // Check specifically for capacity error
    if (data.data?.error === "Imgur is temporarily over capacity. Please try again later." && attempt < MAX_RETRIES) {
      console.log(`Imgur over capacity, retrying in ${RETRY_DELAY/1000} seconds... (Attempt ${attempt}/${MAX_RETRIES})`);
      await sleep(RETRY_DELAY);
      return tryImgurUpload(formData, attempt + 1);
    }

    console.error('Imgur API Error:', data);
    throw new Error(data.data?.error || 'Failed to upload image to Imgur');
  }

  return data.data.link;
}

async function tryImgBBUpload(file) {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('key', process.env.NEXT_PUBLIC_IMGBB_API_KEY);

  const response = await fetch('https://api.imgbb.com/1/upload', {
    method: 'POST',
    body: formData
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    console.error('ImgBB API Error:', data);
    throw new Error(data.error?.message || 'Failed to upload image to ImgBB');
  }

  // Modify the URL to include .com
  const originalUrl = data.data.url;
  const modifiedUrl = originalUrl.replace('https://i.ibb.co/', 'https://i.ibb.co.com/');
  return modifiedUrl;
}

export async function uploadToImgur(file) {
  const formData = new FormData();
  formData.append('image', file);

  try {
    // Try Imgur first
    try {
      const imageUrl = await tryImgurUpload(formData);
      return imageUrl;
    } catch (imgurError) {
      console.log('Imgur upload failed, trying ImgBB as fallback...', imgurError);
      
      // If Imgur fails, try ImgBB
      const imageUrl = await tryImgBBUpload(file);
      return imageUrl;
    }
  } catch (error) {
    console.error('All upload attempts failed:', error);
    throw new Error('Failed to upload image to both Imgur and ImgBB');
  }
}
