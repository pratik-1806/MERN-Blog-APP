import CallToAction from "../components/CallToAction";


export default function Projects() {
  return (
    <div className="min-h-screen max-w-2xl mx-auto flex justify-center items-center flex-col gap-6 p-3">
      <h1 className="text-3xl font-semibold">
        Project
      </h1>
      <p className="text-md text-gray-500 ">The project is a full-stack web application built with ReactJS for the frontend
         using Tailwind CSS for styling, and an ExpressJS server with MongoDB for the backend, 
         enabling dynamic, responsive user interfaces and robust data management. The application
          facilitates seamless interaction between users and the server, ensuring efficient data retrieval 
          and storage.</p>
          <CallToAction/>
    </div>
  )
}
