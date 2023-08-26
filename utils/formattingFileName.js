function formattFile(filename){
    let myRegexp = /([<>:"/\\|?*\u0000-\u001F])/g

    if(myRegexp.test(filename)){
        let charactersInvalids = filename.replace(myRegexp,'-')

        return charactersInvalids
    }else{
        return filename
    }
}

export default formattFile