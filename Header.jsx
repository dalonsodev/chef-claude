import chefClaudeLogo from "./images/chef-claude-icon.png"

export default function Header() {
   return (
      <header>
         <a href="/" className="header-link">
            <img src={chefClaudeLogo} alt="Chef Claude logo."/>
            <h1>Chef Claude</h1>
         </a>
      </header>
   )
}