import { Footer } from "flowbite-react"
import { Link } from "react-router-dom"
import { BsFacebook, BsInstagram, BsGithub, BsDiscord, BsYoutube } from "react-icons/bs";

export const FooterComp = () => {
    return (
        <Footer container className="border border-t-8 border-teal-500">
            <div className="w-full max-w-7xl mx-auto">
                <div className="grid w-fill justify-between sm:flex md:grid-cols-1">
                    <div className="mt-5">
                        <Link to="/" className="self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white">
                            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">Nim'z</span>
                            Blog
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:hap-6">
                        <div>
                            <Footer.Title title="About" />
                            <Footer.LinkGroup col>
                                <Footer.Link href="https://www.100jsprojects.com" target="_blank" re="noopener noreferrer">
                                    100 JS Projects
                                </Footer.Link>
                            </Footer.LinkGroup>
                            <Footer.LinkGroup col>
                                <Footer.Link href="/">
                                    Nimz's Blog
                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                        <div>
                            <Footer.Title title="Follow us" />
                            <Footer.LinkGroup col>
                                <Footer.Link href="https://github.com/abinashnimz" target="_blank" re="noopener noreferrer">
                                    Github
                                </Footer.Link>
                            </Footer.LinkGroup>
                            <Footer.LinkGroup col>
                                <Footer.Link href="https://www.discord.com" target="_blank" re="noopener noreferrer">
                                    Discord
                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                        <div>
                            <Footer.Title title="Legal" />
                            <Footer.LinkGroup col>
                                <Footer.Link href="#">
                                    Privacy Policy
                                </Footer.Link>
                            </Footer.LinkGroup>
                            <Footer.LinkGroup col>
                                <Footer.Link href="#">
                                    Terms & Conditions
                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                    </div>
                </div>
                <Footer.Divider />
                <div className="w-full sm:flex sm:items-center sm:justify-between">
                    <Footer.Copyright href="#" by="Nim'z Blog" year={new Date().getFullYear()} />
                    <div className="flex gap-6 mt-4 sm:mt-0 sm:justify-center">
                        <Footer.Icon href="#" icon={BsFacebook} />
                        <Footer.Icon href="#" icon={BsInstagram} />
                        <Footer.Icon href="#" icon={BsDiscord} />
                        <Footer.Icon href="#" icon={BsGithub} />
                        <Footer.Icon href="#" icon={BsYoutube} />
                    </div>
                </div>
            </div>
        </Footer>
    )
}