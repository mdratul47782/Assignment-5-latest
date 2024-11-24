
import { Link } from 'react-router-dom'; // Remove if not using react-router

function NotFoundPage() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>404</h1>
      <p style={styles.message}>Oops! The page you're looking for doesn't exist.</p>
      <Link to="/" style={styles.homeLink}>
        Go Back Home
      </Link>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    textAlign: 'center',
    backgroundColor: '#f9f9f9',
    color: '#333',
  },
  title: {
    fontSize: '6rem',
    fontWeight: 'bold',
    margin: 0,
  },
  message: {
    fontSize: '1.5rem',
    margin: '1rem 0',
  },
  homeLink: {
    marginTop: '1rem',
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    color: '#fff',
    backgroundColor: '#007BFF',
    textDecoration: 'none',
    borderRadius: '5px',
    transition: 'background-color 0.3s',
  },
};

export default NotFoundPage;
