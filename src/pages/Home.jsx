import { Link } from 'react-router-dom'

const Home = () => {
  const games = [ "Conga" ]

  return (
    <section className="home">
      <div className="home-content">
        <div className="home-headline">
          <h1 className="home-title">SCORER</h1>
          <p className="home-description">La aplicación ideal para manejar los puntajes en tus partidas</p>
        </div>
        <div className="home-container">
          <div className="home-container-grid">
            {games.map(g => {
              return (
                <Link key={g} to={g.toLowerCase()} className="home-container-grid-item">
                  <h3>{g}</h3>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Home