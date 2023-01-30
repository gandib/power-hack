import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateBilling = () => {
    const { id } = useParams();
    const { register, formState: { errors }, handleSubmit } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        console.log(data)
        const url = `https://power-hack-server-orcin.vercel.app/api/update-billing/${id}`;
        fetch(url, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json',
                authorization: `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify({ data })
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if (data) {
                    navigate('/');
                }
            })
    };

    return (
        <div className='flex justify-center'>
            <form onSubmit={handleSubmit(onSubmit)}>
                <h1 className='text-xl font-bold my-5'>Update Bill</h1>
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
        </div>
    );
};

export default UpdateBilling;