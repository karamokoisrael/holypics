export const logInformation = (text: any, onlyDev=false)=>{
    if(onlyDev && process.env.NODE_ENV === "production") return;
    console.log(text);
}
