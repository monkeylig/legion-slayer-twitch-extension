import loadingStyles from "./loading-screen.module.css"
import Image from "next/image";

export default function LoadingScreen({}) {
    return (
        <div className={loadingStyles['loading-screen']}>
            <Image width="100" height="100" alt={"loading Icon"} src={"./icon.webp"} />
            <p>Loading...</p>
        </div>
    );
}