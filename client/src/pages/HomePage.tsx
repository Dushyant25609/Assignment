
export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Assignment App buddy
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          A full-stack application built with React, TypeScript, Express, and MongoDB
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="card">
            <h3 className="text-xl font-semibold mb-2">Frontend</h3>
            <p className="text-gray-600">React with TypeScript, Tailwind CSS, and Vite</p>
          </div>
          
          <div className="card">
            <h3 className="text-xl font-semibold mb-2">Backend</h3>
            <p className="text-gray-600">Express.js with TypeScript and Prisma ORM</p>
          </div>
          
          <div className="card">
            <h3 className="text-xl font-semibold mb-2">Database</h3>
            <p className="text-gray-600">MongoDB with Prisma for type-safe queries</p>
          </div>
        </div>
      </div>
    </div>
  )
}
