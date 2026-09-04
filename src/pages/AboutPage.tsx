import { easeOut, motion } from 'framer-motion'

const skills = {
  frontend: ['React', 'TypeScript', 'Vue', 'Tailwind CSS', 'Framer Motion'],
  backend: ['Java', 'Spring Boot', 'REST APIs'],
  database: ['PostgreSQL'],
  other: ['AI tools', 'Automation workflows'],
}

export default function AboutPage() {

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 overflow-hidden">
      <h1 className="mb-6 text-3xl font-bold">About Me</h1>
      <div className="flex flex-col md:flex-row gap-10 mb-24">
        <motion.div className="basis-1/2 text-sm md:text-base text-wrap">
          <motion.p   
            initial={{
              opacity: 0,
              x: -100
            }}
            whileInView={{
              opacity: 1,
              x: 0
            }}
            transition={{
              duration: 0.8,
              ease: "easeOut"
            }} className="mb-8 max-w-3xl text-gray-600 dark:text-gray-300">
              I'm Gambo Koudjam Sylvin, a Computer Science student passionate about designing and building software that solves real-world problems. I’m focused on becoming a Software Engineer, with a strong interest in <span className="font-bold">full-stack development</span>, backend systems, and creating <span className="font-bold">scalable</span>, <span className="font-bold">user-centered applications</span>.
          </motion.p>
          <motion.p 
            initial={{
              opacity: 0,
              x: -100
            }}
            whileInView={{
              opacity: 1,
              x: 0
            }}
            transition={{
              duration: 0.8,
              ease: "easeOut"
            }} className="mb-8 max-w-3xl text-gray-600 dark:text-gray-300">
              My experience includes working with technologies such as <span className="font-bold">Java</span>, <span className="font-bold">Spring Boot</span>, <span className="font-bold">React</span>, <span className="font-bold">TypeScript</span>, <span className="font-bold">PostgreSQL</span>, and <span className="font-bold">REST APIs</span> to develop reliable and maintainable solutions. I enjoy understanding complex problems, designing efficient systems, and turning ideas into practical products.
          </motion.p>
          <motion.p
            initial={{
              opacity: 0,
              x: -100
            }}
            whileInView={{
              opacity: 1,
              x: 0
            }}
            transition={{
              duration: 0.8,
              ease: "easeOut"
            }} className="mb-8 max-w-3xl text-gray-600 dark:text-gray-300">
              Beyond coding, I’m constantly learning through personal projects, exploring new technologies, and improving my skills as a developer. I’m always looking for opportunities to collaborate, grow, and contribute to meaningful software projects.
          </motion.p>
        </motion.div>
        
        <motion.div 
          initial={{
            opacity:0,
            x:100
          }}
          whileInView={{
            opacity:1,
            x:0
          }}
          transition={{
            duration : 0.8,
            ease: easeOut
          }} className="basis-1/2 aspect-square">
            <img className="rounded-[60px] w-full h-full object-cover" src="https://res.cloudinary.com/dosaqiiuk/image/upload/portfolio-pic" alt="Me" />
        </motion.div>
      </div>
      <h2 className="mb-4 text-2xl font-semibold">Skills</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {Object.entries(skills).map(([category, items]) => (
          <motion.div
            initial={{
              opacity : 0,
              y : 100
            }}
            whileInView={{
              opacity : 1,
              y : 0
            }}
            transition={{
              duration : 0.8,
              ease : easeOut
            }}
            key={category}
            className="rounded-xl border border-gray-200 p-6 dark:border-gray-800"
          >
            <h3 className="mb-3 capitalize text-primary">{category}</h3>
            <ul className="flex flex-wrap gap-2">
              {items.map((skill) => (
                <li
                  key={skill}
                  className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
