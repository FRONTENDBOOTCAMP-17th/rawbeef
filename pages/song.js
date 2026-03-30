import '../style.css';
import { createSidebar } from '../components/sidebar.js';

const app = document.getElementById('app');
app.insertBefore(createSidebar(), app.firstChild);
