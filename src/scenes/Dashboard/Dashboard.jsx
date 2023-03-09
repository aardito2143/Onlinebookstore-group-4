import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

export default function Dashboard() {
    const notify = () => toast("I am Toast!");

    return (
        <div>
            <div>This is an Admin Dashboard for Admin's only</div>
            <button onClick={notify}>Click me to see some Toast!</button>
            <Link to="/dashboard/add-product">Go to New Product Page</Link>
        </div>
         
    )
}