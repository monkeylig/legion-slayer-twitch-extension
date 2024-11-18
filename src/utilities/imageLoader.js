import backend from "./backend-calls";

/**
 * 
 * @param {{
 * src: string
 * }} param0 
 * @returns 
 */
export default function imageLoader({ src, width, quality }) {
    // if(process.env.NODE_ENV === 'development') {
    //     return `${backend.getResourceURL(src)}?${performance.now()}`
    // }
    if (src.startsWith('.')) {
        return src;
    }
    return `${backend.getResourceURL(src)}`
}