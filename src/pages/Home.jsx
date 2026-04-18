import { Link } from 'react-router-dom'

const Home = () => {
  const games = [
    {
      name: 'Conga',
      img: '/conga.webp',
      wip: false
    },
    {
      name: 'Poker',
      img: '/poker.jpg',
      wip: true
    }
  ]

  return (
    <section className="home">
      <div className="home-header">
        <h2 className="home-title">Scorer</h2>
      </div>
      <div className="home-content">
        <div className="home-description">
          <p className="home-dot">Marcador de partidas</p>
          <h2 className="home-headline">El puntaje, en <span style={{ color: 'var(--accent)', fontStyle: 'italic' }}>tus</span> manos.</h2>
          <p className="home-description-text">Registrá cada ronda, seguí el historial y sabé siempre quién va ganando. Simple, rápido y sin papel.</p>
        </div>
        <div className="home-container">
          <div className="home-container-grid">
            {games.map(g => {
              return (
                <Link key={g.name} to={g.name.toLowerCase()} className="home-container-grid-item" style={{ backgroundImage: `linear-gradient(rgba(255, 248, 240, 0.8), rgba(255, 248, 240, 1)), url('${g.img}')` }}>
                  {g.wip ? <h3>{g.name} (WIP)</h3> : <h3>{g.name}</h3>}
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