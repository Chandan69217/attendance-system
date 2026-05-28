import { Loader2 } from "lucide-react";


export function CircularLoader(){
    return(
        <div className="col-span-full  flex flex-col items-center justify-center gap-2">
            <div className="flex flex-row gap-2 items-center ">
                <Loader2 className="animate-spin h-5 w-5" />
                <p >Loading...</p>
            </div>
        </div>
    )
}