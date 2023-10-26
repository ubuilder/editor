export async function load(event){
//    console.log(event.locals.api)
    const pages = await  event.locals.api.getPages({}).then(res => res.data)
    return {pages}
}