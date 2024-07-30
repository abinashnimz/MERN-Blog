import { CallToAction } from "../components/CallToAction"

export const Project = ()=>{
    return(
        <div className="flex flex-col items-center justify-center gap-6 min-h-screen max-w-2xl mx-auto p-3">
            <h1 className="text-3xl font-semibold text-center">Pojects</h1>
            <p className="text-md text-gray-500">Build fun and engaging projects while learning HTML, CSS, and JavaScript!</p>
            <CallToAction/>
        </div>
    )
}