export default function Logo({ logoStyle }) {
    return (
      <div className="flex flex-col justify-center items-center mx-20">
        <img src="/PUP.png" alt="Polytechnic University of the Philippines logo" 
        className={logoStyle}
        style={{ transform: 'scale(2.5)' }} />
    </div>
    )
    }
