export default function Logo({ logoStyle, pupNameStyle, websiteNameStyle }) {
  return (
    <div className="flex mx-20">
      <img src="/PUP.png" alt="Polytechnic University of the Philippines logo" className={logoStyle} />
      <div className="flex flex-col justify-center ml-2">
        <p className={pupNameStyle}>Polytechnic University of the Philippines - Manila</p>
        <p className={websiteNameStyle}>MOA Monitoring System</p>
      </div>
  </div>
  )
}
