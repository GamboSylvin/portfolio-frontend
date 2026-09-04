import Button from '@/components/ui/Button'
import { TypeAnimation } from 'react-type-animation'


export default function HomePage() {

  return (
    <div className="mx-auto max-w-6xl px-4 py-20 relative overflow-hidden">
      <section className="text-center">
        <p className="mb-4 text-sm font-medium uppercase tracking-widest text-primary">
            <TypeAnimation
            sequence={[
              "Full Stack Developer",
              2000,

              "",
              500,

              "AI Enthusiast",
              2000,

              "",
              500,

              "Computer Science Student",
              2000,

              "",
              500,

              "Problem Solver",
              2000,

              "",
              500,
            ]}
            speed={50}
            repeat={Infinity}
          />
        </p>
        <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
          Building modern web applications
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
          React, TypeScript, Spring Boot, and PostgreSQL — crafting scalable,
          production-ready software.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="#projects">
            <Button size="lg">View Projects</Button>
          </a>
          <a href="#contact">
            <Button variant="secondary" size="lg">
              Get in Touch
            </Button>
          </a>
        </div>
      </section>
    </div>
  )
}
