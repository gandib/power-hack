import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

const Billing = () => {
    const { register, formState: { errors }, handleSubmit } = useForm();
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [amount, setAmount] = useState('');
    const [bills, setBills] = useState([]);
    const [allBills, setAllBills] = useState([]);
    const [postSuccess, setPostSuccess] = useState();
    const [pageCount, setPageCount] = useState(0);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [total, setTotal] = useState(0);
    const navigate = useNavigate();
    const [refresh, setRefresh] = useState(false);


    const onSubmit = async (data) => {
        console.log(data)
        setId('Generating ID');
        setName(data?.name);
        setEmail(data?.email);
        setPhone(data?.phone);
        setAmount(data?.amount);
        const createdAt = Date.now();
        setTotal(total + parseInt(amount));


        const url = `https://power-hack-server-orcin.vercel.app/api/add-billing`;
        fetch(url, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                authorization: `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify({ ...data, createdAt })
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                setPostSuccess(data);
                setRefresh(!refresh);
            });
    }


    useEffect(() => {
        const url = `https://power-hack-server-orcin.vercel.app/api/billing-list?page=${page}&size=${size}`;
        fetch(url, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                authorization: `Bearer ${localStorage.getItem('accessToken')}`
            },
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setBills(data.bills);
                setAllBills(data.allBills);
                const count = data?.allBills?.length;
                const pages = Math.ceil(count / size);
                console.log(count, page)
                setPageCount(pages);
            });
    }, [id, page, size, refresh]);


    const totalPaidArray = [];
    if (allBills) {
        for (let i = 0; i < allBills?.length; i++) {
            totalPaidArray.push(parseInt(allBills[i]?.amount));
        }
    }
    const totalPaid = totalPaidArray.reduce((pre, a) => pre + a, 0);

    useEffect(() => {
        setTotal(totalPaid);
    }, [id, totalPaid])

    console.log(postSuccess)

    let content;
    if (id && postSuccess?.success !== false) {
        content = <tr>
            <td className="px-4 py-1">{`${postSuccess?.success === true ? postSuccess.result.insertedId : id}`}</td>
            <td className="px-4 py-1">{name}</td>
            <td className="px-4 py-1">{email}</td>
            <td className="px-4 py-1">{phone}</td>
            <td className="px-4 py-1">{amount}</td>
            <td className="px-4 py-1 flex justify-between">
                <button className='btn btn-ghost'>Edit</button>
                <button className='btn btn-ghost'>Delete</button>
            </td>
        </tr>
    }

    if (postSuccess?.success === false && postSuccess?.message) {
        toast.error(postSuccess?.message);
    }

    if (!postSuccess) {
        content = '';
    }

    const deleteBill = (id) => {
        const url = `https://power-hack-server-orcin.vercel.app/api/delete-billing/${id}`;
        fetch(url, {
            method: 'DELETE',
            headers: {
                'content-type': 'application/json',
                authorization: `Bearer ${localStorage.getItem('accessToken')}`
            },
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setRefresh(!refresh);
            })
    };




    return (
        <div>
            <Layout totalPaid={total} />


            <div className="navbar bg-slate-100 mt-10 lg:w-4/5 w-full mx-auto overflow-auto">
                <div className="flex-1">
                    <h2 className="font-semibold text-xl pr-4">Billings</h2>
                    <div className="form-control">
                        <input type="text" placeholder="Search" className="input input-bordered" />
                    </div>
                </div>
                <div className="flex-none gap-2">
                    <label htmlFor="my-modal" className='btn btn-ghost font-semibold text-xl'>Add New Bill</label>
                </div>
            </div>


            <div className="lg:w-4/5 w-full mx-auto overflow-auto mt-4">
                <table className="table-auto w-full text-left whitespace-no-wrap">
                    <thead>
                        <tr>
                            <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 rounded-tl rounded-bl">Billing ID</th>
                            <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">Full Name</th>
                            <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">Email</th>
                            <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">Phone</th>
                            <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">Paid Amount</th>
                            <th className="px-4 py-6 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 flex justify-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {content}
                        {
                            bills?.map(bill => <tr key={bill._id}>
                                <td className="px-4 py-3">{bill._id}</td>
                                <td className="px-4 py-3">{bill.name}</td>
                                <td className="px-4 py-3">{bill.email}</td>
                                <td className="px-4 py-3">{bill.phone}</td>
                                <td className="px-4 py-3">{bill.amount}</td>
                                <td className="px-4 py-3 flex justify-between">
                                    <button onClick={() => navigate(`update-billing/${bill._id}`)} className='btn btn-ghost'>Edit</button>
                                    <button onClick={() => deleteBill(bill._id)} className='btn btn-ghost'>Delete</button>
                                </td>
                            </tr>)
                        }

                    </tbody>
                </table>
            </div>


            <div className="btn-group mt-12">
                {
                    [...Array(pageCount)?.keys()].map(number =>
                        <button
                            className={page === number ? 'btn btn-xs btn-active' : 'btn btn-xs'}
                            onClick={() => setPage(number)}>{number + 1}</button>)
                }
            </div>



            <input type="checkbox" id="my-modal" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-control w-full max-w-xs">
                            <label className="label">
                                <span className="label-text">Full Name</span>
                            </label>
                            <input type="name" placeholder="Your Full Name" className="input input-bordered w-full max-w-xs"
                                {...register("name", {
                                    required: {
                                        value: true,
                                        message: 'Full Name is Required'
                                    },
                                })} />
                            <label className="label">
                                {errors.name?.type === 'required' && <span className="label-text-alt text-red-500">{errors.name.message}</span>}
                            </label>
                        </div>

                        <div className="form-control w-full max-w-xs">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input type="email" placeholder="Your Email" className="input input-bordered w-full max-w-xs"
                                {...register("email", {
                                    required: {
                                        value: true,
                                        message: 'Email is Required'
                                    },
                                    pattern: {
                                        value: /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/,
                                        message: 'Provide a valid Email'
                                    }
                                })} />
                            <label className="label">
                                {errors.email?.type === 'required' && <span className="label-text-alt text-red-500">{errors.email.message}</span>}
                                {errors.email?.type === 'pattern' && <span className="label-text-alt text-red-500">{errors.email.message}</span>}
                            </label>
                        </div>

                        <div className="form-control w-full max-w-xs">
                            <label className="label">
                                <span className="label-text">Phone</span>
                            </label>
                            <input type="number" placeholder="Your Phone Number" className="input input-bordered w-full max-w-xs"
                                {...register("phone", {

                                    required: {
                                        value: true,
                                        message: 'Phone Number is Required'
                                    },
                                    pattern: {
                                        value: /[0-9]/,
                                        message: 'Provide Number'
                                    },
                                    minLength: {
                                        value: 11,
                                        message: 'Number should not less than 11 digits'
                                    },
                                    maxLength: {
                                        value: 11,
                                        message: 'Number should not more than 11 digits '
                                    },
                                })} />
                            <label className="label">
                                {errors.phone?.type === 'required' && <span className="label-text-alt text-red-500">{errors.phone.message}</span>}
                                {errors.phone?.type === 'pattern' && <span className="label-text-alt text-red-500">{errors.phone.message}</span>}
                                {errors.phone?.type === 'minLength' && <span className="label-text-alt text-red-500">{errors.phone.message}</span>}
                                {errors.phone?.type === 'maxLength' && <span className="label-text-alt text-red-500">{errors.phone.message}</span>}
                                {errors.phone?.type === 'number' && <span className="label-text-alt text-red-500">{errors.phone.message}</span>}

                            </label>
                        </div>

                        <div className="form-control w-full max-w-xs">
                            <label className="label">
                                <span className="label-text">Payable Amount</span>
                            </label>
                            <input type="number" placeholder="Payable Amount" className="input input-bordered w-full max-w-xs"
                                {...register("amount", {
                                    required: {
                                        value: true,
                                        message: 'Amount is Required'
                                    },
                                })} />
                            <label className="label">
                                {errors.amount?.type === 'required' && <span className="label-text-alt text-red-500">{errors.amount.message}</span>}
                            </label>
                        </div>

                        <button htmlFor='my-modal' className='btn btn-secondary w-full max-w-xs flex justify-start'>Submit</button>
                    </form>
                    <div className="modal-action">
                        <label htmlFor="my-modal" className="btn">Cancel</label>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Billing;