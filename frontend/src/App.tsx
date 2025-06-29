import { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';
import Navbar from './components/NavBar';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Footer from './components/Footer';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Navbar />
        <AppRoutes />
        <Footer />
      </BrowserRouter>
    );
  }
}

export default App;
