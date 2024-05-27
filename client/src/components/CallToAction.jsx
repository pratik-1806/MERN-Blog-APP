import { Button } from "flowbite-react";


export default function CallToAction() {
  return (
    <div className="flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center 
    rounded-tl-3xl rounded-br-3xl">
        <div className="flex-1 justify-center flex flex-col" >
            <h2 className="text-2xl">Want to learn more about the Project?</h2>
            <p className="text-gray-500 my-2">Check out the GitHub Repository</p>
            <Button gradientDuoTone='purpleToPink' className="rounded-tl-xl rounded-bl-none">
                <a href="https://github.com/pratik-1806/BlogApplication" target="_blank" >GitHub</a>
            </Button>
        </div>
        <div className="p-7 flex-1 ">
            <img src="https://www.macobserver.com/wp-content/uploads/2019/05/workfeatured-GitHub-2.png" className="rounded-md"/>
        </div>
    </div>
  )
}
