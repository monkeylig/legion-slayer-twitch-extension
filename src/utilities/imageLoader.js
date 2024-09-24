import backend from "./backend-calls";


export default function imageLoader({ src, width, quality }) {
    // if(process.env.NODE_ENV === 'development') {
    //     return `${backend.getResourceURL(src)}?${performance.now()}`
    // }
    return `${backend.getResourceURL(src)}`
}