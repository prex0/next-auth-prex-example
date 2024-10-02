import CustomLink from "./custom-link"

export default function Footer() {
  return (
    <footer className="mx-0 my-4 flex w-full flex-col gap-4 px-4 text-sm sm:mx-auto sm:my-12 sm:h-5 sm:max-w-3xl sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row">
        <CustomLink href="https://www.prex0.com">
          Prex
        </CustomLink>
        <CustomLink href="https://nextjs.authjs.dev">Documentation</CustomLink>
        <CustomLink href="https://github.com/prex0/next-auth-prex-example">
          Source on GitHub
        </CustomLink>
      </div>
    </footer>
  )
}
