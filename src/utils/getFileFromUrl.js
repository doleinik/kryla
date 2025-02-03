export default async function getFileFromUrl(url) {
  if (!url) return null;

  const res = await fetch(url);
  const blob = await res.blob();

  console.log(res);
  // const type = blob.type;

  // return new Promise((resolve, reject) => {
  //   const reader = new FileReader();

  //   reader.onload = () => {
  //     const dataUrl = reader.result;

  //     if (isBase64Image(dataUrl)) {
  //       const ext = dataUrl.substring(dataUrl.indexOf('/') + 1, dataUrl.indexOf(';'));
  //       const file = new File([blob], `user-photo.${ext}`, { type });
  //       resolve(file);
  //     } else {
  //       reject(new Error('Invalid image'));
  //     }
  //   };

  //   reader.onerror = (error) => reject(error);

  //   reader.readAsDataURL(blob);
  // });
}


function isBase64Image(str) {

  // Check if the string starts with a valid data URL header
  const base64Regex = /^data:image\/(png|jpg|jpeg|gif);base64,([a-zA-Z0-9+/]+={0,2})$/;

  return base64Regex.test(str);
}