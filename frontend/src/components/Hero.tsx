import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { HeroCards } from "./HeroCards";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

export const Hero = () => {
  return (
    <section className="container relative grid lg:grid-cols-2 place-items-center py-20 md:py-32 gap-10 overflow-hidden">
      <div className="text-center lg:text-start space-y-6">
        <main className="text-5xl md:text-6xl font-bold">
          <h1 className="inline">
            <span className="inline bg-gradient-to-r from-[#F596D3] to-[#D247BF] text-transparent bg-clip-text">
              Shadcn
            </span>{" "}
            landing page
          </h1>{" "}
          for{" "}
          <h2 className="inline">
            <span className="inline bg-gradient-to-r from-[#61DAFB] via-[#1fc0f1] to-[#03a3d7] text-transparent bg-clip-text">
              React
            </span>{" "}
            developers
          </h2>
        </main>

        <p className="text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0">
          Build your React landing page effortlessly with the required sections
          to your project.
        </p>

        <div className="space-y-4 md:space-y-0 md:space-x-4">
          <Button className="w-full md:w-1/3">Get Started</Button>

          <a
            rel="noreferrer noopener"
            href="https://github.com/leoMirandaa/shadcn-landing-page.git"
            target="_blank"
            className={`w-full md:w-1/3 ${buttonVariants({
              variant: "outline",
            })}`}
          >
            Github Repository
            <GitHubLogoIcon className="ml-2 w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Hero cards sections */}
      <div className="z-10">
        <HeroCards />
      </div>

      {/* Moving Shadow effect */}
      {/* <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[10%] top-[20%] w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-[128px] animate-blob animation-delay-2000"></div>
        <div className="absolute right-[10%] bottom-[20%] w-[400px] h-[400px] bg-cyan-500/30 rounded-full blur-[128px] animate-blob"></div>
        <div className="absolute left-[60%] bottom-[10%] w-[300px] h-[300px] bg-yellow-500/30 rounded-full blur-[128px] animate-blob animation-delay-4000"></div>
      </div> */}
    </section>
  );
};
