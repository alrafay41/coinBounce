import styles from './App.module.css';
import Navbar from './components/navbar/Navbar'
import Footer from './components/footer/Footer'
import Home from './pages/home/Home'
import Error from './pages/error/Error';
import Protected from './components/protected/Protected';
import {BrowserRouter,Routes,Route} from 'react-router-dom'

function App() {
	const isAuth=false
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
  </div>
}
/>
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
		<Protected isAuth={isAuth}>
		<div className={styles.main}>
			blogs page
		</div>
		</Protected>
		}
	/>
	<Route
	path='/submit'
	exact
	element={
		<Protected isAuth={isAuth}>
					<div className={styles.main}>
			submit blog page
		</div>
		</Protected>



		}
	/>
	<Route
	path='/login'
	exact
	element={
		<div className={styles.main}>
			login page
		</div>


		}
	/>
	<Route
	path='/signup'
	exact
	element={
		<div className={styles.main}>
			sign up page
		</div>


		}
	/>
	<Route
	path='*'
	exact
	element={
		<div className={styles.main}>
			<Error/>
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
