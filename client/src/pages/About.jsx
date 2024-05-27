

export default function About() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-2xl mx-auto p-3 text-center">
        <div className="">
          <h1 className="text-3xl font-semibold text-center my-7">About Pratik's Blog</h1>
          <div className="text-md text-gray-500 flex flex-col gap-6">
            <p>
                This is a blog website created by Pratik. It is a simple blog website that allows users to read posts regarding MERN stack. The posts are stored in a MongoDB database. The blog website is built using React, Node.js, Express, MongoDB, and Mongoose.
            </p>
            <p>
                The blog website is hosted on a Heroku server. The database is hosted on a MongoDB Atlas cloud service.
            </p>
            <p>
                The blog website is fully responsive and can be accessed from any device.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
    