export const screenCoordsToImg = (
    screen_x : number, 
    screen_y : number, 
    canvasWidth : number,
    canvasHeight : number, 
    imgWidth : number,
    imgHeight : number,
    screenRadius : number
) => {
    const imgAspectRatio = imgWidth / imgHeight;
    const canvasAspectRatio = canvasWidth / canvasHeight;
    const wider = imgAspectRatio > canvasAspectRatio;
    let computedImgHeight;
    let computedImgWidth;
    if (wider) {
        computedImgWidth = canvasWidth;
        computedImgHeight = computedImgWidth / imgAspectRatio;
    } else {
        computedImgHeight = canvasHeight;
        computedImgWidth = computedImgHeight * imgAspectRatio;
    }
    const topSpace = (canvasHeight - computedImgHeight)/2;
    const sideSpace = (canvasWidth - computedImgWidth)/2;
    const img_x = (screen_x - sideSpace) / computedImgWidth;
    const img_y = (screen_y - topSpace) / computedImgHeight;
    const img_r = (screenRadius) / computedImgWidth;
    return ({img_x, img_y, img_r });
}

export const imgCoordsToScreen = (
    img_x : number, 
    img_y : number, 
    canvasWidth : number,
    canvasHeight : number, 
    imgWidth : number,
    imgHeight : number,
    img_r : number
) => {
    const imgAspectRatio = imgWidth / imgHeight;
    const canvasAspectRatio = canvasWidth / canvasHeight;
    const wider = imgAspectRatio > canvasAspectRatio;
    let computedImgHeight;
    let computedImgWidth;
    if (wider) {
        computedImgWidth = canvasWidth;
        computedImgHeight = computedImgWidth / imgAspectRatio;
    } else {
        computedImgHeight = canvasHeight;
        computedImgWidth = computedImgHeight * imgAspectRatio;
    }
    const topSpace = (canvasHeight - computedImgHeight)/2;
    const sideSpace = (canvasWidth - computedImgWidth)/2;
    const screen_x = img_x * computedImgWidth + sideSpace;
    const screen_y = img_y * computedImgHeight + topSpace;
    const screen_r = img_r * computedImgWidth; 
    return ({screen_x, screen_y, screen_r });
}