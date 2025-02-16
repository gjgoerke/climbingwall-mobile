export const screenCoordsToImg = (
    screen_x : number, 
    screen_y : number, 
    canvasWidth : number,
    canvasHeight : number, 
    imgWidth : number,
    imgHeight : number,
    screenRadius? : number
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
    if (screenRadius) {
        let img_r;
        if (wider) {
            img_r = (screenRadius  - sideSpace) / computedImgWidth;
        } else {
            img_r = (screenRadius - topSpace) / computedImgHeight;
        }
        return ({img_x, img_y, img_r });
    } else {
        return ({img_x, img_y});
    }
}

export const imgCoordsToScreen = (
    img_x : number, 
    img_y : number, 
    canvasWidth : number,
    canvasHeight : number, 
    imgWidth : number,
    imgHeight : number,
    img_r? : number
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
    if (img_r) {
        let screen_r;
        if (wider) {
            screen_r = img_r * computedImgWidth + sideSpace; 
        } else {
            screen_r = img_r * computedImgHeight + topSpace;
        }
        return ({screen_x, screen_y, screen_r });
    } else {
        return ({screen_x, screen_y});
    }
}