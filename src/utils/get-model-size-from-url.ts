export async function getFileSizeFromURL(modelURL: string): Promise<number> {
  try {
    const response = await fetch(modelURL, {
      method: 'GET',
      headers: { 'X-HTTP-Method-Override': 'HEAD' },
    });

    const headersEntries = response.headers.entries();
    const headersArray = Array.from(headersEntries).map((value) => value);
    const contentLengthIndex = headersArray.findIndex((value) => value[0] === 'content-length');

    if (contentLengthIndex >= 0) {
      return parseInt(headersArray[contentLengthIndex][1]);
    } else {
      return 0;
    }
  } catch (err) {
    console.log('getFileSizeFromURL', { err });

    return 0;
  }
}
