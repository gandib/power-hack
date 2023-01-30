import React from 'react';
import { Link } from 'react-router-dom';

const Layout = ({ totalPaid }) => {


    return (
        <div>
            <div className="navbar px-12 bg-slate-100">
                <div className="flex-1">
                    <h1 className='font-semibold text-xl'><Link to='/'>Power-Hack</Link></h1>
                </div>
                <div className="flex-none">
                    <ul className="menu menu-horizontal px-1">
                        <li className='font-semibold text-xl'>Paid Total: {totalPaid || 0}</li>
                    </ul>
                </div>
            </div>

        </div>
    );
};

export default Layout;