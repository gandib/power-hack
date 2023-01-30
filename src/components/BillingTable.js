import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

const BillingTable = () => {
    const { register, getValues, formState: { errors }, handleSubmit } = useForm();
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [amount, setAmount] = useState('');
    const [bills, setBills] = useState([]);
    const [postSuccess, setPostSuccess] = useState();


    const onSubmit = async (data) => {
        console.log(data)
        setId('Generating ID');
        setName(data?.name);
        setEmail(data?.email);
        setPhone(data?.phone);
        setAmount(data?.amount);

        const url = `http://localhost:5000/api/add-billing`;
        fetch(url, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                setPostSuccess(data);
            });
    }

    useEffect(() => {
        const url = `http://localhost:5000/api/billing-list`;
        fetch(url, {
            method: 'GET',
            headers: {
                'content-type': 'application/json'
            },
        })
            .then(res => res.json())
            .then(data => {
                setBills(data);
                setId('');
                setName('');
                setEmail('');
                setPhone('');
                setAmount('');
            });
    }, [id]);

    // sorting array
    const mapped = bills.map((v, i) => {
        return { i, value: (v) };
    });
    const descBills = mapped.sort((a, b) => (b.i) - (a.i));
    console.log(descBills);

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

    return (
        <div>

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
                            descBills?.map(bill => <tr key={bill.value._id}>
                                <td className="px-4 py-3">{bill.value._id}</td>
                                <td className="px-4 py-3">{bill.value.name}</td>
                                <td className="px-4 py-3">{bill.value.email}</td>
                                <td className="px-4 py-3">{bill.value.phone}</td>
                                <td className="px-4 py-3">{bill.value.amount}</td>
                                <td className="px-4 py-3 flex justify-between">
                                    <button className='btn btn-ghost'>Edit</button>
                                    <button className='btn btn-ghost'>Delete</button>
                                </td>
                            </tr>)
                        }

                    </tbody>
                </table>
            </div>


            <div className="btn-group mt-12">
                <button className="btn btn-xs">1</button>
                <button className="btn btn-xs btn-active">2</button>
                <button className="btn btn-xs">3</button>
                <button className="btn btn-xs">4</button>
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

export default BillingTable;