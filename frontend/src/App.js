import styles from './App.module.css';
import Navbar from './components/navbar/Navbar'
import Footer from './components/footer/Footer'
import Home from './pages/home/Home'
import {BrowserRouter,Routes,Route} from 'react-router-dom'

function App() {
  return (
<div className={styles.container}>
<BrowserRouter>
<div className={styles.layout}>
<Navbar/>
  <Routes>
    <Route 
    path='/'
    exact
    element={	
  <div className={styles.main}>
    <Home/>
  </div>}/>
  <Route
	path='/crypto'
	exact
	element={
		<div className={styles.main}>
			crypto page
		</div>


		}
	/>
	<Route
	path='/blogs'
	exact
	element={
		<div className={styles.main}>
			blogs page
		</div>


		}
	/>
	<Route
	path='/submit'
	exact
	element={
		<div className={styles.main}>
			submit blog page
		</div>


		}
	/>
	<Route
	path='/log-in'
	exact
	element={
		<div className={styles.main}>
			login page
		</div>


		}
	/>
	<Route
	path='/sign-up'
	exact
	element={
		<div className={styles.main}>
			sign up page
		</div>


		}
	/>
    </Routes>
<Footer/>
</div>


</BrowserRouter>
</div>
  );
}

export default App;
