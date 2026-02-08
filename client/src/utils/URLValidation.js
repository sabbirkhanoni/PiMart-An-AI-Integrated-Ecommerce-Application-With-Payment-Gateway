export const URLvalidation = (url) => {
    const validURL = url?.toString().replaceAll(" ","-").replaceAll(",","-").replaceAll("&","-");
    return validURL;
}